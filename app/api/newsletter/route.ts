import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { welcomeEmail } from "@/lib/email/templates";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

const resend = new Resend(process.env.RESEND_API_KEY);

const schema = z.object({ email: z.string().email() });

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function POST(req: Request) {
  try {
    // 5 subscribes per IP per hour
    const { allowed } = await checkRateLimit(getRateLimitKey(req, "newsletter"), 5, 60 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const { email } = parsed.data;

    // Save subscriber to Supabase (upsert — safe to re-subscribe)
    const supabase = getSupabaseAdmin();
    await supabase
      .from("newsletters")
      .upsert({ email, subscribed: true, subscribed_at: new Date().toISOString() }, { onConflict: "email" });

    // Send emails in parallel
    const welcome = welcomeEmail(email);
    await Promise.all([
      // Notify admin
      resend.emails.send({
        from:    "Researchvy Website <info@researchvy.com>",
        to:      ["info@researchvy.com"],
        cc:      ["researchvy@gmail.com"],
        subject: `New newsletter subscriber: ${email}`,
        html:    `<p>New subscriber: <strong>${email}</strong></p>`,
      }),
      // Welcome email — Email 1 of 3
      resend.emails.send({
        from:    "Researchvy <info@researchvy.com>",
        to:      [email],
        subject: welcome.subject,
        html:    welcome.html,
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[newsletter] error:", error);
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }
}
