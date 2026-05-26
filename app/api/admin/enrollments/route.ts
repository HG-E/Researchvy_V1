import { NextRequest, NextResponse } from "next/server";
import { getServerUser, createSupabaseAdminClient } from "@/lib/auth/supabase";
import { requireRole } from "@/lib/auth/permissions";
import type { EnrollmentTier, EnrollmentSource } from "@/types/academy";

async function assertAdmin() {
  const user = await getServerUser();
  if (!user) return null;
  const { allowed } = await requireRole(user.id, "admin");
  return allowed ? user : null;
}

// ── GET /api/admin/enrollments ────────────────────────────────────────────────
// Returns all enrollments with course title + level, and user full_name.
// Emails come from the auth API (separate call).

export async function GET() {
  const caller = await assertAdmin();
  if (!caller) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const admin = createSupabaseAdminClient();

    // Enrollments + courses (FK join)
    const { data: enrollments, error } = await admin
      .from("enrollments")
      .select(`
        id, user_id, course_id, tier, source,
        enrolled_at, expires_at, completed_at,
        courses (id, title, level, slug)
      `)
      .order("enrolled_at", { ascending: false });

    if (error) throw error;

    // User profiles (full_name)
    const userIds = [...new Set((enrollments ?? []).map((e: { user_id: string }) => e.user_id))];
    const { data: profiles } = await admin
      .from("users")
      .select("id, full_name")
      .in("id", userIds);

    // Auth emails — batch via listUsers (up to 1000)
    const { data: authData } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const emailMap: Record<string, string> = {};
    for (const u of authData?.users ?? []) emailMap[u.id] = u.email ?? "";
    const nameMap: Record<string, string> = {};
    for (const p of profiles ?? []) nameMap[(p as { id: string; full_name: string }).id] = (p as { id: string; full_name: string }).full_name ?? "";

    const rows = (enrollments ?? []).map((e: Record<string, unknown>) => ({
      ...e,
      user_email: emailMap[e.user_id as string] ?? "",
      user_name:  nameMap[e.user_id as string] ?? "",
    }));

    return NextResponse.json({ enrollments: rows });
  } catch (err) {
    console.error("[admin/enrollments GET]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// ── POST /api/admin/enrollments ───────────────────────────────────────────────
// Create a new enrollment. Body: { user_email, course_id, tier, expires_at? }

export async function POST(req: NextRequest) {
  const caller = await assertAdmin();
  if (!caller) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { user_email, course_id, tier, expires_at } = await req.json() as {
      user_email: string;
      course_id:  string;
      tier:       EnrollmentTier;
      expires_at: string | null;
    };

    if (!user_email || !course_id || !tier) {
      return NextResponse.json({ error: "user_email, course_id, and tier are required" }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();

    // Resolve user_id from email
    const { data: authData } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const authUser = (authData?.users ?? []).find(
      (u: { email?: string }) => u.email?.toLowerCase() === user_email.toLowerCase()
    );
    if (!authUser) {
      return NextResponse.json({ error: "No user found with that email address" }, { status: 404 });
    }

    // Guard: already enrolled?
    const { data: existing } = await admin
      .from("enrollments")
      .select("id, expires_at")
      .eq("user_id", authUser.id)
      .eq("course_id", course_id)
      .maybeSingle();

    if (existing) {
      const active = !existing.expires_at || new Date(existing.expires_at as string) > new Date();
      if (active) {
        return NextResponse.json(
          { error: "User already has an active enrollment for this course" },
          { status: 409 }
        );
      }
    }

    const { data: enrollment, error } = await admin
      .from("enrollments")
      .insert({
        user_id:    authUser.id,
        course_id,
        tier:       tier as EnrollmentTier,
        source:     "admin" as EnrollmentSource,
        expires_at: expires_at ?? null,
      })
      .select()
      .single();

    if (error) throw error;

    // Send welcome email — fire and forget, never block the response
    triggerEnrollmentEmail({
      to:          authUser.email ?? "",
      userId:      authUser.id,
      courseId:    course_id,
    }).catch(console.error);

    return NextResponse.json({ enrollment }, { status: 201 });
  } catch (err) {
    console.error("[admin/enrollments POST]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

async function triggerEnrollmentEmail(opts: {
  to:       string;
  userId:   string;
  courseId: string;
}) {
  if (!opts.to) return;
  const { createSupabaseAdminClient } = await import("@/lib/auth/supabase");
  const { sendEnrollmentWelcomeEmail } = await import("@/lib/email");
  const admin = createSupabaseAdminClient();

  const [{ data: profile }, { data: course }] = await Promise.all([
    admin.from("users").select("full_name").eq("id", opts.userId).maybeSingle(),
    admin.from("courses")
      .select("title, level, slug, modules(lessons(id, position, is_published))")
      .eq("id", opts.courseId)
      .single(),
  ]);

  if (!course) return;

  const firstName     = (profile?.full_name as string | null)?.split(" ")[0] ?? "Researcher";
  // Get the first published lesson across all modules
  const allLessons    = (course.modules as Array<{ lessons: Array<{ id: string; position: number; is_published: boolean }> }>)
    .flatMap((m) => m.lessons)
    .filter((l) => l.is_published)
    .sort((a, b) => a.position - b.position);
  const firstLessonId = allLessons[0]?.id;

  await sendEnrollmentWelcomeEmail({
    to:             opts.to,
    firstName,
    courseName:     course.title as string,
    courseSlug:     course.slug as string,
    courseLevel:    course.level as number,
    firstLessonId,
  });
}

// ── PATCH /api/admin/enrollments ─────────────────────────────────────────────
// Revoke an enrollment: set expires_at to now. Body: { enrollment_id }

export async function PATCH(req: NextRequest) {
  const caller = await assertAdmin();
  if (!caller) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { enrollment_id } = await req.json() as { enrollment_id: string };
    if (!enrollment_id) {
      return NextResponse.json({ error: "enrollment_id required" }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();
    const { error } = await admin
      .from("enrollments")
      .update({ expires_at: new Date().toISOString() })
      .eq("id", enrollment_id);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/enrollments PATCH]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
