import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/auth/supabase";
import { requireRole } from "@/lib/auth/permissions";

async function getAdminUser() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { allowed } = await requireRole(user.id, "admin");
  return allowed ? user : null;
}

// PATCH — update registration status and/or notes
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const caller = await getAdminUser();
  if (!caller) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  let body: { status?: string; admin_notes?: string } = {};
  try { body = await req.json(); } catch { /* empty ok */ }

  const VALID_STATUSES = ["new", "contacted", "attended", "no_show", "converted"];
  const update: Record<string, string> = {};

  if (body.status) {
    if (!VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    update.status = body.status;
  }

  if (typeof body.admin_notes === "string") {
    update.admin_notes = body.admin_notes;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("pre_clinic_registrations")
    .update(update)
    .eq("id", id);

  if (error) { console.error("[admin/pre-clinic] PATCH", error.message); return NextResponse.json({ error: "Failed to update registration" }, { status: 500 }); }
  return NextResponse.json({ ok: true });
}
