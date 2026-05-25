import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient, getServerUser } from "@/lib/auth/supabase";

export async function POST(req: NextRequest) {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createSupabaseAdminClient();

  const { data: profile } = await admin
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const { clinic_slug, cohort_id, session_number } = body as {
    clinic_slug:    string;
    cohort_id:      string;
    session_number: number;
  };

  if (!clinic_slug || !cohort_id || !session_number) {
    return NextResponse.json({ error: "clinic_slug, cohort_id, and session_number are required" }, { status: 400 });
  }

  const { error } = await admin
    .from("clinic_session_unlocks")
    .upsert(
      { clinic_slug, cohort_id, session_number, unlocked_by: user.email },
      { onConflict: "clinic_slug,cohort_id,session_number" }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
