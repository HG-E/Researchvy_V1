import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient, getServerUser } from "@/lib/auth/supabase";
import { sendRSVPConfirmation } from "@/lib/email";

// POST /api/events/[slug]/register — RSVP to an internal event
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const user = await getServerUser();
  if (!user) return NextResponse.json({ error: "Sign in to register." }, { status: 401 });

  const admin = createSupabaseAdminClient();

  // Verify event exists and is internal-registration type
  const { data: event, error: evErr } = await admin
    .from("events")
    .select("id,title,registration_type,capacity,status,registration_deadline")
    .eq("slug", slug)
    .in("status", ["published", "featured"])
    .single();

  if (evErr || !event) return NextResponse.json({ error: "Event not found." }, { status: 404 });
  if (event.registration_type !== "internal")
    return NextResponse.json({ error: "This event uses external registration." }, { status: 400 });

  // Check deadline
  if (event.registration_deadline && new Date(event.registration_deadline) < new Date())
    return NextResponse.json({ error: "Registration deadline has passed." }, { status: 400 });

  // Check capacity → waitlist if full
  let status: "registered" | "waitlisted" = "registered";
  if (event.capacity) {
    const { count } = await admin
      .from("event_registrations")
      .select("id", { count: "exact", head: true })
      .eq("event_id", event.id)
      .eq("status", "registered");
    if ((count ?? 0) >= event.capacity) status = "waitlisted";
  }

  const { data, error } = await admin
    .from("event_registrations")
    .upsert({ event_id: event.id, user_id: user.id, status }, { onConflict: "event_id,user_id" })
    .select("id,status")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Fire-and-forget confirmation email
  if (user.email) {
    const { data: profile } = await admin
      .from("profiles")
      .select("first_name")
      .eq("id", user.id)
      .single();
    const firstName = (profile?.first_name as string | null) ?? "Researcher";
    sendRSVPConfirmation(user.email, firstName, event.title as string, slug, status === "waitlisted")
      .catch(() => {});
  }

  return NextResponse.json({ data });
}

// DELETE /api/events/[slug]/register — cancel RSVP
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
    .from("event_registrations")
    .update({ status: "cancelled" })
    .eq("event_id", event.id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: { cancelled: true } });
}
