import { NextResponse } from "next/server";
import { createSupabaseAdminClient, getServerUser } from "@/lib/auth/supabase";

/** Generate or retrieve the current user's referral code. */
export async function GET() {
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createSupabaseAdminClient();

  // Return existing code if already generated
  const { data: existing } = await admin
    .from("referral_codes")
    .select("code, uses, earnings_ngn, earnings_usd")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) return NextResponse.json(existing);

  // Generate a new code: first 6 chars of their name/email + random 3 digits
  const base = (
    (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ||
    user.email?.split("@")[0] ||
    "RVY"
  ).toUpperCase().replace(/[^A-Z]/g, "").slice(0, 7);

  const suffix = String(Math.floor(100 + Math.random() * 900));
  const code   = `${base}${suffix}`;

  const { data, error } = await admin
    .from("referral_codes")
    .insert({ user_id: user.id, code })
    .select("code, uses, earnings_ngn, earnings_usd")
    .single();

  if (error) return NextResponse.json({ error: "Could not generate code" }, { status: 500 });
  return NextResponse.json(data);
}
