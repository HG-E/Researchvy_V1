import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/auth/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      const msg =
        error.message === "Invalid login credentials"
          ? "Incorrect email or password. Please check and try again."
          : error.message;
      return NextResponse.json({ error: msg }, { status: 401 });
    }

    return NextResponse.json({ ok: true, userId: data.user?.id });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: `Server error: ${msg}` }, { status: 500 });
  }
}
