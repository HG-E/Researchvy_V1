import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const schema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const { email } = parsed.data;

    await Promise.all([
      // Notify admin
      resend.emails.send({
        from:    "Researchvy Website <hello@researchvy.com>",
        to:      ["hello@researchvy.com"],
        subject: `New newsletter subscriber: ${email}`,
        html:    `<p>New subscriber signed up: <strong>${email}</strong></p>`,
      }),
      // Welcome email to subscriber
      resend.emails.send({
        from:    "Researchvy <hello@researchvy.com>",
        to:      [email],
        subject: "Welcome to Researchvy Insights",
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#080E1A;color:#F9FAFB">
            <div style="text-align:center;margin-bottom:32px">
              <h1 style="font-size:28px;font-weight:700;color:#F9FAFB;margin:0">Welcome to Researchvy</h1>
              <p style="color:#9CA3AF;margin-top:8px">Research Intelligence &amp; Visibility</p>
            </div>
            <p style="color:#D1D5DB;line-height:1.7">
              Thank you for subscribing. You'll receive our insights on scholarly visibility,
              research intelligence, and academic discoverability — plus early access to free
              resources and clinic announcements.
            </p>
            <p style="color:#D1D5DB;line-height:1.7;margin-top:16px">
              Your requested free resources will be sent to you within 24 hours.
            </p>
            <div style="margin-top:32px;padding:20px;background:#0F172A;border-radius:12px;border:1px solid #1E293B">
              <p style="color:#9CA3AF;font-size:14px;margin:0">
                Have questions about your research visibility? Reply to this email or
                <a href="https://researchvy.com/contact" style="color:#60A5FA">contact us here</a>.
              </p>
            </div>
            <p style="color:#4B5563;font-size:12px;margin-top:24px;text-align:center">
              © ${new Date().getFullYear()} Researchvy ·
              <a href="https://researchvy.com" style="color:#4B5563">researchvy.com</a>
            </p>
          </div>
        `,
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[newsletter] Resend error:", error);
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }
}
