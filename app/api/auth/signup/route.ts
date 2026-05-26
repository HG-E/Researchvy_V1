import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/auth/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email, password, full_name, institutional_affiliation, redirectTo } = await req.json();

    if (!email || !password || !full_name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          institutional_affiliation: institutional_affiliation ?? "",
        },
        emailRedirectTo: redirectTo ?? `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/dashboard`,
      },
    });

    if (error) {
      const msg = error.message.includes("already registered")
        ? "An account with this email already exists. Try signing in instead."
        : error.message;
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: `Server error: ${msg}` }, { status: 500 });
  }
}
