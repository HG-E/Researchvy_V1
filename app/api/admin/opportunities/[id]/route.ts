import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient, getServerUser } from "@/lib/auth/supabase";
import { requireRole } from "@/lib/auth/permissions";

async function guard() {
  const user = await getServerUser();
  if (!user) return null;
  const { allowed } = await requireRole(user.id, "admin");
  return allowed ? user : null;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const caller = await guard();
  if (!caller) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const body   = await req.json();
  const admin  = createSupabaseAdminClient();
  const update: Record<string, unknown> = {};
  for (const key of ["title","body","category","funder","value","deadline","apply_url","target_level","is_published","is_featured"]) {
    if (key in body) update[key] = body[key];
  }
  const { error } = await admin.from("research_opportunities").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const caller = await guard();
  if (!caller) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const admin  = createSupabaseAdminClient();
  const { error } = await admin.from("research_opportunities").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
