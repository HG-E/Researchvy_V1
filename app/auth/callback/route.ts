import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/auth/supabase";
import { generateUniqueUsername } from "@/lib/utils/username";

/**
 * Supabase Auth callback — handles email confirmation and OAuth redirects.
 * After verifying an email, Supabase redirects here with ?code=<pkce_code>.
 * We exchange the code for a session, then redirect the user to their destination.
 * Also auto-assigns a username to new users who don't have one yet.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const raw  = searchParams.get("next") ?? "/dashboard";
  const next = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/dashboard";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Auto-assign username for users who don't have one yet
      try {
        const admin = createSupabaseAdminClient();
        const { data: userRow } = await admin
          .from("users")
          .select("username, full_name")
          .eq("id", data.user.id)
          .single();

        if (!userRow?.username) {
          const fullName =
            userRow?.full_name ||
            (data.user.user_metadata?.full_name as string | undefined) ||
            data.user.email?.split("@")[0] ||
            "researcher";

          const username = await generateUniqueUsername(fullName);
          await admin.from("users").update({ username }).eq("id", data.user.id);
        }
      } catch {
        // Non-fatal — user can set username manually in dashboard
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth failed — send to signin with a helpful message
  return NextResponse.redirect(`${origin}/signin?error=email_confirmation_failed`);
}
