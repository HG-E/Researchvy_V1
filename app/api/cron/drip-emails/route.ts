import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";

function isAuthorized(req: NextRequest): boolean {
  const auth = req.headers.get("authorization") ?? "";
  return auth.replace("Bearer ", "") === process.env.CRON_SECRET;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createSupabaseAdminClient();
  const now = new Date();
  const results = { day2: 0, day5: 0, errors: 0 };

  // Window helpers: users who signed up N-1 to N days ago
  function window(daysAgo: number) {
    const end = new Date(now);
    end.setDate(end.getDate() - daysAgo);
    const start = new Date(end);
    start.setDate(start.getDate() - 1);
    return { start: start.toISOString(), end: end.toISOString() };
  }

  // Lazy-import email functions to keep bundle small
  const { sendDay2DripEmail, sendDay5DripEmail } = await import("@/lib/email");

  // ── Day-2 ──────────────────────────────────────────────────────────────────
  const w2 = window(2);
  const { data: day2Users } = await admin
    .from("users")
    .select("id, email, full_name")
    .is("drip_day2_sent_at", null)
    .gte("created_at", w2.start)
    .lte("created_at", w2.end);

  for (const user of day2Users ?? []) {
    try {
      const firstName = (user.full_name as string)?.split(" ")[0] || "Researcher";
      await sendDay2DripEmail({ to: user.email as string, firstName });
      await admin.from("users").update({ drip_day2_sent_at: now.toISOString() }).eq("id", user.id);
      results.day2++;
    } catch {
      results.errors++;
    }
  }

  // ── Day-5 ──────────────────────────────────────────────────────────────────
  const w5 = window(5);
  const { data: day5Users } = await admin
    .from("users")
    .select("id, email, full_name")
    .is("drip_day5_sent_at", null)
    .gte("created_at", w5.start)
    .lte("created_at", w5.end);

  for (const user of day5Users ?? []) {
    try {
      const firstName = (user.full_name as string)?.split(" ")[0] || "Researcher";
      await sendDay5DripEmail({ to: user.email as string, firstName });
      await admin.from("users").update({ drip_day5_sent_at: now.toISOString() }).eq("id", user.id);
      results.day5++;
    } catch {
      results.errors++;
    }
  }

  console.log("[drip-emails]", results);
  return NextResponse.json({ ok: true, ...results });
}
