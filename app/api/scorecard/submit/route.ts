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
    answers?: Record<string, number>;
    totalScore?: number;
    dimensionScores?: Record<string, { score: number; maxPoints: number }>;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { answers, totalScore, dimensionScores } = body;

  if (
    typeof totalScore !== "number" ||
    totalScore < 0 ||
    totalScore > 100 ||
    !answers ||
    typeof answers !== "object"
  ) {
    return NextResponse.json({ error: "Invalid scorecard data" }, { status: 400 });
  }

  // Best-effort source tracking
  const referer = req.headers.get("referer") ?? null;
  const source  = referer ? new URL(referer).hostname : null;

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("visibility_scorecard_leads")
    .insert({
      total_score:      totalScore,
      tier:             getTier(totalScore),
      answers,
      dimension_scores: dimensionScores ?? {},
      source,
      status:           "new",
    })
    .select("id")
    .single();

  if (error) {
    console.error("[scorecard/submit]", error.message);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}
