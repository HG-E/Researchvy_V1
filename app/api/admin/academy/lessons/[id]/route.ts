import { NextRequest, NextResponse } from "next/server";
import { getServerUser, createSupabaseAdminClient } from "@/lib/auth/supabase";
import { requireRole } from "@/lib/auth/permissions";

async function assertAdmin() {
  const user = await getServerUser();
  if (!user) return null;
  const { allowed } = await requireRole(user.id, "admin");
  return allowed ? user : null;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await assertAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const body = await req.json();

  const allowed = [
    "title","slug","lesson_type","video_provider","video_id","video_url",
    "content_md","duration_seconds","is_free_preview","is_published","position",
  ];
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.from("lessons").update(update).eq("id", id).select().single();
  if (error) { console.error("[admin/academy/lessons] PATCH", error.message); return NextResponse.json({ error: "Failed to update lesson" }, { status: 500 }); }
  return NextResponse.json({ lesson: data });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await assertAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const admin = createSupabaseAdminClient();
  // Remove progress records before deleting the lesson
  await admin.from("lesson_progress").delete().eq("lesson_id", id);
  const { error } = await admin.from("lessons").delete().eq("id", id);
  if (error) { console.error("[admin/academy/lessons] DELETE", error.message); return NextResponse.json({ error: "Failed to delete lesson" }, { status: 500 }); }
  return NextResponse.json({ ok: true });
}
