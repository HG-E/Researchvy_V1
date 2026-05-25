import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/auth/supabase";
import { requireRole } from "@/lib/auth/permissions";

export async function PATCH(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { allowed } = await requireRole(user.id, "admin");
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const { table, id, status } = body as { table: string; id: string; status: string };

  const validTables  = ["clinic_enquiries", "academy_enquiries", "partnership_enquiries"];
  const validStatuses = ["pending", "contacted", "enrolled", "declined", "new", "in_progress", "closed"];

  if (!validTables.includes(table))   return NextResponse.json({ error: "Invalid table" },  { status: 400 });
  if (!validStatuses.includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const admin = createSupabaseAdminClient();
  const { error } = await admin.from(table).update({ status }).eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
