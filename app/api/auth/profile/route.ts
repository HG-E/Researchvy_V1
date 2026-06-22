import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/auth/supabase";
import { usernameSchema } from "@/lib/validation/schemas";

export async function PUT(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const body = await req.json();
    const { full_name, bio, google_scholar, institutional_affiliation, username, profile_public } = body;

    const cap = (s: unknown, max: number) =>
      typeof s === "string" ? s.slice(0, max) : "";

    const safeName = cap(full_name, 120);
    const safeBio  = cap(bio, 800);
    const safeGs   = cap(google_scholar, 200);
    const safeAff  = cap(institutional_affiliation, 200);

    // Validate username if provided
    let safeUsername: string | null | undefined;
    if (username !== undefined) {
      if (username === "" || username === null) {
        safeUsername = null;
      } else {
        const parsed = usernameSchema.safeParse(username);
        if (!parsed.success) {
          return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
        }
        safeUsername = parsed.data.toLowerCase();
      }
    }

    // Preserve verified ORCID — never allow form submission to overwrite it
    const currentMeta = user.user_metadata ?? {};
    const orcidVerified = currentMeta.orcid_verified === true;
    const preservedOrcid = orcidVerified ? (currentMeta.orcid as string ?? "") : undefined;

    const { error: authError } = await supabase.auth.updateUser({
      data: {
        full_name:                 safeName,
        bio:                       safeBio,
        google_scholar:            safeGs,
        institutional_affiliation: safeAff,
        ...(preservedOrcid !== undefined ? { orcid: preservedOrcid } : {}),
      },
    });

    if (authError) return NextResponse.json({ error: authError.message }, { status: 400 });

    const admin = createSupabaseAdminClient();
    const { error: dbError } = await admin.from("users").update({
      full_name:                 safeName,
      bio:                       safeBio,
      google_scholar:            safeGs,
      institutional_affiliation: safeAff,
      ...(safeUsername !== undefined ? { username: safeUsername } : {}),
      ...(profile_public !== undefined ? { profile_public: Boolean(profile_public) } : {}),
    }).eq("id", user.id);

    // Unique constraint violation on username
    if (dbError && (dbError as { code?: string }).code === "23505") {
      return NextResponse.json({ error: "Username is already taken" }, { status: 409 });
    }
    if (dbError) {
      console.error("[profile/put] db error:", dbError.message);
      return NextResponse.json({ error: "Failed to save profile. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    console.error("[profile/put]", e);
    return NextResponse.json({ error: "An error occurred. Please try again." }, { status: 500 });
  }
}
