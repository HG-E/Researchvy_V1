import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

function getTier(score: number): string {
  if (score >= 85) return "leader";
  if (score >= 65) return "emerging";
  if (score >= 40) return "significant_gaps";
  return "invisible";
}

export async function POST(req: NextRequest) {
  // 10 submissions per hour per IP — generous for legitimate use
  const { allowed } = await checkRateLimit(getRateLimitKey(req, "scorecard"), 10, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many submissions. Try again later." }, { status: 429 });
  }

  let body: {
    answers?:         Record<string, number>;
    totalScore?:      number;
    dimensionScores?: Record<string, { score: number; maxPoints: number }>;
    // Optional: provided when user submits email via the capture form in the fallback path
    email?:           string;
    name?:            string;
    source?:          string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { answers, totalScore, dimensionScores, email, name, source: bodySource } = body;

  if (
    typeof totalScore !== "number" ||
    totalScore < 0 ||
    totalScore > 100 ||
    !answers ||
    typeof answers !== "object"
  ) {
    return NextResponse.json({ error: "Invalid scorecard data" }, { status: 400 });
  }

  // Validate email if provided
  const cleanEmail = typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ? email.trim().toLowerCase()
    : null;
  const cleanName = typeof name === "string" ? name.trim() || null : null;

  // Source: prefer explicit body param (client UTM), fall back to referer
  const referer = req.headers.get("referer") ?? null;
  const source  = bodySource ?? (referer ? new URL(referer).hostname : null);

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("visibility_scorecard_leads")
    .insert({
      total_score:      totalScore,
      tier:             getTier(totalScore),
      answers,
      dimension_scores: dimensionScores ?? {},
      source,
      email:            cleanEmail,
      name:             cleanName,
      status:           "new",
      notified_at:      cleanEmail ? new Date().toISOString() : null,
    })
    .select("id, total_score, tier, dimension_scores")
    .single();

  if (error) {
    console.error("[scorecard/submit]", error.message);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }

  // If email was provided, fire notifications (same as the claim route does)
  if (cleanEmail && data) {
    const dimScores = (data.dimension_scores ?? {}) as Record<string, { score: number; maxPoints: number }>;
    const score     = data.total_score as number;
    const tier      = data.tier as string;
    const firstName = cleanName ? cleanName.split(" ")[0] : "Researcher";

    import("@/lib/email").then(async ({ sendScorecardLeadEmail, sendScorecardAdminAlert }) => {
      await Promise.allSettled([
        sendScorecardLeadEmail({ to: cleanEmail, firstName, score, tier, answers, dimScores, leadId: data.id }),
        sendScorecardAdminAlert({ name: cleanName ?? "Anonymous", email: cleanEmail, score, tier, dimScores, leadId: data.id }),
      ]);
    }).catch(console.error);

    if (score < 65) {
      import("@/lib/notifications/whatsapp").then(({ notifyScorecardLead }) =>
        notifyScorecardLead({ name: cleanName ?? "Anonymous", email: cleanEmail, score, tier }).catch(console.error)
      ).catch(console.error);
    }
  }

  return NextResponse.json({ id: data.id, emailSent: !!cleanEmail });
}
