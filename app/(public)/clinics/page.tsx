import Link from "next/link";
import { ArrowRight, MessageCircle, CheckCircle, GraduationCap, Calendar, Clock, Users, Building2, TrendingUp, Award, FileText } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { courseSchema, breadcrumbSchema } from "@/lib/seo/schemas";
import { siteConfig, buildWhatsAppUrl } from "@/config/site";
import { digitalVisibilityClinic } from "@/constants/clinics";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { SessionsCarousel } from "@/components/clinics/SessionsCarousel";
import { ComingSoonCarousel } from "@/components/clinics/ComingSoonCarousel";
import { TestimonialsCarousel } from "@/components/clinics/TestimonialsCarousel";
import { ClinicFAQ } from "@/components/clinics/ClinicFAQ";
import { EarlyBirdCountdown } from "@/components/clinics/EarlyBirdCountdown";

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
            <span style={{ color: "#10B981" }}>Start Getting Cited.</span>
          </h1>
          <p className="text-base sm:text-lg leading-relaxed max-w-2xl mb-4" style={{ color: "#6B7280" }}>
            Live, structured clinics that take researchers from overlooked to globally discoverable,
            with a personal strategy, a verified certificate, and results you can measure.
          </p>
          {/* Nigerian career context */}
          <div
            className="rounded-xl border-l-4 px-5 py-4 max-w-2xl"
            style={{ backgroundColor: "rgba(16,185,129,0.04)", borderLeftColor: "#10B981" }}
          >
            <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>
              <strong style={{ color: "#F9FAFB" }}>Every promotion cycle evaluates your Scopus profile, h-index, and citation record.</strong>{" "}
              Most researchers publish without ever optimising how that work is found, attributed, or cited.
              Nobody taught you the system. This clinic does — in four live sessions, with your actual profile.
            </p>
          </div>
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

          {/* Early bird urgency strip with live countdown */}
          <div
            className="rounded-xl border px-5 py-4 mb-10"
            style={{ backgroundColor: "rgba(245,158,11,0.04)", borderColor: "rgba(245,158,11,0.18)" }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
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
                  July cohort · {spotsLeft} spots remaining
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
            {/* Live countdown */}
            <div className="mt-3 pt-3 border-t flex items-center gap-3" style={{ borderColor: "rgba(245,158,11,0.15)" }}>
              <span className="text-xs" style={{ color: "#6B7280" }}>Early bird closes in:</span>
              <EarlyBirdCountdown deadline={digitalVisibilityClinic.pricing.earlyBirdDeadline} />
            </div>
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

          <TestimonialsCarousel />
        </div>

        {/* ── FOR INSTITUTIONS & DEPARTMENTS ──────────────────────────── */}
        <div className="mb-20" id="institutional">
          <div className="mb-10">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
              For Institutions &amp; Research Departments
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
            >
              Book Your Department&apos;s Seats
            </h2>
            <p className="text-base max-w-2xl leading-relaxed" style={{ color: "#6B7280" }}>
              HODs, DVCs Research, and department coordinators: we make institutional booking
              straightforward. One group investment improves your department&apos;s collective
              research metrics, staff confidence, and institutional visibility profile.
            </p>
          </div>

          {/* Trust anchor: delivery partners */}
          <div
            className="rounded-2xl border px-6 py-5 mb-8"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: "#4B5563" }}>
              Previously delivered in partnership with
            </p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              {[
                { name: "ASM Nigeria",           sub: "American Society for Microbiology, Nigeria Chapter" },
                { name: "FUTO EHS Dept",          sub: "Federal University of Technology, Owerri" },
                { name: "Bingham University",     sub: "Bingham University, Nigeria" },
                { name: "Olabisi Onabanjo Univ.", sub: "Ogun State, Nigeria" },
              ].map(({ name, sub }) => (
                <div key={name}>
                  <p className="text-sm font-bold" style={{ color: "#F9FAFB" }}>{name}</p>
                  <p className="text-[10px]" style={{ color: "#4B5563" }}>{sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Three reasons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              {
                icon: TrendingUp,
                color: "#10B981",
                title: "Improve Research Rankings",
                body:  "Higher citation counts and h-index scores directly improve your institution's NUC evaluation, Times Higher Education, and Scopus SIR rankings.",
              },
              {
                icon: Award,
                color: "#8B5CF6",
                title: "Staff Development for Accreditation",
                body:  "Demonstrable CPD investment in research skills development is a recognised criterion in NUC programme accreditation and institutional audit cycles.",
              },
              {
                icon: FileText,
                color: "#F59E0B",
                title: "Ready for Finance Approval",
                body:  "We issue a formal institutional letter within 24 hours — formatted for your finance officer or Head of Department, with full programme details and your institutional quote.",
              },
            ].map(({ icon: Icon, color, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border p-6"
                style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${color}18` }}
                >
                  <Icon className="h-5 w-5" style={{ color }} />
                </div>
                <h3 className="text-sm font-bold mb-2" style={{ color: "#F9FAFB" }}>{title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>{body}</p>
              </div>
            ))}
          </div>

          {/* Group pricing + CTAs */}
          <div
            className="rounded-2xl border p-7"
            style={{ backgroundColor: "rgba(37,99,235,0.04)", borderColor: "rgba(37,99,235,0.2)" }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div>
                <p className="text-sm font-bold mb-4" style={{ color: "#F9FAFB" }}>Group pricing — per seat</p>
                <div className="space-y-3">
                  {[
                    { range: "5–10 researchers",  saving: "20% off every seat",  example: `Builder: ${formatNGN(65000 * 0.80)} / seat` },
                    { range: "11–20 researchers", saving: "30% off every seat",  example: `Builder: ${formatNGN(65000 * 0.70)} / seat` },
                    { range: "20+ / full dept",   saving: "Custom institutional rate", example: "Contact us for a tailored quote" },
                  ].map(({ range, saving, example }) => (
                    <div
                      key={range}
                      className="flex items-center justify-between gap-4 rounded-xl px-4 py-3 border"
                      style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
                    >
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "#F9FAFB" }}>{range}</p>
                        <p className="text-[11px]" style={{ color: "#4B5563" }}>{example}</p>
                      </div>
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
                        style={{ backgroundColor: "rgba(16,185,129,0.12)", color: "#10B981" }}
                      >
                        {saving}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-bold mb-4" style={{ color: "#F9FAFB" }}>Get your department started</p>
                <a
                  href={buildWhatsAppUrl("institutional group enrollment for Digital Visibility Clinic — requesting dept quote")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold text-white"
                  style={{ backgroundColor: "#2563EB" }}
                >
                  <MessageCircle className="h-4 w-4" />
                  Request a Department Quote
                </a>
                <a
                  href={buildWhatsAppUrl("institutional letter request for Digital Visibility Clinic")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold border"
                  style={{ borderColor: "#1E293B", color: "#9CA3AF" }}
                >
                  <FileText className="h-4 w-4" />
                  Request Institutional Letter
                </a>
                <p className="text-[11px] text-center" style={{ color: "#4B5563" }}>
                  Letter issued within 24 hours · Formatted for HOD or finance office
                </p>
              </div>
            </div>
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

          <div className="max-w-3xl mx-auto">
            <ClinicFAQ items={digitalVisibilityClinic.faq} />
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
