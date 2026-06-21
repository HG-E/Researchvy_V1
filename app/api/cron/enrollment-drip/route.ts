import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { buildWhatsAppUrl } from "@/config/site";
import { digitalVisibilityClinic } from "@/constants/clinics";
import {
  sendCohortPrepEmail,
  sendMeetYourCohortEmail,
  sendSession1ReminderEmail,
  sendWhatToPrepareEmail,
} from "@/lib/email/index";

function isAuthorized(req: NextRequest): boolean {
  return (req.headers.get("authorization") ?? "").replace("Bearer ", "") === process.env.CRON_SECRET;
}

const COHORT     = digitalVisibilityClinic.nextCohort;
const COHORT_START_WED = new Date(COHORT.tracks.wednesday.startDate);
const COHORT_START_SUN = new Date(COHORT.tracks.sunday.startDate);

function cohortStartLabel(track: string) {
  const d = track === "wednesday" ? COHORT_START_WED : COHORT_START_SUN;
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function trackLabel(track: string) {
  return track === "wednesday" ? "Mid-week (Wednesdays)" : "Weekend (Sundays)";
}

function sessionTime(track: string) {
  return `${cohortStartLabel(track)} at ${COHORT.sessionTime} WAT`;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin   = createSupabaseAdminClient();
  const now     = new Date();
  const results = { sent: 0, errors: 0 };

  const { data: pending } = await admin
    .from("enrollment_drip_emails")
    .select("id, order_id, user_email, email_type")
    .is("sent_at", null)
    .lte("scheduled_for", now.toISOString())
    .limit(50);

  for (const row of pending ?? []) {
    try {
      // Fetch order for context
      const { data: order } = await admin
        .from("orders")
        .select("user_name, user_email, bundle_id, module_id, order_number, preferred_track")
        .eq("id", row.order_id)
        .single();

      if (!order) continue;

      const track    = (order as Record<string, string>).preferred_track ?? "wednesday";
      const baseOpts = {
        to:          order.user_email,
        userName:    order.user_name,
        bundleName:  order.bundle_id,
        orderNumber: order.order_number,
        cohortStart: cohortStartLabel(track),
        whatsappUrl: buildWhatsAppUrl("I'd like to join the Researchvy DVC cohort WhatsApp group"),
      };

      switch (row.email_type) {
        case "cohort_prep":
          await sendCohortPrepEmail(baseOpts);
          break;
        case "meet_cohort":
          await sendMeetYourCohortEmail(baseOpts);
          break;
        case "session1_reminder":
          await sendSession1ReminderEmail({ ...baseOpts, sessionTime: sessionTime(track), trackLabel: trackLabel(track) });
          break;
        case "what_to_prepare":
          await sendWhatToPrepareEmail({ ...baseOpts, sessionTime: COHORT.sessionTime + " WAT" });
          break;
      }

      await admin
        .from("enrollment_drip_emails")
        .update({ sent_at: now.toISOString() })
        .eq("id", row.id);

      results.sent++;
    } catch (err) {
      console.error("[enrollment-drip] failed:", row.id, err);
      results.errors++;
    }
  }

  return NextResponse.json({ ok: true, ...results });
}
