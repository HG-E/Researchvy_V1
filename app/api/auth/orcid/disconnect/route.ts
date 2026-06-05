import { NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/auth/supabase";

export async function POST() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { error } = await supabase.auth.updateUser({
    data: {
      orcid:          "",
      orcid_verified: false,
    },
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const admin = createSupabaseAdminClient();
  await admin.from("users").update({ orcid: "" }).eq("id", user.id);

  return NextResponse.json({ ok: true });
}
