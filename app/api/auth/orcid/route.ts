import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/auth/supabase";
import { randomBytes } from "crypto";

const ORCID_AUTH_URL = "https://orcid.org/oauth/authorize";
const CLIENT_ID      = process.env.ORCID_CLIENT_ID;
const REDIRECT_URI   = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/orcid/callback`;

export async function GET(req: NextRequest) {
  if (!CLIENT_ID) {
    return NextResponse.json({ error: "ORCID integration not configured" }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const rawNext = searchParams.get("next") ?? "";
  const next    = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard";

  // Determine if user is already authenticated (profile linking vs sign-in flow)
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const mode = user ? "link" : "signin";

  const state = randomBytes(20).toString("hex");

  const params = new URLSearchParams({
    client_id:     CLIENT_ID,
    response_type: "code",
    scope:         "/authenticate",
    redirect_uri:  REDIRECT_URI,
    state,
  });

  const response = NextResponse.redirect(`${ORCID_AUTH_URL}?${params.toString()}`);

  // Store state + context in cookies for CSRF validation and flow routing
  const cookieOpts = {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge:   600,
    path:     "/",
  };

  response.cookies.set("orcid_oauth_state", state, cookieOpts);
  response.cookies.set("orcid_oauth_next",  next,  cookieOpts);
  response.cookies.set("orcid_oauth_mode",  mode,  cookieOpts);

  return response;
}
