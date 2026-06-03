import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const resend = new Resend(process.env.RESEND_API_KEY);

const schema = z.object({
  contact_name:     z.string().min(2).max(100),
  contact_email:    z.string().email(),
  institution:      z.string().min(2).max(200),
  researcher_count: z.string().min(1),
  interest_area:    z.string().min(1),
  message:          z.string().max(2000).optional(),
});

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function POST(req: Request) {
  try {
    // 2 partnership submissions per IP per hour
    const { allowed } = checkRateLimit(getRateLimitKey(req, "partnerships"), 2, 60 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body   = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const { contact_name, contact_email, institution, researcher_count, interest_area, message } = parsed.data;

    const supabase = getSupabaseAdmin();

    // Store in database
    await supabase.from("partnership_enquiries").insert({
      contact_name,
      contact_email,
      institution,
      researcher_count,
      interest_area,
      message: message ?? null,
    });

    // Notify admin
    await resend.emails.send({
      from:    "Researchvy Website <info@researchvy.com>",
      to:      ["info@researchvy.com"],
      cc:      ["researchvy@gmail.com"],
      replyTo: contact_email,
      subject: `New partnership enquiry: ${institution}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#0F172A;margin-bottom:16px">New Partnership Enquiry</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#6B7280;width:140px;vertical-align:top">Contact</td>
                <td style="padding:8px 0;color:#0F172A;font-weight:600">${esc(contact_name)}</td></tr>
            <tr><td style="padding:8px 0;color:#6B7280;vertical-align:top">Email</td>
                <td style="padding:8px 0"><a href="mailto:${esc(contact_email)}" style="color:#2563EB">${esc(contact_email)}</a></td></tr>
            <tr><td style="padding:8px 0;color:#6B7280;vertical-align:top">Institution</td>
                <td style="padding:8px 0;color:#0F172A">${esc(institution)}</td></tr>
            <tr><td style="padding:8px 0;color:#6B7280;vertical-align:top">Researcher count</td>
                <td style="padding:8px 0;color:#0F172A">${esc(researcher_count)}</td></tr>
            <tr><td style="padding:8px 0;color:#6B7280;vertical-align:top">Interest area</td>
                <td style="padding:8px 0;color:#0F172A">${esc(interest_area)}</td></tr>
          </table>
          ${message ? `<hr style="border:none;border-top:1px solid #E5E7EB;margin:16px 0"/><p style="color:#374151;line-height:1.7;white-space:pre-wrap">${esc(message)}</p>` : ""}
          <p style="margin-top:20px;font-size:13px;color:#9CA3AF;">Reply to this email goes directly to: ${esc(contact_email)}</p>
        </div>
      `,
    });

    // Send confirmation to the enquirer
    await resend.emails.send({
      from:    "Researchvy <info@researchvy.com>",
      to:      [contact_email],
      subject: "Your partnership enquiry, Researchvy",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#ffffff;">
          <h2 style="color:#0F172A;margin-bottom:16px">Thank you, ${esc(contact_name)}.</h2>
          <p style="font-size:15px;line-height:1.7;color:#374151;margin-bottom:16px">
            We've received your partnership enquiry from <strong>${esc(institution)}</strong>.
          </p>
          <p style="font-size:15px;line-height:1.7;color:#374151;margin-bottom:24px">
            Our partnerships team will review your enquiry and reach out within 24 hours to discuss how
            Researchvy can support your researchers&apos; visibility goals.
          </p>
          <p style="font-size:13px;color:#9CA3AF;">
            In the meantime, explore how we work with institutions:
            <a href="https://researchvy.com/partnerships" style="color:#2563EB;">researchvy.com/partnerships</a>
          </p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[partnerships]", error);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
