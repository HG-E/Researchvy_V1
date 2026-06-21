import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient, getServerUser } from "@/lib/auth/supabase";

// POST /api/events/[slug]/save — bookmark an event
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: "Sign in to save events." }, { status: 401 });

  const admin = createSupabaseAdminClient();
  const { data: event } = await admin.from("events").select("id").eq("slug", slug).single();
  if (!event) return NextResponse.json({ error: "Event not found." }, { status: 404 });

  const { error } = await admin
    .from("event_saves")
    .upsert({ event_id: event.id, user_id: user.id }, { onConflict: "event_id,user_id" });

  if (error) return NextResponse.json({ error: "Failed to save event." }, { status: 500 });
  return NextResponse.json({ data: { saved: true } });
}

// DELETE /api/events/[slug]/save — remove bookmark
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: "Unauthorised." }, { status: 401 });

  const admin = createSupabaseAdminClient();
  const { data: event } = await admin.from("events").select("id").eq("slug", slug).single();
  if (!event) return NextResponse.json({ error: "Event not found." }, { status: 404 });

  const { error } = await admin
    .from("event_saves")
    .delete()
    .eq("event_id", event.id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: "Failed to remove save." }, { status: 500 });
  return NextResponse.json({ data: { saved: false } });
}
