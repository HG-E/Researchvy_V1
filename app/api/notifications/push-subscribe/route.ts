import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/auth/supabase";

// POST { endpoint, keys: { p256dh, auth } } — store a Web Push subscription
export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await req.json() as {
    endpoint: string;
    keys:     { p256dh: string; auth: string };
  };

  if (!body.endpoint || !body.keys?.p256dh || !body.keys?.auth) {
    return NextResponse.json({ error: "Invalid subscription object" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();

  // Upsert on endpoint — same browser refreshing its subscription won't duplicate
  const { error } = await admin.from("push_subscriptions").upsert(
    {
      user_id:  user.id,
      endpoint: body.endpoint,
      p256dh:   body.keys.p256dh,
      auth_key: body.keys.auth,
    },
    { onConflict: "endpoint" }
  );

  if (error) return NextResponse.json({ error: "Failed to save push subscription." }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// DELETE { endpoint } — remove a specific subscription (unsubscribe)
export async function DELETE(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { endpoint } = await req.json() as { endpoint: string };
  if (!endpoint) return NextResponse.json({ error: "Endpoint required" }, { status: 400 });

  const admin = createSupabaseAdminClient();
  await admin
    .from("push_subscriptions")
    .delete()
    .eq("user_id", user.id)
    .eq("endpoint", endpoint);

  return NextResponse.json({ ok: true });
}
