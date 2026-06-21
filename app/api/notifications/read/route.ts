import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/auth/supabase";

// POST { id?: string } — mark one (by id) or all as read
export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await req.json().catch(() => ({})) as { id?: string };

  const query = supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", user.id)
    .eq("read", false);

  if (body.id) {
    query.eq("id", body.id);
  }

  const { error } = await query;
  if (error) return NextResponse.json({ error: "Failed to update notifications." }, { status: 500 });

  return NextResponse.json({ ok: true });
}
