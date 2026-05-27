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

// PATCH — update course fields
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await assertAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const body = await req.json();

  const allowed = ["title","subtitle","description","level","slug","is_free","is_published","thumbnail_url","trailer_url","duration_minutes","position"];
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.from("courses").update(update).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Revalidate public course pages
  if (data?.slug) {
    revalidatePath(`/academy/courses/${data.slug}`);
    revalidatePath("/academy/courses");
  }
  return NextResponse.json({ course: data });
}

// DELETE — hard delete course (only if no enrollments)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await assertAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const admin = createSupabaseAdminClient();

  const { count } = await admin.from("enrollments").select("id", { count: "exact", head: true }).eq("course_id", id);
  if ((count ?? 0) > 0) {
    return NextResponse.json({ error: "Cannot delete a course with active enrollments. Unpublish it instead." }, { status: 409 });
  }

  const { error } = await admin.from("courses").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/academy/courses");
  return NextResponse.json({ ok: true });
}
