import Link from "next/link";
import { ArrowRight, MessageCircle, CheckCircle, GraduationCap, Bell, Calendar, Clock, Users } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { digitalVisibilityClinic } from "@/constants/clinics";
import { buildWhatsAppUrl } from "@/config/site";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";

export const metadata = generatePageMetadata({
  title: "Clinics",
  description: "Practical scholarly visibility transformation clinics. Join the Digital Visibility Clinic and develop the skills, systems, and strategy for global research impact.",
  path: "/clinics",
});

const COMING_SOON = [
  {
    name:    "Institutional Visibility Audit Clinic",
    tagline: "For research offices and university departments",
    icon:    "🏛️",
  },
  {
    name:    "Scholarly Communication Clinic",
    tagline: "Research translation, visual abstracts, and public engagement",
    icon:    "📡",
  },
  {
    name:    "Research Impact Strategy Clinic",
    tagline: "Bibliometrics, citation intelligence, and impact measurement",
    icon:    "📊",
  },
];

function formatCohortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

async function getSpotsTaken(): Promise<number> {
  try {
    const admin = createSupabaseAdminClient();
    const { count } = await admin
      .from("clinic_enquiries")
      .select("*", { count: "exact", head: true })
      .eq("clinic_slug", digitalVisibilityClinic.slug)
      .neq("status", "declined");
    return count ?? 0;
  } catch {
    return 0;
  }
}

