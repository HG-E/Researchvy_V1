import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle, CheckCircle, GraduationCap, Calendar, Clock, Users, TrendingUp, Award, FileText, User } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { courseSchema, breadcrumbSchema, faqSchema } from "@/lib/seo/schemas";
import { siteConfig, buildWhatsAppUrl } from "@/config/site";
import { digitalVisibilityClinic } from "@/constants/clinics";
import { SessionsCarousel } from "@/components/clinics/SessionsCarousel";
import { ComingSoonCarousel } from "@/components/clinics/ComingSoonCarousel";
import { TestimonialsCarousel } from "@/components/clinics/TestimonialsCarousel";
import { ClinicFAQ } from "@/components/clinics/ClinicFAQ";
import { EarlyBirdCountdown } from "@/components/clinics/EarlyBirdCountdown";
import { ClinicsUrgencyBanner } from "@/components/clinics/ClinicsUrgencyBanner";

export const revalidate = 300; // Revalidate every 5 min so spot counts stay fresh

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

export default async function ClinicsPage() {
  const cohort        = digitalVisibilityClinic.nextCohort;
  const isEarlyBird   = new Date() < new Date(cohort.earlyBirdDeadline + "T23:59:59");
  const earlyBirdDate = formatCohortDate(cohort.earlyBirdDeadline);

  const { bundles } = digitalVisibilityClinic.pricing;

  const BUNDLE_ACCENTS: Record<string, string> = {
    solo: "#10B981",
    core: "#2563EB",
    pro:  "#8B5CF6",
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(digitalVisibilityClinic.faq)) }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">

        {/* Hero header */}
        <div className="max-w-3xl mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#2563EB" }}>
            Researchvy Clinics
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-[1.1]"
            style={{ fontFamily: "var(--font-serif)", color: "#111827", letterSpacing: "-0.02em" }}
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
            <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
              <strong style={{ color: "#111827" }}>Every promotion cycle evaluates your Scopus profile, h-index, and citation record.</strong>{" "}
              Most researchers publish without ever optimising how that work is found, attributed, or cited.
              Nobody taught you the system. This clinic does — across 5 core sessions, with your actual profile.
            </p>
          </div>
        </div>

        {/* Next cohort urgency banner — streams independently so hero renders immediately */}
        <Suspense fallback={
          <div className="rounded-2xl border p-6 sm:p-8 mb-12 animate-pulse" style={{ backgroundColor: "#F8FAFC", borderColor: "#E2E8F0", minHeight: "120px" }} />
        }>
          <ClinicsUrgencyBanner isEarlyBird={isEarlyBird} earlyBirdDate={earlyBirdDate} />
        </Suspense>

        {/* Featured clinic */}
        <div
          className="rounded-3xl border overflow-hidden mb-14"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
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
                  style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
                >
                  {digitalVisibilityClinic.name}
                </h2>
                <p className="text-base mb-8" style={{ color: "#6B7280" }}>
                  {digitalVisibilityClinic.description}
                </p>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4 mb-8 p-4 rounded-xl" style={{ backgroundColor: "#F1F5F9" }}>
                  {[
                    { label: "Sessions",  value: digitalVisibilityClinic.duration },
                    { label: "Format",    value: "Live + Recorded" },
                    { label: "Cohort",    value: `≤ ${digitalVisibilityClinic.capacity}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center">
                      <p className="text-sm font-bold" style={{ color: "#111827" }}>{value}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{label}</p>
                    </div>
                  ))}
                </div>

                {/* Outcomes */}
                <ul className="space-y-2.5 mb-8">
                  {digitalVisibilityClinic.outcomes.map((outcome) => (
                    <li key={outcome} className="flex items-start gap-3 text-sm" style={{ color: "#374151" }}>
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
                <p className="mt-3 text-xs" style={{ color: "#9CA3AF" }}>
                  No WhatsApp?{" "}
                  <a
                    href={`mailto:${siteConfig.contact.email}?subject=Digital%20Visibility%20Clinic%20Enquiry`}
                    className="font-medium hover:underline"
                    style={{ color: "#6B7280" }}
                  >
                    Email {siteConfig.contact.email} →
                  </a>
                </p>
              </div>

              {/* Right — sessions preview */}
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: "#6B7280" }}>
                  5 Core Sessions
                </p>
                <Suspense fallback={<div className="h-64 rounded-2xl animate-pulse" style={{ backgroundColor: "#FFFFFF" }} />}>
                  <SessionsCarousel />
                </Suspense>

                <div
                  className="mt-5 rounded-xl p-4 border"
                  style={{ backgroundColor: "rgba(37,99,235,0.05)", borderColor: "rgba(37,99,235,0.2)" }}
                >
                  <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>
                    🏆 Earn the <strong style={{ color: "#111827" }}>Certificate of Scholarly Visibility Practice</strong> upon
                    successful completion, downloadable, shareable on LinkedIn, and verifiable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── WHO IT'S FOR (Item 29) ───────────────────────────────────── */}
        <div className="mb-14 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div
            className="rounded-2xl border p-6"
            style={{ backgroundColor: "#F0FDF4", borderColor: "rgba(16,185,129,0.25)" }}
          >
            <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#10B981" }}>
              This clinic is designed for you if…
            </p>
            <ul className="space-y-2.5 text-sm" style={{ color: "#374151" }}>
              {[
                "You've published at least one paper and want citations to reflect your output",
                "You're approaching a promotion or grant cycle that evaluates h-index and Scopus metrics",
                "You're invisible outside your institution and want global discoverability",
                "You've never optimised your ORCID, Google Scholar, or LinkedIn as a researcher",
                "You want a structured system, not scattered YouTube tips",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: "#10B981" }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="rounded-2xl border p-6"
            style={{ backgroundColor: "#FFF7ED", borderColor: "rgba(249,115,22,0.2)" }}
          >
            <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#F97316" }}>
              It&apos;s probably not the right fit if…
            </p>
            <ul className="space-y-2.5 text-sm" style={{ color: "#374151" }}>
              {[
                "You're a first-year PhD student with no publications yet — come back after your first paper",
                "Your h-index is already above 20 and your profile is fully optimised",
                "You're in a field where ORCID, Scopus, and Google Scholar aren't the primary discovery systems",
                "You're looking for help writing or publishing research, not improving how it's found",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-sm font-bold flex-shrink-0 mt-0.5" style={{ color: "#F97316" }}>×</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── PRICING ──────────────────────────────────────────────────── */}
        <div className="mb-20" id="pricing">

          {/* Early bird urgency strip — only shown while early bird is active */}
          {isEarlyBird && (
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
                  <span className="font-bold" style={{ color: "#111827" }}>
                    Early bird pricing ends {earlyBirdDate}
                  </span>
                  <span className="hidden sm:inline" style={{ color: "#6B7280" }}>·</span>
                  <span style={{ color: "#6B7280" }}>
                    July cohort · limited spots remaining
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
              <div className="mt-3 pt-3 border-t flex items-center gap-3" style={{ borderColor: "rgba(245,158,11,0.15)" }}>
                <span className="text-xs" style={{ color: "#6B7280" }}>Early bird closes in:</span>
                <EarlyBirdCountdown deadline={digitalVisibilityClinic.pricing.earlyBirdDeadline} />
              </div>
            </div>
          )}

          {/* Section header */}
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
              Investment
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
            >
              Choose Your Transformation
            </h2>
            <p className="text-sm max-w-xl mx-auto" style={{ color: "#6B7280" }}>
              All prices shown in USD and NGN.{isEarlyBird && ` Early bird saves up to $90 / ₦45,000 on the Pro Bundle — closes ${earlyBirdDate}.`}
            </p>
          </div>

          {/* Bundle cards — Solo, Core (recommended), Pro */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
            {bundles.map((bundle) => {
              const accent  = BUNDLE_ACCENTS[bundle.id] ?? "#2563EB";
              const usdSave = bundle.usd.regular - bundle.usd.earlyBird;
              const ngnSave = bundle.ngn.regular - bundle.ngn.earlyBird;

              return (
                <div
                  key={bundle.id}
                  className="rounded-2xl border overflow-hidden flex flex-col"
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderColor: bundle.recommended ? `${accent}60` : "#1E293B",
                    boxShadow: bundle.recommended ? `0 0 0 1px ${accent}40` : "none",
                  }}
                >
                  {/* Top accent bar */}
                  <div className="h-1" style={{ backgroundColor: accent }} />

                  <div className="p-7 flex flex-col flex-1">
                    {/* Header row: tagline + name left, badge right */}
                    <div className="flex items-start justify-between gap-3 mb-5">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: accent }}>
                          {bundle.tagline}
                        </p>
                        <h3 className="text-xl font-bold" style={{ color: "#111827" }}>
                          {bundle.name}
                        </h3>
                      </div>
                      {bundle.recommended && (
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
                      style={{ backgroundColor: "#F1F5F9" }}
                    >
                      {/* Early bird price */}
                      <div className="mb-3">
                        <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: isEarlyBird ? "#F59E0B" : "#4B5563" }}>
                          {bundle.isSolo ? "From · per module" : isEarlyBird ? `Early bird · ends ${earlyBirdDate}` : "Regular price"}
                        </p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold" style={{ color: "#111827" }}>
                            {bundle.isSolo ? "from " : ""}{formatUSD(isEarlyBird ? bundle.usd.earlyBird : bundle.usd.regular)}
                          </span>
                          <span className="text-base font-semibold" style={{ color: "#6B7280" }}>
                            USD
                          </span>
                        </div>
                        <p className="text-sm font-semibold mt-0.5" style={{ color: accent }}>
                          {bundle.isSolo ? "from " : ""}{formatNGN(isEarlyBird ? bundle.ngn.earlyBird : bundle.ngn.regular)} NGN
                        </p>
                      </div>

                      {/* Regular price / savings */}
                      <div className="pt-3 border-t" style={{ borderColor: "#CBD5E1" }}>
                        {bundle.isSolo ? (
                          <p className="text-xs" style={{ color: "#6B7280" }}>
                            Prices vary per module · see FAQ
                          </p>
                        ) : isEarlyBird ? (
                          <>
                            <p className="text-xs" style={{ color: "#6B7280" }}>
                              After {earlyBirdDate}:{" "}
                              <span style={{ textDecoration: "line-through", color: "#6B7280" }}>
                                {formatUSD(bundle.usd.regular)} / {formatNGN(bundle.ngn.regular)}
                              </span>
                            </p>
                            <p className="text-xs font-semibold mt-0.5" style={{ color: "#10B981" }}>
                              {bundle.savingsLabel} · Save {formatUSD(usdSave)} · {formatNGN(ngnSave)}
                            </p>
                          </>
                        ) : (
                          <p className="text-xs" style={{ color: "#6B7280" }}>
                            Regular price applies
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Feature list */}
                    <ul className="space-y-2.5 mb-8 flex-1">
                      {bundle.includes.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs leading-relaxed">
                          <CheckCircle
                            className="h-3.5 w-3.5 flex-shrink-0 mt-0.5"
                            style={{ color: accent }}
                          />
                          <span style={{ color: "#374151" }}>
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA — WhatsApp enquiry */}
                    {(
                      <a
                        href={buildWhatsAppUrl(bundle.whatsappContext)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold text-white"
                        style={{ backgroundColor: accent }}
                      >
                        <MessageCircle className="h-4 w-4" />
                        {bundle.cta}
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Which bundle guide */}
          <div
            className="rounded-2xl border p-7"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
          >
            <p className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: "#6B7280" }}>
              Not sure which bundle is right for you?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  signal: "You need one specific platform right now — ORCID, LinkedIn, or WordPress — and want to start there",
                  bundle: "Single Module",
                  color: "#10B981",
                },
                {
                  signal: "You want the complete foundation: ORCID, LinkedIn, and WordPress built together as a connected system",
                  bundle: "DVC Core Bundle",
                  color: "#2563EB",
                  badge: "← most researchers",
                },
                {
                  signal: "You want full depth: Core modules plus citation database strategy and a publishing intelligence masterclass",
                  bundle: "DVC Pro Bundle",
                  color: "#8B5CF6",
                },
              ].map(({ signal, bundle, color, badge }) => (
                <div
                  key={bundle}
                  className="rounded-xl border p-4"
                  style={{ backgroundColor: "#FFFFFF", borderColor: `${color}25` }}
                >
                  <p className="text-xs leading-relaxed mb-3" style={{ color: "#6B7280" }}>
                    {signal}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold" style={{ color }}>→ {bundle}</span>
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
            <div className="mt-5 pt-5 border-t flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6" style={{ borderColor: "#E2E8F0" }}>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 flex-shrink-0" style={{ color: "#6B7280" }} />
                <span className="text-xs font-semibold" style={{ color: "#6B7280" }}>Group discounts:</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1.5 sm:gap-x-4 sm:gap-y-1 text-xs" style={{ color: "#6B7280" }}>
                <span>3–10 researchers → <strong style={{ color: "#111827" }}>15% off</strong></span>
                <span className="hidden sm:inline" style={{ color: "#6B7280" }}>·</span>
                <span>11–20 researchers → <strong style={{ color: "#111827" }}>25% off</strong></span>
                <span className="hidden sm:inline" style={{ color: "#6B7280" }}>·</span>
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
              style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
            >
              Researchers Who&apos;ve Been Through It
            </h2>
          </div>

          <Suspense fallback={<div className="h-56 rounded-2xl animate-pulse" style={{ backgroundColor: "#FFFFFF" }} />}>
            <TestimonialsCarousel />
          </Suspense>
        </div>

        {/* ── FOR INSTITUTIONS & DEPARTMENTS ──────────────────────────── */}
        <div className="mb-20" id="institutional">
          <div className="mb-10">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
              For Institutions &amp; Research Departments
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
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
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
          >
            <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: "#6B7280" }}>
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
                  <p className="text-sm font-bold" style={{ color: "#111827" }}>{name}</p>
                  <p className="text-[10px]" style={{ color: "#6B7280" }}>{sub}</p>
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
                style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${color}18` }}
                >
                  <Icon className="h-5 w-5" style={{ color }} />
                </div>
                <h3 className="text-sm font-bold mb-2" style={{ color: "#111827" }}>{title}</h3>
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
                <p className="text-sm font-bold mb-4" style={{ color: "#111827" }}>Group pricing — per seat</p>
                <div className="space-y-3">
                  {[
                    { range: "3–10 researchers",  saving: "15% off every seat",  example: `Core Bundle: ${formatNGN(Math.round(85000 * 0.85))} / seat` },
                    { range: "11–20 researchers", saving: "25% off every seat",  example: `Core Bundle: ${formatNGN(Math.round(85000 * 0.75))} / seat` },
                    { range: "20+ / full dept",   saving: "Custom institutional rate", example: "Contact us for a tailored quote" },
                  ].map(({ range, saving, example }) => (
                    <div
                      key={range}
                      className="flex items-center justify-between gap-4 rounded-xl px-4 py-3 border"
                      style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
                    >
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "#111827" }}>{range}</p>
                        <p className="text-[11px]" style={{ color: "#6B7280" }}>{example}</p>
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
                <p className="text-sm font-bold mb-4" style={{ color: "#111827" }}>Get your department started</p>
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
                  style={{ borderColor: "#E2E8F0", color: "#6B7280" }}
                >
                  <FileText className="h-4 w-4" />
                  Request Institutional Letter
                </a>
                <p className="text-[11px] text-center" style={{ color: "#6B7280" }}>
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
              style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
            >
              Everything You Need to Know
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <ClinicFAQ items={digitalVisibilityClinic.faq} />
          </div>
        </div>

        {/* ── PRIVATE CONSULTING BRIDGE ────────────────────────────── */}
        <div className="mb-20">
          <div
            className="rounded-2xl border overflow-hidden"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
          >
            <div className="h-0.5" style={{ background: "linear-gradient(90deg, #8B5CF6, #A78BFA)" }} />
            <div className="p-7 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="max-w-xl">
                <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#A78BFA" }}>
                  Prefer 1-on-1?
                </p>
                <h2
                  className="text-xl sm:text-2xl font-bold mb-2"
                  style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
                >
                  Private Consulting — Built Around You, Not a Cohort
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                  If you want bespoke 1-on-1 work on your specific profile — no fixed schedule,
                  no group sessions, just your gaps fixed and your strategy written for you —
                  our Private Consulting track starts at <strong style={{ color: "#111827" }}>$209 / ₦205,000</strong>.
                </p>
              </div>
              <Link
                href="/clinics/private-consulting"
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white whitespace-nowrap flex-shrink-0"
                style={{ backgroundColor: "#8B5CF6" }}
              >
                <User className="h-4 w-4" />
                View Private Consulting
              </Link>
            </div>
          </div>
        </div>

        {/* Coming soon */}
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: "#6B7280" }}>
            More Clinics Launching, Register Interest Now
          </p>
          <Suspense fallback={<div className="h-48 rounded-2xl animate-pulse" style={{ backgroundColor: "#FFFFFF" }} />}>
            <ComingSoonCarousel />
          </Suspense>
        </div>

      </div>
    </div>
  );
}
