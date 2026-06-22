import { NextRequest, NextResponse } from "next/server";
import { getServerUser, createSupabaseAdminClient } from "@/lib/auth/supabase";
import { requireRole } from "@/lib/auth/permissions";

const VALID_STATUSES = ["new", "contacted", "in_progress", "closed"];

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
  const { status } = await req.json() as { status: string };

  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("partnership_enquiries")
    .update({ status })
    .eq("id", id);

  if (error) { console.error("[admin/partnerships] PATCH", error.message); return NextResponse.json({ error: "Failed to update partnership status" }, { status: 500 }); }
  return NextResponse.json({ ok: true });
}
