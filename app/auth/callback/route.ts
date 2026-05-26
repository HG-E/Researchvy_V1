import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/auth/supabase";

/**
 * Supabase Auth callback — handles email confirmation and OAuth redirects.
 * After verifying an email, Supabase redirects here with ?code=<pkce_code>.
 * We exchange the code for a session, then redirect the user to their destination.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth failed — send to signin with a helpful message
  return NextResponse.redirect(`${origin}/signin?error=email_confirmation_failed`);
}
