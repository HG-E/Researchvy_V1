import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/auth/supabase";
import { Resend } from "resend";
import { clinicInterestConfirmation } from "@/lib/email/templates";

export const maxDuration = 30;

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

  if (error) return NextResponse.json({ error: "Failed to load enquiries." }, { status: 500 });
  return NextResponse.json({ enquiries: data ?? [] });
}

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body       = await req.json().catch(() => ({}));
  const clinicSlug = (body.clinic_slug as string) || "digital-visibility-clinic";
  const VALID_TRACKS = ["wednesday", "sunday"] as const;
  const rawTrack     = body.preferred_track as string;
  const preferredTrack: string | null = VALID_TRACKS.includes(rawTrack as typeof VALID_TRACKS[number]) ? rawTrack : null;

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
      {
        user_id:         user.id,
        clinic_slug:     clinicSlug,
        email:           user.email!,
        full_name:       fullName,
        preferred_track: preferredTrack,
      },
      { onConflict: "user_id,clinic_slug" }
    );

  if (error) return NextResponse.json({ error: "Failed to register interest." }, { status: 500 });

  const clinicLabel = "Digital Visibility Clinic";

  // Notify admin (non-blocking)
  resend.emails.send({
    from:    "Researchvy Website <info@researchvy.com>",
    to:      ["info@researchvy.com"],
    cc:      ["researchvy@gmail.com"],
    replyTo: user.email!,
    subject: `🎓 New clinic interest: ${clinicLabel}, ${user.email}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <div style="background:#0F172A;padding:16px 20px;border-radius:8px;margin-bottom:20px;">
          <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#2563EB;">Researchvy Clinics</p>
          <h2 style="margin:6px 0 0;color:#F9FAFB;font-size:18px;">New Clinic Interest Registered</h2>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <tr><td style="padding:10px 0;color:#6B7280;width:140px;border-bottom:1px solid #F3F4F6;vertical-align:top;font-size:14px;">Name</td>
              <td style="padding:10px 0;color:#0F172A;font-weight:600;border-bottom:1px solid #F3F4F6;font-size:14px;">${fullName || "(not set)"}</td></tr>
          <tr><td style="padding:10px 0;color:#6B7280;border-bottom:1px solid #F3F4F6;vertical-align:top;font-size:14px;">Email</td>
              <td style="padding:10px 0;border-bottom:1px solid #F3F4F6;font-size:14px;"><a href="mailto:${user.email?.replace(/[<>"]/g, '')}" style="color:#2563EB;">${user.email?.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</a></td></tr>
          <tr><td style="padding:10px 0;color:#6B7280;border-bottom:1px solid #F3F4F6;vertical-align:top;font-size:14px;">Clinic</td>
              <td style="padding:10px 0;color:#0F172A;border-bottom:1px solid #F3F4F6;font-size:14px;">${clinicLabel}</td></tr>
          <tr><td style="padding:10px 0;color:#6B7280;border-bottom:1px solid #F3F4F6;vertical-align:top;font-size:14px;">Track</td>
              <td style="padding:10px 0;color:#0F172A;border-bottom:1px solid #F3F4F6;font-size:14px;">${preferredTrack === "wednesday" ? "Mid-week (Wednesdays)" : preferredTrack === "sunday" ? "Weekend (Sundays)" : "Not selected"}</td></tr>
          <tr><td style="padding:10px 0;color:#6B7280;vertical-align:top;font-size:14px;">Registered at</td>
              <td style="padding:10px 0;color:#0F172A;font-size:14px;">${new Date().toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short" })} UTC</td></tr>
        </table>
        <a href="https://researchvy.com/admin/enquiries" style="display:inline-block;background:#2563EB;color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:600;">View in Admin Panel →</a>
        <p style="margin-top:16px;font-size:12px;color:#9CA3AF;">Reply to this email to contact ${user.email} directly.</p>
      </div>
    `,
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
