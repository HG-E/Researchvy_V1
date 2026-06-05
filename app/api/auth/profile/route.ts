import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/auth/supabase";

export async function PUT(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const body = await req.json();
    const { full_name, bio, google_scholar, institutional_affiliation } = body;

    const cap = (s: unknown, max: number) =>
      typeof s === "string" ? s.slice(0, max) : "";

    const safeName = cap(full_name, 120);
    const safeBio  = cap(bio, 800);
    const safeGs   = cap(google_scholar, 200);
    const safeAff  = cap(institutional_affiliation, 200);

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
    await admin.from("users").update({
      full_name:                 safeName,
      bio:                       safeBio,
      google_scholar:            safeGs,
      institutional_affiliation: safeAff,
    }).eq("id", user.id);

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
