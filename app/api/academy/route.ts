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

  if (error) return NextResponse.json({ error: "Failed to load enquiries." }, { status: 500 });
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

  if (error) return NextResponse.json({ error: "Failed to register interest." }, { status: 500 });

  // Notify admin (non-blocking)
  resend.emails.send({
    from:    "Researchvy Website <info@researchvy.com>",
    to:      ["info@researchvy.com"],
    cc:      ["researchvy@gmail.com"],
    replyTo: user.email!,
    subject: `📚 New academy interest: ${programmeSlug}, ${user.email}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <div style="background:#0F172A;padding:16px 20px;border-radius:8px;margin-bottom:20px;">
          <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#8B5CF6;">Researchvy Academy</p>
          <h2 style="margin:6px 0 0;color:#F9FAFB;font-size:18px;">New Academy Interest Registered</h2>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <tr><td style="padding:10px 0;color:#6B7280;width:140px;border-bottom:1px solid #F3F4F6;vertical-align:top;font-size:14px;">Name</td>
              <td style="padding:10px 0;color:#0F172A;font-weight:600;border-bottom:1px solid #F3F4F6;font-size:14px;">${fullName || "(not set)"}</td></tr>
          <tr><td style="padding:10px 0;color:#6B7280;border-bottom:1px solid #F3F4F6;vertical-align:top;font-size:14px;">Email</td>
              <td style="padding:10px 0;border-bottom:1px solid #F3F4F6;font-size:14px;"><a href="mailto:${user.email}" style="color:#8B5CF6;">${user.email}</a></td></tr>
          <tr><td style="padding:10px 0;color:#6B7280;border-bottom:1px solid #F3F4F6;vertical-align:top;font-size:14px;">Programme</td>
              <td style="padding:10px 0;color:#0F172A;border-bottom:1px solid #F3F4F6;font-size:14px;">${programmeSlug}</td></tr>
          <tr><td style="padding:10px 0;color:#6B7280;vertical-align:top;font-size:14px;">Registered at</td>
              <td style="padding:10px 0;color:#0F172A;font-size:14px;">${new Date().toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short" })} UTC</td></tr>
        </table>
        <a href="https://researchvy.com/admin/enquiries" style="display:inline-block;background:#8B5CF6;color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:14px;font-weight:600;">View in Admin Panel →</a>
        <p style="margin-top:16px;font-size:12px;color:#9CA3AF;">Reply to this email to contact ${user.email} directly.</p>
      </div>
    `,
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
