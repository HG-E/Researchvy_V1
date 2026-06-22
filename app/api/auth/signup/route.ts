import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/auth/supabase";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

const ORCID_FORMAT = /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/;

function readPendingOrcid(req: NextRequest): { orcid: string; verified: boolean } {
  const raw = req.cookies.get("orcid_pending")?.value;
  if (!raw) return { orcid: "", verified: false };

  try {
    const parsed = JSON.parse(raw) as { orcid?: unknown; ts?: unknown };
    const orcid  = typeof parsed.orcid === "string" ? parsed.orcid : "";
    const ts     = typeof parsed.ts    === "number"  ? parsed.ts    : 0;
    const fresh  = Date.now() - ts < 10 * 60 * 1000; // 10 minute window
    const valid  = ORCID_FORMAT.test(orcid) && fresh;
    return { orcid: valid ? orcid : "", verified: valid };
  } catch {
    return { orcid: "", verified: false };
  }
}

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
    const safeRedirect = rawRedirect.startsWith("/") && !rawRedirect.startsWith("//")
      ? rawRedirect
      : "/dashboard";

    // Read server-side ORCID cookie — cannot be forged from client JS
    const { orcid, verified: orcidVerified } = readPendingOrcid(req);

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          institutional_affiliation: institutional_affiliation ?? "",
          ...(orcidVerified ? { orcid, orcid_verified: true } : {}),
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

    // Fire-and-forget welcome email
    const firstName = full_name.split(" ")[0] ?? full_name;
    import("@/lib/email").then(({ sendWelcomeEmail }) =>
      sendWelcomeEmail({ to: email, firstName }).catch(console.error)
    ).catch(console.error);

    // Clear the pending ORCID cookie now that it has been consumed
    const response = NextResponse.json({ ok: true });
    if (orcidVerified) {
      response.cookies.set("orcid_pending", "", { maxAge: 0, path: "/" });
    }
    return response;
  } catch (e: unknown) {
    console.error("[signup]", e);
    return NextResponse.json({ error: "An error occurred. Please try again." }, { status: 500 });
  }
}
