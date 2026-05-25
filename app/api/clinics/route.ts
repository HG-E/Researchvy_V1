import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/auth/supabase";
import { Resend } from "resend";
import { clinicInterestConfirmation } from "@/lib/email/templates";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("clinic_enquiries")
    .select("id, clinic_slug, status, created_at")
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
  const clinicSlug = (body.clinic_slug as string) || "digital-visibility-clinic";

  const admin = createSupabaseAdminClient();

  // Fetch user's profile for their name
  const { data: profile } = await admin
    .from("users")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const fullName = profile?.full_name ?? "";

  // Upsert the enquiry (idempotent — duplicate clicks don't create duplicates)
  const { error } = await admin
    .from("clinic_enquiries")
    .upsert(
      { user_id: user.id, clinic_slug: clinicSlug, email: user.email!, full_name: fullName },
      { onConflict: "user_id,clinic_slug" }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const clinicLabel = "Digital Visibility Clinic";

  // Notify admin (non-blocking)
  resend.emails.send({
    from:    "Researchvy Website <info@researchvy.com>",
    to:      ["info@researchvy.com"],
    cc:      ["researchvy@gmail.com"],
    subject: `New clinic interest: ${clinicSlug} — ${user.email}`,
    html: `<p><strong>New clinic interest registered</strong></p><p>Email: ${user.email}</p><p>Name: ${fullName || "(not set)"}</p><p>Clinic: ${clinicSlug}</p><p>Registered at: ${new Date().toISOString()}</p>`,
  }).catch(() => {});

  // Send confirmation to the user (non-blocking)
  const { subject, html } = clinicInterestConfirmation(fullName, user.email!, clinicLabel);
  resend.emails.send({
    from:    "Researchvy <info@researchvy.com>",
    to:      [user.email!],
    subject,
    html,
  }).catch(() => {});

  return NextResponse.json({ ok: true });
}
