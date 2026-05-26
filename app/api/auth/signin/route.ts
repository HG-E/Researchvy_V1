import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/auth/supabase";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // 10 attempts per 15 minutes per IP
    const { allowed } = checkRateLimit(getRateLimitKey(req, "signin"), 10, 15 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many sign-in attempts. Please wait 15 minutes and try again." },
        { status: 429 }
      );
    }

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
