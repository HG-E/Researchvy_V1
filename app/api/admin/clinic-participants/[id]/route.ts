import { NextRequest, NextResponse } from "next/server";
import { getServerUser, createSupabaseAdminClient } from "@/lib/auth/supabase";
import { requireRole } from "@/lib/auth/permissions";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { allowed } = await requireRole(user.id, "admin");
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json() as Record<string, unknown>;

  const updates: Record<string, unknown> = {};

  if (body.status !== undefined) {
    const s = body.status as string;
    if (!["pending", "active", "revoked"].includes(s)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    updates.status = s;
    if (s === "active") {
      updates.approved_at = new Date().toISOString();
      updates.approved_by = user.email;
    }
    if (s === "pending" || s === "revoked") {
      updates.approved_at = null;
      updates.approved_by = null;
    }
  }
  if (body.notes             !== undefined) updates.notes              = body.notes;
  if (body.whatsapp_group_url !== undefined) updates.whatsapp_group_url = body.whatsapp_group_url;
  if (body.track             !== undefined) updates.track              = body.track;

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("clinic_participants")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
