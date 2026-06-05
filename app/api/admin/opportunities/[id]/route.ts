import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient, getServerUser } from "@/lib/auth/supabase";
import { requireRole } from "@/lib/auth/permissions";

async function isAdmin(callerId: string): Promise<boolean> {
  const { allowed } = await requireRole(callerId, "admin");
  return allowed;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const caller = await getServerUser();
  if (!caller) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await isAdmin(caller.id))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const raw     = await request.json().catch(() => ({})) as Record<string, unknown>;
  const ALLOWED = ["title","body","category","target_level","apply_url","deadline","is_published","is_featured","funder","value","currency"];
  const updateData = Object.fromEntries(Object.entries(raw).filter(([k]) => ALLOWED.includes(k)));
  if (!Object.keys(updateData).length) return NextResponse.json({ error: "No valid fields provided" }, { status: 400 });
  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("research_opportunities").update(updateData).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const caller = await getServerUser();
  if (!caller) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await isAdmin(caller.id))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("research_opportunities").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
