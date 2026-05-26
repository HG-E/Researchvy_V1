import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/auth/supabase";

export async function PUT(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const body = await req.json();
    const { full_name, bio, orcid, google_scholar, institutional_affiliation } = body;

    // Update auth user_metadata (drives SSR session data)
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        full_name:                 full_name ?? "",
        bio:                       bio ?? "",
        orcid:                     orcid ?? "",
        google_scholar:            google_scholar ?? "",
        institutional_affiliation: institutional_affiliation ?? "",
      },
    });

    if (authError) return NextResponse.json({ error: authError.message }, { status: 400 });

    // Sync the same data to public.users so other parts of the app (header, sidebar)
    // can query it without going through auth metadata
    const admin = createSupabaseAdminClient();
    await admin.from("users").update({
      full_name:                 full_name ?? "",
      bio:                       bio ?? "",
      orcid:                     orcid ?? "",
      google_scholar:            google_scholar ?? "",
      institutional_affiliation: institutional_affiliation ?? "",
    }).eq("id", user.id);

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
