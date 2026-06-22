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
  const update: Record<string, unknown> = {};
  for (const key of ["title", "description", "position"]) {
    if (key in body) update[key] = body[key];
  }
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.from("modules").update(update).eq("id", id).select().single();
  if (error) { console.error("[admin/academy/modules] PATCH", error.message); return NextResponse.json({ error: "Failed to update module" }, { status: 500 }); }
  return NextResponse.json({ module: data });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await assertAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const admin = createSupabaseAdminClient();
  // Cascade: delete lessons first
  await admin.from("lessons").delete().eq("module_id", id);
  const { error } = await admin.from("modules").delete().eq("id", id);
  if (error) { console.error("[admin/academy/modules] DELETE", error.message); return NextResponse.json({ error: "Failed to delete module" }, { status: 500 }); }
  return NextResponse.json({ ok: true });
}
