import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { getServerUser } from "@/lib/auth/supabase";

// GET /api/events/[slug] — public; increments views; enriches with user data if authed
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const admin = createSupabaseAdminClient();

  const { data, error } = await admin
    .from("events")
    .select("*")
    .eq("slug", slug)
    .in("status", ["published", "featured"])
    .single();

  if (error || !data) return NextResponse.json({ error: "Event not found." }, { status: 404 });

  // Increment view count (fire-and-forget)
  admin.from("events").update({ views_count: (data.views_count ?? 0) + 1 }).eq("id", data.id).then(() => {});

  // Check if user has saved / registered
  const user = await getServerUser();
  let is_saved = false;
  let user_registration = null;

  if (user) {
    const [saveRes, regRes] = await Promise.all([
      admin.from("event_saves").select("saved_at").eq("event_id", data.id).eq("user_id", user.id).single(),
      admin.from("event_registrations").select("id,status,registered_at").eq("event_id", data.id).eq("user_id", user.id).single(),
    ]);
    is_saved         = !!saveRes.data;
    user_registration = regRes.data ?? null;
  }

  // Registration count for internal events
  let registration_count = 0;
  if (data.registration_type === "internal") {
    const { count } = await admin
      .from("event_registrations")
      .select("id", { count: "exact", head: true })
      .eq("event_id", data.id)
      .in("status", ["registered", "waitlisted"]);
    registration_count = count ?? 0;
  }

  return NextResponse.json({ data: { ...data, is_saved, user_registration, registration_count } });
}
