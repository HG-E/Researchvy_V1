import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { allowed } = await checkRateLimit(getRateLimitKey(req, "scorecard-claim"), 5, 60 * 60 * 1000);
  if (!allowed) return NextResponse.json({ error: "Too many attempts." }, { status: 429 });

  const { id } = await params;

  let body: { email?: string; name?: string } = {};
  try { body = await req.json(); } catch { /* empty body ok */ }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : null;
  const name  = typeof body.name  === "string" ? body.name.trim()               : null;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();

  // Fetch the lead to send personalized email
  const { data: lead, error: fetchErr } = await admin
    .from("visibility_scorecard_leads")
    .select("id, total_score, tier, answers, dimension_scores, email")
    .eq("id", id)
    .single();

  if (fetchErr || !lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  // Only update AND notify for fresh claims — prevents email abuse on already-claimed leads
  if (!lead.email) {
    await admin
      .from("visibility_scorecard_leads")
      .update({ email, name: name ?? undefined, notified_at: new Date().toISOString() })
      .eq("id", id);

    // Fire emails + WhatsApp notification (fire-and-forget)
    import("@/lib/email").then(async ({ sendScorecardLeadEmail, sendScorecardAdminAlert }) => {
      const firstName = name ? name.split(" ")[0] : "Researcher";
      await Promise.allSettled([
        sendScorecardLeadEmail({
          to:         email,
          firstName,
          score:      lead.total_score as number,
          tier:       lead.tier as string,
          answers:    lead.answers as Record<string, number>,
          dimScores:  lead.dimension_scores as Record<string, { score: number; maxPoints: number }>,
          leadId:     lead.id as string,
        }),
        sendScorecardAdminAlert({
          name:      name ?? "Anonymous",
          email,
          score:     lead.total_score as number,
          tier:      lead.tier as string,
          dimScores: lead.dimension_scores as Record<string, { score: number; maxPoints: number }>,
          leadId:    lead.id as string,
        }),
      ]);
    }).catch(console.error);

    // WhatsApp admin alert for high-intent leads (score < 65 = needs the clinic most)
    if ((lead.total_score as number) < 65) {
      import("@/lib/notifications/whatsapp").then(({ notifyScorecardLead }) =>
        notifyScorecardLead({ name: name ?? "Anonymous", email, score: lead.total_score as number, tier: lead.tier as string })
          .catch(console.error)
      ).catch(console.error);
    }
  }

  return NextResponse.json({ ok: true });
}
