import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { sendPushToUser } from "@/lib/notifications/push";

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false; // Block all requests when secret is not configured
  return (req.headers.get("authorization") ?? "").replace("Bearer ", "") === secret;
}

function dayWindow(daysFromNow: number): { start: string; end: string } {
  const start = new Date();
  start.setDate(start.getDate() + daysFromNow - 1);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setHours(23, 59, 59, 999);
  return { start: start.toISOString(), end: end.toISOString() };
}

interface Opportunity { id: string; title: string; deadline: string; category: string; }
interface UserPref    { user_id: string; email_deadlines: boolean; push_deadlines: boolean; inapp_deadlines: boolean; }
interface EventRow    { id: string; title: string; slug: string | null; start_date: string; }
interface EventPref   { user_id: string; email_events: boolean; push_events: boolean; inapp_events: boolean; }

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin   = createSupabaseAdminClient();
  const results = { opps_7d: 0, opps_1d: 0, events: 0, emails: 0, pushes: 0, errors: 0 };

  const { sendDeadlineReminderEmail } = await import("@/lib/email");

  // ── OPPORTUNITY DEADLINE REMINDERS ─────────────────────────────────────────
  const milestones: { days: number; label: "7d" | "1d"; urgency: string }[] = [
    { days: 7, label: "7d", urgency: "in 7 days"  },
    { days: 1, label: "1d", urgency: "tomorrow"   },
  ];

  for (const { days, label, urgency } of milestones) {
    const { start, end } = dayWindow(days);

    const { data: opps } = await admin
      .from("research_opportunities")
      .select("id, title, deadline, category")
      .eq("is_published", true)
      .gte("deadline", start)
      .lte("deadline", end) as { data: Opportunity[] | null };

    if (!opps?.length) continue;

    for (const opp of opps) {
      // Idempotency check
      const { data: alreadySent } = await admin
        .from("reminder_log")
        .select("opportunity_id")
        .eq("opportunity_id", opp.id)
        .eq("milestone", label)
        .maybeSingle();
      if (alreadySent) continue;

      // Get users who saved this opportunity + their preferences
      const { data: saves } = await admin
        .from("opportunity_saves")
        .select("user_id")
        .eq("opportunity_id", opp.id);

      if (!saves?.length) {
        // Still log so we don't re-check
        await admin.from("reminder_log").insert({ opportunity_id: opp.id, milestone: label });
        continue;
      }

      const userIds = saves.map((s) => s.user_id as string);

      // Fetch preferences for these users
      const { data: rawPrefs } = await admin
        .from("notification_preferences")
        .select("user_id, email_deadlines, push_deadlines, inapp_deadlines")
        .in("user_id", userIds) as { data: UserPref[] | null };

      // Build pref lookup (default all true if no row exists yet)
      const prefMap = new Map<string, UserPref>(
        (rawPrefs ?? []).map((p) => [p.user_id, p])
      );
      function prefs(uid: string): UserPref {
        return prefMap.get(uid) ?? { user_id: uid, email_deadlines: true, push_deadlines: true, inapp_deadlines: true };
      }

      const title = `Deadline ${urgency}: ${opp.title}`;
      const body  = `The ${opp.category} opportunity closes ${urgency}. Don't miss it.`;
      const href  = `/opportunities/${opp.id}`;

      // Fetch user emails for opted-in users
      const { data: users } = await admin
        .from("users")
        .select("id, email, full_name")
        .in("id", userIds);

      // In-app notifications (respect inapp_deadlines pref)
      const inappRows = userIds
        .filter((uid) => prefs(uid).inapp_deadlines)
        .map((uid) => ({ user_id: uid, type: `deadline_${label}`, title, body, href, read: false }));

      for (let i = 0; i < inappRows.length; i += 500) {
        await admin.from("notifications").insert(inappRows.slice(i, i + 500));
      }

      // Push + email per user
      for (const user of users ?? []) {
        const p = prefs(user.id as string);

        if (p.push_deadlines) {
          try {
            await sendPushToUser(user.id as string, { title, body, href });
            results.pushes++;
          } catch { results.errors++; }
        }

        if (p.email_deadlines && user.email) {
          try {
            const firstName = ((user.full_name as string) ?? "").split(" ")[0] || "Researcher";
            await sendDeadlineReminderEmail({
              to:        user.email as string,
              firstName,
              oppTitle:  opp.title,
              oppHref:   `${process.env.NEXT_PUBLIC_SITE_URL}/opportunities/${opp.id}`,
              urgency,
              deadline:  opp.deadline,
            });
            results.emails++;
          } catch { results.errors++; }
        }
      }

      await admin.from("reminder_log").insert({ opportunity_id: opp.id, milestone: label });
      if (label === "7d") results.opps_7d++;
      else                results.opps_1d++;
    }
  }

  // ── EVENT REMINDERS (tomorrow) ──────────────────────────────────────────────
  const { start: evtStart, end: evtEnd } = dayWindow(1);
  const { data: events } = await admin
    .from("events")
    .select("id, title, slug, start_date")
    .in("status", ["published", "featured"])
    .gte("start_date", evtStart)
    .lte("start_date", evtEnd) as { data: EventRow[] | null };

  for (const evt of events ?? []) {
    const { data: alreadySent } = await admin
      .from("reminder_log")
      .select("event_id")
      .eq("event_id", evt.id)
      .eq("milestone", "evt_1d")
      .maybeSingle();
    if (alreadySent) continue;

    // Only notify users who have explicitly opted in to event notifications.
    // Defaulting to true for all users causes inbox noise at scale (Item 37).
    const { data: optedInPrefs } = await admin
      .from("notification_preferences")
      .select("user_id, email_events, push_events, inapp_events")
      .or("inapp_events.eq.true,push_events.eq.true") as { data: EventPref[] | null };

    if (!optedInPrefs?.length) {
      await admin.from("reminder_log").insert({ event_id: evt.id, milestone: "evt_1d" });
      results.events++;
      continue;
    }

    const optedInUserIds = optedInPrefs.map((p) => p.user_id);
    const prefMap = new Map<string, EventPref>(optedInPrefs.map((p) => [p.user_id, p]));

    const { data: optedInUsers } = await admin
      .from("users")
      .select("id, email, full_name")
      .in("id", optedInUserIds);

    const title = `Tomorrow: ${evt.title}`;
    const body  = `The event "${evt.title}" starts tomorrow. Don't miss it!`;
    const href  = `/events/${evt.slug ?? evt.id}`;

    const inappRows = (optedInUsers ?? [])
      .filter((u) => prefMap.get(u.id as string)?.inapp_events)
      .map((u) => ({ user_id: u.id, type: "event_tomorrow", title, body, href, read: false }));

    for (let i = 0; i < inappRows.length; i += 500) {
      await admin.from("notifications").insert(inappRows.slice(i, i + 500));
    }

    for (const user of optedInUsers ?? []) {
      const p = prefMap.get(user.id as string);
      if (p?.push_events) {
        try { await sendPushToUser(user.id as string, { title, body, href }); results.pushes++; }
        catch { results.errors++; }
      }
    }

    await admin.from("reminder_log").insert({ event_id: evt.id, milestone: "evt_1d" });
    results.events++;
  }

  console.log("[cron/reminders]", results);
  return NextResponse.json({ ok: true, ...results });
}
