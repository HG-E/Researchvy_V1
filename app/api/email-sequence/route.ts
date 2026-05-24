import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { day3Email, day7Email } from "@/lib/email/templates";

const resend = new Resend(process.env.RESEND_API_KEY);

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// Vercel Cron sends Authorization: Bearer <CRON_SECRET>
function isAuthorized(req: NextRequest): boolean {
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.replace("Bearer ", "");
  return token === process.env.CRON_SECRET;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const now = new Date();

  const results = { day3: 0, day7: 0, errors: 0 };

  // ── Day 3 emails ─────────────────────────────────────────────────────────
  const day3Start = new Date(now);
  day3Start.setDate(day3Start.getDate() - 4); // older than 3 days
  const day3End = new Date(now);
  day3End.setDate(day3End.getDate() - 3);     // younger than 4 days

  const { data: day3Subscribers } = await supabase
    .from("newsletters")
    .select("id, email")
    .eq("subscribed", true)
    .is("day3_sent_at", null)
    .gte("subscribed_at", day3Start.toISOString())
    .lte("subscribed_at", day3End.toISOString());

  for (const sub of day3Subscribers ?? []) {
    try {
      const email = day3Email();
      await resend.emails.send({
        from:    "Researchvy <info@researchvy.com>",
        to:      [sub.email],
        subject: email.subject,
        html:    email.html,
      });
      await supabase
        .from("newsletters")
        .update({ day3_sent_at: now.toISOString() })
        .eq("id", sub.id);
      results.day3++;
    } catch {
      results.errors++;
    }
  }

  // ── Day 7 emails ─────────────────────────────────────────────────────────
  const day7Start = new Date(now);
  day7Start.setDate(day7Start.getDate() - 8);
  const day7End = new Date(now);
  day7End.setDate(day7End.getDate() - 7);

  const { data: day7Subscribers } = await supabase
    .from("newsletters")
    .select("id, email")
    .eq("subscribed", true)
    .is("day7_sent_at", null)
    .gte("subscribed_at", day7Start.toISOString())
    .lte("subscribed_at", day7End.toISOString());

  for (const sub of day7Subscribers ?? []) {
    try {
      const email = day7Email();
      await resend.emails.send({
        from:    "Researchvy <info@researchvy.com>",
        to:      [sub.email],
        subject: email.subject,
        html:    email.html,
      });
      await supabase
        .from("newsletters")
        .update({ day7_sent_at: now.toISOString() })
        .eq("id", sub.id);
      results.day7++;
    } catch {
      results.errors++;
    }
  }

  console.log("[email-sequence]", results);
  return NextResponse.json({ ok: true, ...results });
}
