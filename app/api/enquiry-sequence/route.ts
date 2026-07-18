import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import {
  clinicDripDay3,
  clinicDripDay7,
  academyDripDay3,
  academyDripDay7,
} from "@/lib/email/templates";

const resend = new Resend(process.env.RESEND_API_KEY);

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const token = (req.headers.get("authorization") ?? "").replace("Bearer ", "");
  return token === secret;
}

function dayWindow(daysAgo: number): { start: string; end: string } {
  const now   = Date.now();
  const start = new Date(now - (daysAgo + 1) * 86_400_000).toISOString();
  const end   = new Date(now - daysAgo      * 86_400_000).toISOString();
  return { start, end };
}

type Row = { id: string; email: string };

async function sendDrip(
  rows:     Row[],
  table:    "clinic_enquiries" | "academy_enquiries",
  column:   "day3_sent_at" | "day7_sent_at",
  getEmail: (email: string) => { subject: string; html: string },
  supabase: ReturnType<typeof getSupabaseAdmin>,
  results:  { sent: number; errors: number },
) {
  for (const row of rows) {
    try {
      const { subject, html } = getEmail(row.email);
      await resend.emails.send({
        from:    "Researchvy <info@researchvy.com>",
        to:      [row.email],
        subject,
        html,
      });
      await supabase
        .from(table)
        .update({ [column]: new Date().toISOString() })
        .eq("id", row.id);
      results.sent++;
    } catch {
      results.errors++;
    }
  }
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const results  = { sent: 0, errors: 0 };

  // ── Clinic Day 3 ─────────────────────────────────────────────────────────────
  const c3 = dayWindow(3);
  const { data: clinicDay3 } = await supabase
    .from("clinic_enquiries")
    .select("id, email")
    .is("day3_sent_at", null)
    .gte("created_at", c3.start)
    .lte("created_at", c3.end);

  await sendDrip(
    (clinicDay3 ?? []) as Row[],
    "clinic_enquiries",
    "day3_sent_at",
    () => clinicDripDay3(),
    supabase,
    results,
  );

  // ── Clinic Day 7 ─────────────────────────────────────────────────────────────
  const c7 = dayWindow(7);
  const { data: clinicDay7 } = await supabase
    .from("clinic_enquiries")
    .select("id, email")
    .is("day7_sent_at", null)
    .gte("created_at", c7.start)
    .lte("created_at", c7.end);

  await sendDrip(
    (clinicDay7 ?? []) as Row[],
    "clinic_enquiries",
    "day7_sent_at",
    () => clinicDripDay7(),
    supabase,
    results,
  );

  // ── Academy Day 3 ────────────────────────────────────────────────────────────
  const a3 = dayWindow(3);
  const { data: academyDay3 } = await supabase
    .from("academy_enquiries")
    .select("id, email")
    .is("day3_sent_at", null)
    .gte("created_at", a3.start)
    .lte("created_at", a3.end);

  await sendDrip(
    (academyDay3 ?? []) as Row[],
    "academy_enquiries",
    "day3_sent_at",
    () => academyDripDay3(),
    supabase,
    results,
  );

  // ── Academy Day 7 ────────────────────────────────────────────────────────────
  const a7 = dayWindow(7);
  const { data: academyDay7 } = await supabase
    .from("academy_enquiries")
    .select("id, email")
    .is("day7_sent_at", null)
    .gte("created_at", a7.start)
    .lte("created_at", a7.end);

  await sendDrip(
    (academyDay7 ?? []) as Row[],
    "academy_enquiries",
    "day7_sent_at",
    () => academyDripDay7(),
    supabase,
    results,
  );

  console.log("[enquiry-sequence]", results);
  return NextResponse.json({ ok: true, ...results });
}
