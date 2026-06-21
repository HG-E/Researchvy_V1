import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/auth/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { data, error } = await supabase
    .from("notifications")
    .select("id, type, title, body, href, read, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: "Failed to load notifications." }, { status: 500 });

  const unread = (data ?? []).filter((n) => !n.read).length;
  return NextResponse.json({ notifications: data ?? [], unread });
}
