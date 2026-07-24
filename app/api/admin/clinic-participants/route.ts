import { NextRequest, NextResponse } from "next/server";
import { getServerUser, createSupabaseAdminClient } from "@/lib/auth/supabase";
import { requireRole } from "@/lib/auth/permissions";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { allowed } = await requireRole(user.id, "admin");
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("clinic_participants")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { allowed } = await requireRole(user.id, "admin");
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json() as Record<string, unknown>;
  const email      = (body.email as string)?.toLowerCase().trim();
  const full_name  = (body.full_name as string)?.trim();
  const bundle     = body.bundle as string;

  if (!email || !full_name || !bundle) {
    return NextResponse.json({ error: "email, full_name, and bundle are required" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("clinic_participants")
    .insert({
      email,
      full_name,
      phone:             (body.phone as string)?.trim() || null,
      bundle,
      track:             (body.track as string) || null,
      mode:              (body.mode as string) || "online",
      payment_ref:       (body.payment_ref as string)?.trim() || null,
      notes:             (body.notes as string)?.trim() || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
