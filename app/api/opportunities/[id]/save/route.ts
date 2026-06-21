import { NextRequest, NextResponse } from "next/server";
import { getServerUser, createSupabaseAdminClient } from "@/lib/auth/supabase";

type Ctx = { params: Promise<{ id: string }> };

// POST — bookmark an opportunity
export async function POST(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const user   = await getServerUser();
  if (!user) return NextResponse.json({ error: "Sign in to save opportunities." }, { status: 401 });

  const admin = createSupabaseAdminClient();

  // Verify opportunity exists
  const { data: opp } = await admin
    .from("research_opportunities")
    .select("id")
    .eq("id", id)
    .maybeSingle();
  if (!opp) return NextResponse.json({ error: "Opportunity not found." }, { status: 404 });

  const { error } = await admin
    .from("opportunity_saves")
    .upsert({ opportunity_id: id, user_id: user.id }, { onConflict: "opportunity_id,user_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ saved: true });
}

// DELETE — remove bookmark
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const user   = await getServerUser();
  if (!user) return NextResponse.json({ error: "Unauthorised." }, { status: 401 });

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("opportunity_saves")
    .delete()
    .eq("opportunity_id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ saved: false });
}

// GET — check if current user has saved this opportunity
export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const user   = await getServerUser();
  if (!user) return NextResponse.json({ saved: false });

  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("opportunity_saves")
    .select("opportunity_id")
    .eq("opportunity_id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  return NextResponse.json({ saved: !!data });
}
