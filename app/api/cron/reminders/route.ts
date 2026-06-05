import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { sendPushToUser } from "@/lib/notifications/push";

function isAuthorized(req: NextRequest): boolean {
  const auth = req.headers.get("authorization") ?? "";
  return auth.replace("Bearer ", "") === process.env.CRON_SECRET;
}

function dayWindow(daysFromNow: number): { start: string; end: string } {
  const start = new Date();
  start.setDate(start.getDate() + daysFromNow - 1);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setHours(23, 59, 59, 999);

  return { start: start.toISOString(), end: end.toISOString() };
}

interface Opportunity {
  id:       string;
  title:    string;
  deadline: string;
  category: string;
}

interface User {
  id:        string;
  email:     string;
  full_name: string | null;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin   = createSupabaseAdminClient();
  const results = { notified_7d: 0, notified_1d: 0, emails_sent: 0, errors: 0 };

  // Milestones: 7 days and 1 day before deadline
  const milestones: { days: number; label: "7d" | "1d"; urgency: string }[] = [
    { days: 7, label: "7d", urgency: "7 days"    },
    { days: 1, label: "1d", urgency: "tomorrow"  },
  ];

  // Load all active users once
  const { data: users } = await admin
    .from("users")
    .select("id, email, full_name")
    .not("email", "is", null) as { data: User[] | null };

  if (!users?.length) return NextResponse.json({ ok: true, ...results });

  const { sendDeadlineReminderEmail } = await import("@/lib/email");

  for (const { days, label, urgency } of milestones) {
    const { start, end } = dayWindow(days);

    // Find approved opportunities whose deadline falls in this window
    const { data: opps } = await admin
      .from("opportunities")
      .select("id, title, deadline, category")
      .eq("status", "approved")
      .gte("deadline", start)
      .lte("deadline", end) as { data: Opportunity[] | null };

    if (!opps?.length) continue;

    for (const opp of opps) {
      // Idempotency: skip if already notified for this milestone
      const { data: logged } = await admin
        .from("reminder_log")
        .select("opportunity_id")
        .eq("opportunity_id", opp.id)
        .eq("milestone", label)
        .maybeSingle();

      if (logged) continue;

      const title = `Deadline ${urgency}: ${opp.title}`;
      const body  = `The ${opp.category} opportunity "${opp.title}" closes ${urgency}. Don't miss it.`;
      const href  = `/opportunities/${opp.id}`;

      // Batch-insert notification rows for all users
      const rows = users.map((u) => ({
        user_id: u.id,
        type:    `deadline_${label}`,
        title,
        body,
        href,
        read:    false,
      }));

      // Insert in chunks of 500 to stay inside Supabase request limits
      for (let i = 0; i < rows.length; i += 500) {
        await admin.from("notifications").insert(rows.slice(i, i + 500));
      }

      // Send browser push to subscribed users
      for (const user of users) {
        try {
          await sendPushToUser(user.id, { title, body, href });
        } catch { /* non-critical */ }
      }

      // Send email reminders
      for (const user of users) {
        try {
          const firstName = (user.full_name ?? "").split(" ")[0] || "Researcher";
          await sendDeadlineReminderEmail({
            to:         user.email,
            firstName,
            oppTitle:   opp.title,
            oppHref:    `${process.env.NEXT_PUBLIC_SITE_URL}${href}`,
            urgency,
            deadline:   opp.deadline,
          });
          results.emails_sent++;
        } catch { results.errors++; }
      }

      // Record in log so we don't re-send
      await admin.from("reminder_log").insert({ opportunity_id: opp.id, milestone: label });

      if (label === "7d") results.notified_7d++;
      else                results.notified_1d++;
    }
  }

  // Event reminders — notify about events happening tomorrow
  const { start: evtStart, end: evtEnd } = dayWindow(1);
  const { data: events } = await admin
    .from("events")
    .select("id, title, slug, starts_at")
    .eq("status", "approved")
    .gte("starts_at", evtStart)
    .lte("starts_at", evtEnd);

  for (const evt of events ?? []) {
    const { data: logged } = await admin
      .from("reminder_log")
      .select("opportunity_id")
      .eq("opportunity_id", evt.id)
      .eq("milestone", "evt_1d")
      .maybeSingle();

    if (logged) continue;

    const title = `Tomorrow: ${evt.title}`;
    const body  = `The event "${evt.title}" starts tomorrow. Join in!`;
    const href  = `/events/${evt.slug ?? evt.id}`;

    const rows = users.map((u) => ({
      user_id: u.id,
      type:    "event_tomorrow",
      title,
      body,
      href,
      read:    false,
    }));

    for (let i = 0; i < rows.length; i += 500) {
      await admin.from("notifications").insert(rows.slice(i, i + 500));
    }

    for (const user of users) {
      try { await sendPushToUser(user.id, { title, body, href }); } catch { /* ok */ }
    }

    await admin.from("reminder_log").insert({ opportunity_id: evt.id, milestone: "evt_1d" });
  }

  console.log("[cron/reminders]", results);
  return NextResponse.json({ ok: true, ...results });
}
