import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/auth/supabase";
import { Resend } from "resend";
import { academyInterestConfirmation } from "@/lib/email/templates";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("academy_enquiries")
    .select("id, programme_slug, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ enquiries: data ?? [] });
}

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const programmeSlug = (body.programme_slug as string) || "research-visibility-academy";

  const admin = createSupabaseAdminClient();

  const { data: profile } = await admin
    .from("users")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const fullName = profile?.full_name ?? "";

  const { error } = await admin
    .from("academy_enquiries")
    .upsert(
      { user_id: user.id, programme_slug: programmeSlug, email: user.email!, full_name: fullName },
      { onConflict: "user_id,programme_slug" }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Notify admin (non-blocking)
  resend.emails.send({
    from:    "Researchvy Website <info@researchvy.com>",
    to:      ["info@researchvy.com"],
    cc:      ["researchvy@gmail.com"],
    subject: `New academy interest: ${programmeSlug} — ${user.email}`,
    html: `<p><strong>New academy interest registered</strong></p><p>Email: ${user.email}</p><p>Name: ${fullName || "(not set)"}</p><p>Programme: ${programmeSlug}</p><p>Registered at: ${new Date().toISOString()}</p>`,
  }).catch(() => {});

  // Send confirmation to the user (non-blocking)
  const { subject, html } = academyInterestConfirmation(fullName, user.email!);
  resend.emails.send({
    from:    "Researchvy <info@researchvy.com>",
    to:      [user.email!],
    subject,
    html,
  }).catch(() => {});

  return NextResponse.json({ ok: true });
}
