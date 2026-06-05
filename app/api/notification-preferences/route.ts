import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/auth/supabase";

export const dynamic = "force-dynamic";

type Prefs = {
  inapp_deadlines: boolean;
  inapp_events:    boolean;
  inapp_system:    boolean;
  email_deadlines: boolean;
  email_events:    boolean;
  push_deadlines:  boolean;
  push_events:     boolean;
};

const DEFAULTS: Prefs = {
  inapp_deadlines: true,
  inapp_events:    true,
  inapp_system:    true,
  email_deadlines: true,
  email_events:    true,
  push_deadlines:  true,
  push_events:     true,
};

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("notification_preferences")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  // Return existing prefs or defaults if row doesn't exist yet
  return NextResponse.json({ prefs: data ? { ...DEFAULTS, ...data } : DEFAULTS });
}

export async function PUT(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await req.json() as Partial<Prefs>;

  // Whitelist valid boolean fields only — reject anything else
  const allowed: (keyof Prefs)[] = [
    "inapp_deadlines", "inapp_events", "inapp_system",
    "email_deadlines", "email_events",
    "push_deadlines",  "push_events",
  ];

  const safe: Partial<Prefs> & { user_id: string; updated_at: string } = {
    user_id:    user.id,
    updated_at: new Date().toISOString(),
  };
  for (const key of allowed) {
    if (typeof body[key] === "boolean") safe[key] = body[key] as boolean;
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("notification_preferences")
    .upsert(safe, { onConflict: "user_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
