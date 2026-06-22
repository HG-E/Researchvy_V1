import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

// Mirrors the options defined in VisibilityScorecard.tsx — single source of truth for validation.
// If checkpoint options change in the component, update here too.
const VALID_ANSWERS: Record<string, number[]> = {
  orcid:         [9, 5, 2, 0],
  googlescholar: [8, 5, 2, 0],
  scopus:        [8, 4, 0],
  openaccess:    [9, 5, 2, 0],
  keywords:      [8, 4, 0],
  repository:    [8, 4, 0],
  cppratio:      [9, 5, 2, 0],
  hefficiency:   [8, 4, 1, 0],
  alerts:        [8, 4, 0],
  laysummaries:  [9, 5, 0],
  socialmedia:   [8, 4, 0],
  crosssector:   [8, 4, 0],
};

const CHECKPOINT_IDS = Object.keys(VALID_ANSWERS);
// Dimension structure for server-side dimension score computation
const DIMENSIONS = [
  { id: "identity",       checkpoints: ["orcid", "googlescholar", "scopus"],      maxPoints: 25 },
  { id: "discoverability",checkpoints: ["openaccess", "keywords", "repository"],  maxPoints: 25 },
  { id: "citationhealth", checkpoints: ["cppratio", "hefficiency", "alerts"],     maxPoints: 25 },
  { id: "communication",  checkpoints: ["laysummaries", "socialmedia", "crosssector"], maxPoints: 25 },
];

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
    answers?:         Record<string, unknown>;
    totalScore?:      unknown;
    dimensionScores?: unknown;
    email?:           string;
    name?:            string;
    source?:          string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { answers, email, name, source: bodySource } = body;

  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    return NextResponse.json({ error: "Invalid scorecard data" }, { status: 400 });
  }

  // Validate every submitted checkpoint ID and its value against the known model
  for (const [id, value] of Object.entries(answers)) {
    if (!VALID_ANSWERS[id]) {
      return NextResponse.json({ error: "Invalid checkpoint ID" }, { status: 400 });
    }
    if (typeof value !== "number" || !VALID_ANSWERS[id].includes(value)) {
      return NextResponse.json({ error: "Invalid answer value" }, { status: 400 });
    }
  }

  // All 12 checkpoints must be answered for a complete submission
  const answeredIds = Object.keys(answers);
  if (answeredIds.length !== CHECKPOINT_IDS.length || !CHECKPOINT_IDS.every(id => id in answers)) {
    return NextResponse.json({ error: "All questions must be answered" }, { status: 400 });
  }

  // Recalculate totalScore and dimensionScores entirely server-side — never trust client values
  const validAnswers = answers as Record<string, number>;
  const totalScore   = CHECKPOINT_IDS.reduce((sum, id) => sum + validAnswers[id], 0);
  const dimensionScores = Object.fromEntries(
    DIMENSIONS.map(d => [
      d.id,
      {
        score:     d.checkpoints.reduce((s, id) => s + validAnswers[id], 0),
        maxPoints: d.maxPoints,
      },
    ])
  );

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
      answers:          validAnswers,
      dimension_scores: dimensionScores,
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
        sendScorecardLeadEmail({ to: cleanEmail, firstName, score, tier, answers: validAnswers, dimScores, leadId: data.id }),
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
