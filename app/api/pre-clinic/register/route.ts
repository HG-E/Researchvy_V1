import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { PRE_CLINIC_SESSIONS, CAREER_STAGES } from "@/constants/preClinic";

const VALID_SESSIONS = PRE_CLINIC_SESSIONS.map(s => s.id);
const VALID_STAGES   = CAREER_STAGES.map(s => s.id);

// Excludes "?" in addition to whitespace/"@" — an email containing "?" would let a
// registrant inject extra headers (e.g. "?cc=") into the admin's mailto: follow-up link.
const EMAIL_RE = /^[^\s@?]+@[^\s@?]+\.[^\s@?]+$/;

export async function POST(req: NextRequest) {
  // 5 registrations per hour per IP — generous for legitimate use
  const { allowed } = await checkRateLimit(getRateLimitKey(req, "pre-clinic"), 5, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many submissions. Try again later." }, { status: 429 });
  }

  let body: {
    fullName?:         unknown;
    email?:             unknown;
    phone?:             unknown;
    session?:           unknown;
    careerStage?:       unknown;
    fieldOfResearch?:   unknown;
    institution?:       unknown;
    source?:            unknown;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Strip embedded newlines from free-text fields before they can reach an email
  // subject line (defense in depth against header injection) or a stored record.
  const stripNewlines = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

  const fullName        = typeof body.fullName === "string" ? stripNewlines(body.fullName) : "";
  const email            = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const phone            = typeof body.phone === "string" ? body.phone.trim() : "";
  const session           = typeof body.session === "string" ? body.session : "";
  const careerStage       = typeof body.careerStage === "string" ? body.careerStage : "";
  const fieldOfResearch  = typeof body.fieldOfResearch === "string" ? stripNewlines(body.fieldOfResearch) : "";
  const institution       = typeof body.institution === "string" ? stripNewlines(body.institution) || null : null;

  if (fullName.length < 2) {
    return NextResponse.json({ error: "Please enter your full name" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
  }
  if (phone.length < 7) {
    return NextResponse.json({ error: "Please enter a valid phone number" }, { status: 400 });
  }
  if (!VALID_SESSIONS.includes(session as (typeof VALID_SESSIONS)[number])) {
    return NextResponse.json({ error: "Please choose a session" }, { status: 400 });
  }
  if (!VALID_STAGES.includes(careerStage as (typeof VALID_STAGES)[number])) {
    return NextResponse.json({ error: "Please select your career stage" }, { status: 400 });
  }
  if (fieldOfResearch.length < 2) {
    return NextResponse.json({ error: "Please enter your field of research" }, { status: 400 });
  }

  // Source: prefer explicit body param (client UTM), fall back to referer
  const referer = req.headers.get("referer") ?? null;
  const source  = typeof body.source === "string" ? body.source : (referer ? new URL(referer).hostname : null);

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("pre_clinic_registrations")
    .insert({
      full_name:          fullName,
      email,
      phone,
      session,
      career_stage:       careerStage,
      field_of_research:  fieldOfResearch,
      institution,
      source,
      status:             "new",
    })
    .select("id")
    .single();

  if (error) {
    // Unique violation on email — already registered; treat as a friendly success, not an error.
    if (error.code === "23505") {
      return NextResponse.json({ alreadyRegistered: true });
    }
    console.error("[pre-clinic/register]", error.message);
    return NextResponse.json({ error: "Failed to register" }, { status: 500 });
  }

  const firstName = fullName.split(" ")[0];

  import("@/lib/email").then(async ({ sendPreClinicConfirmation, sendPreClinicAdminAlert }) => {
    await Promise.allSettled([
      sendPreClinicConfirmation({ to: email, firstName, session: session as (typeof VALID_SESSIONS)[number] }),
      sendPreClinicAdminAlert({
        name:  fullName,
        email,
        phone,
        session,
        careerStage,
        fieldOfResearch,
        institution,
      }),
    ]);
  }).catch(console.error);

  return NextResponse.json({ id: data.id });
}
