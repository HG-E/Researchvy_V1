import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);

const schema = z.object({
  name:    z.string().min(2),
  email:   z.string().email(),
  subject: z.string().min(5),
  message: z.string().min(20),
});

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: Request) {
  try {
    // 3 contact form submissions per IP per hour
    const { allowed } = checkRateLimit(getRateLimitKey(req, "contact"), 3, 60 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const { name, email, subject, message } = parsed.data;

    const safeName    = escapeHtml(name);
    const safeEmail   = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message);

    await resend.emails.send({
      from:    "Researchvy Website <info@researchvy.com>",
      to:      ["info@researchvy.com"],
      cc:      ["researchvy@gmail.com"],
      replyTo: email,
      subject: `[Contact] ${subject}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#0F172A;margin-bottom:16px">New Contact Message</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#6B7280;width:100px">From</td>
                <td style="padding:8px 0;color:#0F172A;font-weight:600">${safeName}</td></tr>
            <tr><td style="padding:8px 0;color:#6B7280">Email</td>
                <td style="padding:8px 0"><a href="mailto:${safeEmail}" style="color:#2563EB">${safeEmail}</a></td></tr>
            <tr><td style="padding:8px 0;color:#6B7280">Subject</td>
                <td style="padding:8px 0;color:#0F172A">${safeSubject}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #E5E7EB;margin:16px 0"/>
          <p style="color:#374151;line-height:1.7;white-space:pre-wrap">${safeMessage}</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] Resend error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