export default async function ClinicsPage() {
  const waUrl      = buildWhatsAppUrl(digitalVisibilityClinic.name);
  const cohort     = digitalVisibilityClinic.nextCohort;
  const spotsTaken = await getSpotsTaken();
  const spotsLeft  = Math.max(0, digitalVisibilityClinic.capacity - spotsTaken);
  const isClosingSoon = spotsLeft <= 8;
  const isFull        = cohort.status === "full" || spotsLeft === 0;

  return (
    <div style={{ backgroundColor: "#080E1A", minHeight: "100vh" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
            Researchvy Clinics          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold mb-4 leading-tight"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB", letterSpacing: "-0.02em" }}
          >
            Stop Being Invisible.<br />
            <span style={{ color: "#10B981" }}>Start Being Found.</span>
          </h1>
          <p className="text-base leading-relaxed" style={{ color: "#6B7280" }}>
            Live, structured clinics that take researchers from overlooked to globally discoverable —
            with a personal strategy, a verified certificate, and results you can measure.
          </p>
        </div>

        {/* Next cohort urgency banner */}
        {cohort.status !== "tba" && (
          <div
            className="rounded-2xl border p-6 mb-10"
            style={{
              backgroundColor: isFull ? "rgba(239,68,68,0.05)" : "rgba(16,185,129,0.05)",
              borderColor:     isFull ? "rgba(239,68,68,0.2)"  : "rgba(16,185,129,0.18)",
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">

              {/* Left — headline + tracks */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <p className="text-sm font-bold" style={{ color: "#F9FAFB" }}>
                    July 2026 Cohort — Now Open
                  </p>
                  <span
                    className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: isFull ? "rgba(239,68,68,0.15)" : isClosingSoon ? "rgba(245,158,11,0.15)" : "rgba(16,185,129,0.15)", color: isFull ? "#F87171" : isClosingSoon ? "#FCD34D" : "#10B981" }}
                  >
                    {isFull ? "Full" : isClosingSoon ? `${spotsLeft} spots left` : `${spotsLeft} spots remaining`}
                  </span>
                </div>

                {/* Two tracks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(["wednesday", "saturday"] as const).map((key) => {
                    const track = cohort.tracks[key];
                    return (
                      <div key={key} className="rounded-xl border px-4 py-3" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
                        <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: "#4B5563" }}>{track.label} track</p>
                        <p className="text-sm font-semibold" style={{ color: "#F9FAFB" }}>{track.day}s · {cohort.sessionTime}</p>
                        <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Starts {formatCohortDate(track.startDate)}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-4 text-xs" style={{ color: "#6B7280" }}>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />3 hrs/session · 2 hrs/week tasks · 30 hrs total
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />≤ {digitalVisibilityClinic.capacity} per cohort
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />Registration closes {formatCohortDate(cohort.registrationDeadline)}
                  </span>
                </div>
              </div>

              {/* Right — CTA */}
              {!isFull && (
                <div className="shrink-0 flex flex-col items-start sm:items-end gap-2 justify-center">
                  <Link
                    href="/auth/signup"
                    className="rounded-xl px-5 py-3 text-sm font-bold text-white whitespace-nowrap"
                    style={{ backgroundColor: isClosingSoon ? "#D97706" : "#2563EB" }}
                  >
                    {isClosingSoon ? "Reserve My Spot Now" : "Join July Cohort"}
                  </Link>
                  <p className="text-xs" style={{ color: "#4B5563" }}>
                    Choose your track after sign-up
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Featured clinic */}
        <div
          className="rounded-3xl border overflow-hidden mb-16"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          {/* Top accent */}
          <div className="h-1" style={{ background: "linear-gradient(90deg, #2563EB, #10B981)" }} />

          <div className="p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

              {/* Left */}
              <div>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold mb-5"
                  style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#10B981", border: "1px solid rgba(16,185,129,0.2)" }}
                >
                  <GraduationCap className="h-3.5 w-3.5" />
                  Flagship Programme
                </span>

                <h2
                  className="text-3xl sm:text-4xl font-bold mb-3 leading-tight"
                  style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
                >
                  {digitalVisibilityClinic.name}
                </h2>
                <p className="text-base mb-8" style={{ color: "#6B7280" }}>
                  {digitalVisibilityClinic.description}
                </p>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4 mb-8 p-4 rounded-xl" style={{ backgroundColor: "#1E293B" }}>
                  {[
                    { label: "Sessions",  value: digitalVisibilityClinic.duration },
                    { label: "Format",    value: "Live + Recorded" },
                    { label: "Cohort",    value: `≤ ${digitalVisibilityClinic.capacity}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center">
                      <p className="text-sm font-bold" style={{ color: "#F9FAFB" }}>{value}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#4B5563" }}>{label}</p>
                    </div>
                  ))}
                </div>

                {/* Outcomes */}
                <ul className="space-y-2.5 mb-8">
                  {digitalVisibilityClinic.outcomes.map((outcome) => (
                    <li key={outcome} className="flex items-start gap-3 text-sm" style={{ color: "#D1D5DB" }}>
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: "#10B981" }} />
                      {outcome}
                    </li>
                  ))}
                </ul>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/clinics/${digitalVisibilityClinic.slug}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all duration-200 bg-[#2563EB] hover:bg-[#1D4ED8]"
                  >
                    View Full Programme <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 border border-[#25D366] text-[#25D366] hover:bg-[rgba(37,211,102,0.1)]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Enquire via WhatsApp
                  </a>
                </div>
              </div>

              {/* Right — sessions preview */}
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: "#4B5563" }}>
                  6-Session Curriculum
                </p>
                <div className="space-y-3">
                  {digitalVisibilityClinic.sessions.map((session) => (
                    <div
                      key={session.number}
                      className="flex items-start gap-4 rounded-xl p-4"
                      style={{ backgroundColor: "#1E293B" }}
                    >
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: "#2563EB", color: "#fff" }}
                      >
                        {session.number}
                      </span>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "#F9FAFB" }}>
                          {session.title}
                        </p>
                        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "#6B7280" }}>
                          {session.description.split(".")[0]}.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="mt-5 rounded-xl p-4 border"
                  style={{ backgroundColor: "rgba(37,99,235,0.05)", borderColor: "rgba(37,99,235,0.2)" }}
                >
                  <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>
                    🏆 Earn the <strong style={{ color: "#F9FAFB" }}>Certificate of Scholarly Visibility Practice</strong> upon
                    successful completion — downloadable, shareable on LinkedIn, and verifiable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coming soon */}
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: "#4B5563" }}>
            More Clinics Launching — Register Interest Now
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {COMING_SOON.map(({ name, tagline, icon }) => (
              <div
                key={name}
                className="rounded-2xl border p-6 opacity-60"
                style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
              >
                <p className="text-2xl mb-3">{icon}</p>
                <p className="text-sm font-semibold mb-1" style={{ color: "#F9FAFB" }}>{name}</p>
                <p className="text-xs leading-relaxed mb-4" style={{ color: "#6B7280" }}>{tagline}</p>
                <a
                  href={buildWhatsAppUrl(`${name} — register interest`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors hover:bg-[#1E3A2F]"
                  style={{ backgroundColor: "#1E293B", color: "#10B981", border: "1px solid rgba(16,185,129,0.2)" }}
                >
                  <Bell className="h-3 w-3" />
                  Notify Me
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
