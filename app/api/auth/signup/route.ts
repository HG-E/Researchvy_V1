import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/auth/supabase";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // 5 registrations per hour per IP
    const { allowed } = await checkRateLimit(getRateLimitKey(req, "signup"), 5, 60 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please try again in an hour." },
        { status: 429 }
      );
    }

    const { email, password, full_name, institutional_affiliation, redirectTo } = await req.json();

    if (!email || !password || !full_name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 });
    }

    const rawRedirect  = typeof redirectTo === "string" ? redirectTo : "/dashboard";
    const safeRedirect = rawRedirect.startsWith("/") && !rawRedirect.startsWith("//") ? rawRedirect : "/dashboard";

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          institutional_affiliation: institutional_affiliation ?? "",
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://researchvy.com"}/auth/callback?next=${encodeURIComponent(safeRedirect)}`,
      },
    });

    if (error) {
      const msg = error.message.includes("already registered")
        ? "An account with this email already exists. Try signing in instead."
        : error.message;
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    // Fire-and-forget welcome email — never block the signup response
    const firstName = full_name.split(" ")[0] ?? full_name;
    import("@/lib/email").then(({ sendWelcomeEmail }) =>
      sendWelcomeEmail({ to: email, firstName }).catch(console.error)
    ).catch(console.error);

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: `Server error: ${msg}` }, { status: 500 });
  }
}
