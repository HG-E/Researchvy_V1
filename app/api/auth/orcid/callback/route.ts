import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/auth/supabase";

const ORCID_TOKEN_URL = "https://orcid.org/oauth/token";
const CLIENT_ID       = process.env.ORCID_CLIENT_ID;
const CLIENT_SECRET   = process.env.ORCID_CLIENT_SECRET;
const REDIRECT_URI    = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/orcid/callback`;
const SITE_URL        = process.env.NEXT_PUBLIC_SITE_URL ?? "";

function clearOrcidCookies(response: NextResponse) {
  response.cookies.set("orcid_oauth_state", "", { maxAge: 0, path: "/" });
  response.cookies.set("orcid_oauth_next",  "", { maxAge: 0, path: "/" });
  response.cookies.set("orcid_oauth_mode",  "", { maxAge: 0, path: "/" });
}

function errorRedirect(reason: string, next = "/dashboard") {
  const dest = next.startsWith("/signin") ? "/signin" : "/dashboard/profile";
  const res  = NextResponse.redirect(`${SITE_URL}${dest}?orcid_error=${encodeURIComponent(reason)}`);
  clearOrcidCookies(res);
  return res;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code  = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const cookieState = req.cookies.get("orcid_oauth_state")?.value;
  const cookieNext  = req.cookies.get("orcid_oauth_next")?.value ?? "/dashboard";
  const cookieMode  = req.cookies.get("orcid_oauth_mode")?.value ?? "link";

  if (error) return errorRedirect("ORCID authorisation denied", cookieNext);
  if (!code)  return errorRedirect("Missing authorisation code", cookieNext);

  // CSRF validation
  if (!state || !cookieState || state !== cookieState) {
    return errorRedirect("State mismatch — possible CSRF, please try again", cookieNext);
  }

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return errorRedirect("ORCID integration not configured", cookieNext);
  }

  // Exchange code for token
  let orcidId: string;
  try {
    const tokenRes = await fetch(ORCID_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept:         "application/json",
      },
      body: new URLSearchParams({
        client_id:     CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type:    "authorization_code",
        code,
        redirect_uri:  REDIRECT_URI,
      }).toString(),
    });

    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      console.error("[ORCID callback] token exchange failed:", text);
      return errorRedirect("Token exchange failed — please try again", cookieNext);
    }

    const json = await tokenRes.json() as { orcid?: string; error?: string };
    if (!json.orcid) return errorRedirect("ORCID did not return an iD", cookieNext);
    orcidId = json.orcid;
  } catch (err) {
    console.error("[ORCID callback] fetch error:", err);
    return errorRedirect("Network error — please try again", cookieNext);
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  // ── PROFILE LINKING FLOW (user already signed in) ────────────────────────
  if (cookieMode === "link" && user) {
    const { error: authError } = await supabase.auth.updateUser({
      data: { orcid: orcidId, orcid_verified: true },
    });

    if (authError) {
      console.error("[ORCID callback] updateUser error:", authError.message);
      return errorRedirect("Failed to save ORCID — please try again", cookieNext);
    }

    const admin = createSupabaseAdminClient();
    await admin.from("users").update({ orcid: orcidId }).eq("id", user.id);

    const response = NextResponse.redirect(`${SITE_URL}/dashboard/profile?orcid_connected=1`);
    clearOrcidCookies(response);
    return response;
  }

  // ── SIGN-IN FLOW (unauthenticated) ───────────────────────────────────────
  const admin = createSupabaseAdminClient();

  // Look up existing account by ORCID iD
  const { data: existingUser } = await admin
    .from("users")
    .select("id, email")
    .eq("orcid", orcidId)
    .maybeSingle();

  if (existingUser?.email) {
    // Known ORCID → generate a magic link and auto-sign the user in
    const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
      type:       "magiclink",
      email:      existingUser.email,
      options:    { redirectTo: `${SITE_URL}${cookieNext}` },
    });

    if (linkError || !linkData.properties?.action_link) {
      console.error("[ORCID signin] generateLink error:", linkError?.message);
      return errorRedirect("Could not create sign-in link — please try email", cookieNext);
    }

    const response = NextResponse.redirect(linkData.properties.action_link);
    clearOrcidCookies(response);
    return response;
  }

  // Unknown ORCID → send to sign-up with ORCID pre-filled
  const signupUrl = `${SITE_URL}/signup?orcid=${encodeURIComponent(orcidId)}&orcid_verified=1&next=${encodeURIComponent(cookieNext)}`;
  const response  = NextResponse.redirect(signupUrl);
  clearOrcidCookies(response);
  return response;
}
