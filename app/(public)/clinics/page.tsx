import Link from "next/link";
import { ArrowRight, MessageCircle, CheckCircle, GraduationCap, Calendar, Clock, Users, Quote, Building2, ChevronDown } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { courseSchema, breadcrumbSchema } from "@/lib/seo/schemas";
import { siteConfig, buildWhatsAppUrl } from "@/config/site";
import { digitalVisibilityClinic } from "@/constants/clinics";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { SessionsCarousel } from "@/components/clinics/SessionsCarousel";
import { ComingSoonCarousel } from "@/components/clinics/ComingSoonCarousel";

export const metadata = generatePageMetadata({
  title: "Clinics",
  description: "Practical scholarly visibility transformation clinics. Join the Digital Visibility Clinic and develop the skills, systems, and strategy for global research impact.",
  path: "/clinics",
});

function formatCohortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function formatNGN(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

function formatUSD(amount: number) {
  return `$${amount}`;
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
  const cohort      = digitalVisibilityClinic.nextCohort;
  const spotsTaken  = await getSpotsTaken();
  const spotsLeft   = Math.max(0, digitalVisibilityClinic.capacity - spotsTaken - cohort.spotsAlreadyFilled);
  const isClosingSoon = spotsLeft <= 5;
  const isFull        = cohort.status === "full" || spotsLeft === 0;

  const { tiers } = digitalVisibilityClinic.pricing;
  const { testimonials } = digitalVisibilityClinic;

  const TIER_ACCENTS: Record<string, string> = {
    pro:     "#8B5CF6",
    builder: "#2563EB",
    starter: "#10B981",
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080E1A" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
          { name: "Home",    url: siteConfig.url },
          { name: "Clinics", url: `${siteConfig.url}/clinics` },
        ])) }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">

        {/* Hero header */}
        <div className="max-w-3xl mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#2563EB" }}>
            Researchvy Clinics
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-[1.1]"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB", letterSpacing: "-0.02em" }}
          >
            Stop Being Invisible.<br />
            <span style={{ color: "#10B981" }}>Start Being Found.</span>
          </h1>
          <p className="text-base sm:text-lg leading-relaxed max-w-2xl" style={{ color: "#6B7280" }}>
            Live, structured clinics that take researchers from overlooked to globally discoverable,
            with a personal strategy, a verified certificate, and results you can measure.
          </p>
        </div>

        {/* Next cohort urgency banner */}
        {cohort.status !== "tba" && (
          <div
            className="rounded-2xl border p-6 sm:p-8 mb-12"
            style={{
              backgroundColor: isFull ? "rgba(239,68,68,0.05)" : "rgba(16,185,129,0.04)",
              borderColor:     isFull ? "rgba(239,68,68,0.2)"  : "rgba(16,185,129,0.18)",
            }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

              {/* Left — headline + tracks */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <p className="text-base font-bold" style={{ color: "#F9FAFB" }}>
                    July 2026 Cohort: Now Open
                  </p>
                  <span
                    className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: isFull ? "rgba(239,68,68,0.15)" : isClosingSoon ? "rgba(245,158,11,0.15)" : "rgba(16,185,129,0.15)",
                      color: isFull ? "#F87171" : isClosingSoon ? "#FCD34D" : "#10B981",
                    }}
                  >
                    {isFull ? "Full" : isClosingSoon ? `${spotsLeft} spots left` : `${spotsLeft} spots remaining`}
                  </span>
                  <span
                    className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: "rgba(245,158,11,0.12)", color: "#F59E0B" }}
                  >
                    Early bird ends June 20
                  </span>
                </div>

                {/* Two tracks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  {(["wednesday", "sunday"] as const).map((key) => {
                    const track = cohort.tracks[key];
                    return (
                      <div
                        key={key}
                        className="rounded-xl border px-4 py-3.5"
                        style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
                      >
                        <p className="text-[10px] font-bold tracking-widest uppercase mb-1.5" style={{ color: "#4B5563" }}>
                          {track.label} Track
                        </p>
                        <p className="text-sm font-semibold" style={{ color: "#F9FAFB" }}>
                          {track.day}s · {cohort.sessionTime}
                        </p>
                        <p className="text-xs mt-1" style={{ color: "#6B7280" }}>
                          Starts {formatCohortDate(track.startDate)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs" style={{ color: "#6B7280" }}>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                    2 hrs/session · platform activities between sessions
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 flex-shrink-0" />
                    ≤ {digitalVisibilityClinic.capacity} per cohort
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                    Registration closes {formatCohortDate(cohort.registrationDeadline)}
                  </span>
                </div>
              </div>

              {/* Right — CTA */}
              {!isFull && (
                <div className="shrink-0 flex flex-col items-start lg:items-end gap-2">
                  <a
                    href={buildWhatsAppUrl("Digital Visibility Clinic July 2026 cohort")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white whitespace-nowrap"
                    style={{ backgroundColor: isClosingSoon ? "#D97706" : "#2563EB" }}
                  >
                    <MessageCircle className="h-4 w-4" />
                    {isClosingSoon ? "Reserve My Spot Now" : "Join July Cohort"}
                  </a>
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
          className="rounded-3xl border overflow-hidden mb-14"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <div className="h-1" style={{ background: "linear-gradient(90deg, #2563EB, #10B981)" }} />

          <div className="p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

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
                    href={buildWhatsAppUrl(digitalVisibilityClinic.name)}
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
                  4-Session Curriculum
                </p>
                <SessionsCarousel />

                <div
                  className="mt-5 rounded-xl p-4 border"
                  style={{ backgroundColor: "rgba(37,99,235,0.05)", borderColor: "rgba(37,99,235,0.2)" }}
                >
                  <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>
                    🏆 Earn the <strong style={{ color: "#F9FAFB" }}>Certificate of Scholarly Visibility Practice</strong> upon
                    successful completion, downloadable, shareable on LinkedIn, and verifiable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── PRICING ──────────────────────────────────────────────────── */}
        <div className="mb-20" id="pricing">

          {/* Early bird urgency strip */}
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 rounded-xl border px-5 py-4 mb-10"
            style={{ backgroundColor: "rgba(245,158,11,0.04)", borderColor: "rgba(245,158,11,0.18)" }}
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse mt-1 sm:mt-0"
              style={{ backgroundColor: "#F59E0B" }}
            />
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm flex-1">
              <span className="font-bold" style={{ color: "#F9FAFB" }}>
                Early bird pricing ends June 20, 2026
              </span>
              <span className="hidden sm:inline" style={{ color: "#4B5563" }}>·</span>
              <span style={{ color: "#6B7280" }}>
                Next cohort: July 1 – 28, 2026 · {spotsLeft} spots remaining
              </span>
            </div>
            <a
              href={buildWhatsAppUrl("Digital Visibility Clinic July 2026 early bird enrollment")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold whitespace-nowrap flex-shrink-0"
              style={{ color: "#F59E0B" }}
            >
              Claim early bird <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Section header */}
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
              Investment
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
            >
              Choose Your Transformation
            </h2>
            <p className="text-sm max-w-xl mx-auto" style={{ color: "#6B7280" }}>
              All prices shown in USD and NGN. Early bird saves up to $70 / ₦31,000, closes June 20.
            </p>
          </div>

          {/* Tier cards — Pro first (anchor), Builder centre (recommended), Starter last */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
            {tiers.map((tier) => {
              const accent = TIER_ACCENTS[tier.id] ?? "#2563EB";
              const usdSave = tier.usd.regular - tier.usd.earlyBird;
              const ngnSave = tier.ngn.regular - tier.ngn.earlyBird;

              return (
                <div
                  key={tier.id}
                  className="rounded-2xl border overflow-hidden flex flex-col"
                  style={{
                    backgroundColor: "#0F172A",
                    borderColor: tier.recommended ? `${accent}60` : "#1E293B",
                    boxShadow: tier.recommended ? `0 0 0 1px ${accent}40` : "none",
                  }}
                >
                  {/* Top accent bar */}
                  <div className="h-1" style={{ backgroundColor: accent }} />

                  <div className="p-7 flex flex-col flex-1">
                    {/* Header row: tagline + name left, badge right — in-flow, no overlap */}
                    <div className="flex items-start justify-between gap-3 mb-5">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: accent }}>
                          {tier.tagline}
                        </p>
                        <h3 className="text-xl font-bold" style={{ color: "#F9FAFB" }}>
                          {tier.name}
                        </h3>
                      </div>
                      {tier.recommended && (
                        <span
                          className="flex-shrink-0 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full whitespace-nowrap"
                          style={{ backgroundColor: `${accent}20`, color: accent, border: `1px solid ${accent}40` }}
                        >
                          ★ Most Popular
                        </span>
                      )}
                    </div>

                    {/* Pricing block */}
                    <div
                      className="rounded-xl p-4 mb-6"
                      style={{ backgroundColor: "#1E293B" }}
                    >
                      {/* Early bird price */}
                      <div className="mb-3">
                        <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: "#F59E0B" }}>
                          Early bird · ends Jun 20
                        </p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold" style={{ color: "#F9FAFB" }}>
                            {formatUSD(tier.usd.earlyBird)}
                          </span>
                          <span className="text-base font-semibold" style={{ color: "#6B7280" }}>
                            USD
                          </span>
                        </div>
                        <p className="text-sm font-semibold mt-0.5" style={{ color: accent }}>
                          {formatNGN(tier.ngn.earlyBird)} NGN
                        </p>
                      </div>

                      {/* Regular price strikethrough */}
                      <div className="pt-3 border-t" style={{ borderColor: "#334155" }}>
                        <p className="text-xs" style={{ color: "#4B5563" }}>
                          After June 20:{" "}
                          <span style={{ textDecoration: "line-through", color: "#374151" }}>
                            {formatUSD(tier.usd.regular)} / {formatNGN(tier.ngn.regular)}
                          </span>
                        </p>
                        <p className="text-xs font-semibold mt-0.5" style={{ color: "#10B981" }}>
                          Save {formatUSD(usdSave)} · {formatNGN(ngnSave)}
                        </p>
                      </div>
                    </div>

                    {/* Feature list */}
                    <ul className="space-y-2.5 mb-8 flex-1">
                      {tier.includes.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs leading-relaxed">
                          <CheckCircle
                            className="h-3.5 w-3.5 flex-shrink-0 mt-0.5"
                            style={{ color: accent }}
                          />
                          <span style={{ color: "#D1D5DB" }}>
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <a
                      href={buildWhatsAppUrl(tier.whatsappContext)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold text-white"
                      style={{ backgroundColor: accent }}
                    >
                      <MessageCircle className="h-4 w-4" />
                      {tier.cta}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Which tier guide */}
          <div
            className="rounded-2xl border p-7"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            <p className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: "#6B7280" }}>
              Not sure which tier is right for you?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  signal: "You've never set up ORCID, Google Scholar, or Scopus properly",
                  tier: "Visibility Starter",
                  color: "#10B981",
                },
                {
                  signal: "You have profiles but citations are fragmented and h-index isn't moving",
                  tier: "Visibility Builder",
                  color: "#2563EB",
                  badge: "← most researchers",
                },
                {
                  signal: "You're publishing steadily and want strategic depth plus a 1:1 session",
                  tier: "Visibility Pro",
                  color: "#8B5CF6",
                },
              ].map(({ signal, tier, color, badge }) => (
                <div
                  key={tier}
                  className="rounded-xl border p-4"
                  style={{ backgroundColor: "#080E1A", borderColor: `${color}25` }}
                >
                  <p className="text-xs leading-relaxed mb-3" style={{ color: "#9CA3AF" }}>
                    {signal}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold" style={{ color }}>→ {tier}</span>
                    {badge && (
                      <span
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: `${color}15`, color }}
                      >
                        {badge}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Group discount strip */}
            <div className="mt-5 pt-5 border-t flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6" style={{ borderColor: "#1E293B" }}>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 flex-shrink-0" style={{ color: "#4B5563" }} />
                <span className="text-xs font-semibold" style={{ color: "#6B7280" }}>Group discounts:</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1.5 sm:gap-x-4 sm:gap-y-1 text-xs" style={{ color: "#6B7280" }}>
                <span>5–10 researchers → <strong style={{ color: "#F9FAFB" }}>20% off</strong></span>
                <span className="hidden sm:inline" style={{ color: "#374151" }}>·</span>
                <span>11–20 researchers → <strong style={{ color: "#F9FAFB" }}>30% off</strong></span>
                <span className="hidden sm:inline" style={{ color: "#374151" }}>·</span>
                <span>Institutional → <a href={buildWhatsAppUrl("institutional group enrollment for Digital Visibility Clinic")} target="_blank" rel="noopener noreferrer" style={{ color: "#2563EB" }}>enquire via WhatsApp</a></span>
              </div>
            </div>
          </div>
        </div>

        {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#10B981" }}>
              From Our Cohort Alumni
            </p>
            <h2
              className="text-3xl font-bold"
              style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
            >
              Researchers Who've Been Through It
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border p-6 flex flex-col"
                style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
              >
                <Quote className="h-5 w-5 mb-4 flex-shrink-0" style={{ color: "#1E3A5F" }} />
                <p className="text-sm leading-relaxed flex-1 mb-5" style={{ color: "#D1D5DB" }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="border-t pt-4" style={{ borderColor: "#1E293B" }}>
                  <p className="text-sm font-semibold" style={{ color: "#F9FAFB" }}>
                    {t.name}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
                    {t.institution}
                  </p>
                  <span
                    className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#10B981", border: "1px solid rgba(16,185,129,0.2)" }}
                  >
                    {t.cohort}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#6B7280" }}>
              Common questions
            </p>
            <h2
              className="text-3xl font-bold"
              style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
            >
              Everything You Need to Know
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {digitalVisibilityClinic.faq.map((item) => (
              <details
                key={item.question}
                className="group rounded-xl border overflow-hidden"
                style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
              >
                <summary
                  className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none"
                  style={{ color: "#F9FAFB" }}
                >
                  <span className="text-sm font-semibold">{item.question}</span>
                  <ChevronDown
                    className="h-4 w-4 flex-shrink-0 transition-transform duration-200 group-open:rotate-180"
                    style={{ color: "#4B5563" }}
                  />
                </summary>
                <div className="px-5 pb-5">
                  <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                    {item.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* ── INSTITUTIONAL ENQUIRY ────────────────────────────────────── */}
        <div
          className="rounded-2xl border p-8 sm:p-10 mb-20 flex flex-col sm:flex-row items-start sm:items-center gap-6"
          style={{ backgroundColor: "rgba(37,99,235,0.04)", borderColor: "rgba(37,99,235,0.18)" }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.25), rgba(37,99,235,0.08))", border: "1px solid rgba(37,99,235,0.3)" }}>
            <Building2 className="h-5 w-5" style={{ color: "#2563EB" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold mb-1" style={{ color: "#F9FAFB" }}>
              Attending as a department or research group?
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
              Groups of 5+ receive 20–30% off. We also provide a formal institutional letter for
              department-funded attendance, ready to present to your finance officer or head of department.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <a
              href={buildWhatsAppUrl("institutional group enrollment for Digital Visibility Clinic")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white whitespace-nowrap"
              style={{ backgroundColor: "#2563EB" }}
            >
              <MessageCircle className="h-4 w-4" />
              Enquire for Group
            </a>
            <Link
              href="/resources/institutional-letter"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold border whitespace-nowrap"
              style={{ borderColor: "#1E293B", color: "#9CA3AF" }}
            >
              Get Institutional Letter <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Coming soon */}
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: "#4B5563" }}>
            More Clinics Launching, Register Interest Now
          </p>
          <ComingSoonCarousel />
        </div>

      </div>
    </div>
  );
}
