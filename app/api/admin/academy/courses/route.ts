import { NextRequest, NextResponse } from "next/server";
import { getServerUser, createSupabaseAdminClient } from "@/lib/auth/supabase";
import { requireRole } from "@/lib/auth/permissions";
import { revalidatePath } from "next/cache";

async function assertAdmin() {
  const user = await getServerUser();
  if (!user) return null;
  const { allowed } = await requireRole(user.id, "admin");
  return allowed ? user : null;
}

// GET — all courses including unpublished (admin only)
export async function GET() {
  if (!await assertAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("courses")
    .select("*, modules(id, title, position, lessons(id, title, position, is_published, lesson_type))")
    .order("level").order("position");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ courses: data ?? [] });
}

// POST — create a new course
export async function POST(req: NextRequest) {
  if (!await assertAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const { title, subtitle, description, level, slug, is_free, thumbnail_url } = body as {
    title: string; subtitle?: string; description?: string;
    level: number; slug: string; is_free?: boolean; thumbnail_url?: string;
  };
  if (!title || !slug || !level) return NextResponse.json({ error: "title, slug, and level are required" }, { status: 400 });

  const admin = createSupabaseAdminClient();

  // Auto-position at end of this level
  const { count } = await admin.from("courses").select("id", { count: "exact", head: true }).eq("level", level);
  const position = (count ?? 0) + 1;

  const { data, error } = await admin.from("courses").insert({
    title, subtitle: subtitle ?? null, description: description ?? null,
    level, slug, is_free: is_free ?? false, is_published: false,
    position, thumbnail_url: thumbnail_url ?? null,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/academy/courses");
  return NextResponse.json({ course: data }, { status: 201 });
}
