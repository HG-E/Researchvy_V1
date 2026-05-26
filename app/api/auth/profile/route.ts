import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/auth/supabase";

export async function PUT(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { full_name, bio, orcid, google_scholar, institutional_affiliation } = body;

    const { error } = await supabase.auth.updateUser({
      data: {
        full_name:                 full_name ?? "",
        bio:                       bio ?? "",
        orcid:                     orcid ?? "",
        google_scholar:            google_scholar ?? "",
        institutional_affiliation: institutional_affiliation ?? "",
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
