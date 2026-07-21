export const revalidate = 3600;

import { notFound } from "next/navigation";
import { FACILITATORS } from "@/constants/facilitators";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle, Award, Users, Monitor, Clock, Zap } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { courseSchema, breadcrumbSchema, faqSchema } from "@/lib/seo/schemas";
import { safeJsonLd } from "@/lib/seo/safeJsonLd";
import { getUsdNgnRate, usdToNgn, formatNgn } from "@/lib/currency/usdNgn";
import { siteConfig } from "@/config/site";
import { digitalVisibilityClinic } from "@/constants/clinics";
import { SessionAccordion } from "@/components/clinics/SessionAccordion";
import { EnquiryCard } from "@/components/clinics/EnquiryCard";
import { CaseStudy } from "@/components/sections/CaseStudy";
import { ClinicFAQ } from "@/components/clinics/ClinicFAQ";
import { EarlyBirdCountdown } from "@/components/clinics/EarlyBirdCountdown";

const CLINICS: Record<string, typeof digitalVisibilityClinic> = {
  [digitalVisibilityClinic.slug]: digitalVisibilityClinic,
};

export function generateStaticParams() {
  return Object.keys(CLINICS).map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const clinic = CLINICS[id];
  if (!clinic) return {};
  return generatePageMetadata({
    title:       clinic.name,
    description: clinic.description,
    path:        `/clinics/${id}`,
  });
}

export default async function ClinicDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const clinic = CLINICS[id];
  if (!clinic) notFound();

  const isEarlyBird = new Date() < new Date(clinic.pricing.earlyBirdDeadline + "T23:59:59");
  const firstBundle = clinic.pricing.bundles[0];
  const rate = await getUsdNgnRate();
  const earlyBirdLabel = isEarlyBird
    ? `From ${formatNgn(usdToNgn(firstBundle.usd.earlyBird, rate))} / $${firstBundle.usd.earlyBird} · early bird`
    : undefined;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(courseSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema(clinic.faq)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema([
          { name: "Home",    url: siteConfig.url },
          { name: "Clinics", url: `${siteConfig.url}/clinics` },
          { name: clinic.name, url: `${siteConfig.url}/clinics/${id}` },
        ])) }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">

        {/* Back */}
        <Link
          href="/clinics"
          className="inline-flex items-center gap-1.5 text-sm mb-10 transition-colors text-[#4B5563] hover:text-[#9CA3AF]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All Clinics
        </Link>

        {/* Hero */}
        <div className="max-w-3xl mb-14">
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold mb-5"
            style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#10B981", border: "1px solid rgba(16,185,129,0.2)" }}
          >
            Flagship Programme · ≤{clinic.capacity} Researchers Per Cohort
          </span>
          <h1
            className="text-4xl sm:text-5xl font-bold mb-4 leading-tight"
            style={{ fontFamily: "var(--font-serif)", color: "#111827", letterSpacing: "-0.02em" }}
          >
            {clinic.name}
          </h1>
          <p className="text-lg leading-relaxed mb-3" style={{ color: "#4B5563" }}>
            {clinic.tagline}
          </p>
          <p className="text-base leading-relaxed" style={{ color: "#4B5563" }}>
            Most researchers finish this clinic and say the same thing: they had no idea how
            invisible they were, and how fixable it was. In our sessions, you get a complete
            scholarly identity overhaul, a personal visibility strategy, and a verified certificate.
          </p>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-3 mt-6">
            {[
              { Icon: Clock,   text: clinic.duration },
              { Icon: Monitor, text: clinic.format },
              { Icon: Users,   text: `Up to ${clinic.capacity} participants` },
              { Icon: Award,   text: "Certificate included" },
            ].map(({ Icon, text }) => (
              <span
                key={text}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
                style={{ backgroundColor: "#F1F5F9", color: "#4B5563" }}
              >
                <Icon className="h-3.5 w-3.5" style={{ color: "#60A5FA" }} />
                {text}
              </span>
            ))}
          </div>
        </div>

        {/* Main layout */}
        <div className="flex flex-col lg:flex-row gap-12 items-start">

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-14">

            {/* Enquiry card — mobile only (in flow) */}
            <div className="lg:hidden">
              <EnquiryCard
                clinicName={clinic.name}
                duration={clinic.duration}
                format={clinic.format}
                capacity={clinic.capacity}
                earlyBirdFrom={earlyBirdLabel}
              />
            </div>

            {/* Scorecard escape valve — cold traffic warmup */}
            <div
              className="rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              style={{ backgroundColor: "rgba(16,185,129,0.05)", borderColor: "rgba(16,185,129,0.2)" }}
            >
              <div className="flex-1">
                <p className="text-sm font-semibold mb-1" style={{ color: "#111827" }}>
                  Not sure if you need this programme?
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "#4B5563" }}>
                  Take the free Researcher Visibility Scorecard first — 4–6 minutes, 12 checkpoints,
                  results shown instantly. Most researchers score 25–45 and use their score to decide
                  which modules matter most.
                </p>
              </div>
              <Link
                href="/resources/visibility-scorecard"
                className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white flex-shrink-0 transition-all duration-200 hover:-translate-y-0.5"
                style={{ backgroundColor: "#10B981" }}
              >
                Take the Scorecard Free
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Outcomes */}
            <section>
              <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#2563EB" }}>
                What You&apos;ll Learn
              </p>
              <h2
                className="text-2xl font-bold mb-6"
                style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
              >
                Programme Outcomes
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {clinic.outcomes.map((outcome, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl p-4"
                    style={{ backgroundColor: "#FFFFFF", border: "1px solid #1E293B" }}
                  >
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: "#10B981" }} />
                    <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>{outcome}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Case study — full width, breaks out of the content column */}
            <div className="-mx-4 sm:-mx-6 lg:mx-0">
              <CaseStudy />
            </div>

            {/* Curriculum */}
            <section>
              <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#2563EB" }}>
                Clinic Curriculum
              </p>
              <h2
                className="text-2xl font-bold mb-6"
                style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
              >
                5 Core Sessions
              </h2>
              <SessionAccordion sessions={clinic.sessions} />
            </section>

            {/* Certificate */}
            <section>
              <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#2563EB" }}>
                On Completion
              </p>
              <h2
                className="text-2xl font-bold mb-6"
                style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
              >
                Your Certificate
              </h2>
              <div
                className="rounded-2xl border p-8"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
              >
                <div className="flex items-start gap-5">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "rgba(245,158,11,0.1)" }}
                  >
                    <Award className="h-7 w-7" style={{ color: "#F59E0B" }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1" style={{ color: "#111827" }}>
                      {clinic.certificate.name}
                    </h3>
                    <p className="text-sm mb-5" style={{ color: "#4B5563" }}>
                      {clinic.certificate.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {clinic.certificate.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-xs" style={{ color: "#4B5563" }}>
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#F59E0B" }} />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Post-clinic benefits */}
            <section>
              <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#2563EB" }}>
                After the Clinic
              </p>
              <h2
                className="text-2xl font-bold mb-6"
                style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
              >
                Post-Clinic Benefits
              </h2>
              <div className="space-y-3">
                {clinic.postClinicBenefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-3 rounded-xl px-5 py-3.5"
                    style={{ backgroundColor: "#FFFFFF", border: "1px solid #1E293B" }}
                  >
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: "#2563EB" }} />
                    <p className="text-sm" style={{ color: "#374151" }}>{benefit}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Meet Your Facilitator ──────────────────────────────── */}
            {FACILITATORS.length > 0 && (
              <section>
                <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#2563EB" }}>
                  Your Facilitator
                </p>
                <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "var(--font-serif)", color: "#111827" }}>
                  Who you&apos;ll be working with
                </h2>

                {FACILITATORS.map((f) => (
                  <div key={f.id} className="rounded-2xl border p-6" style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}>
                    <div className="flex items-start gap-5">
                      <div className="w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold flex-shrink-0" style={{ backgroundColor: "rgba(37,99,235,0.12)", color: "#60A5FA" }}>
                        {f.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm mb-0.5" style={{ color: "#111827" }}>{f.name}</p>
                        <p className="text-xs mb-1" style={{ color: "#60A5FA" }}>{f.title}</p>
                        <p className="text-xs mb-3" style={{ color: "#4B5563" }}>{f.affiliation} · {f.clinicsLed} cohorts · {f.researchersHelped}+ researchers guided</p>
                        <p className="text-xs leading-relaxed mb-3 line-clamp-3" style={{ color: "#4B5563" }}>{f.bio}</p>
                        <a
                          href="/about"
                          className="inline-flex items-center gap-1 text-xs font-semibold"
                          style={{ color: "#2563EB" }}
                        >
                          Full profile & credentials →
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* FAQ */}
            <section>
              <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#2563EB" }}>
                Common Questions
              </p>
              <h2
                className="text-2xl font-bold mb-6"
                style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
              >
                Frequently Asked Questions
              </h2>
              <ClinicFAQ items={clinic.faq} />
            </section>

            {/* Pricing summary */}
            <section>
              <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#2563EB" }}>
                Investment
              </p>
              <h2
                className="text-2xl font-bold mb-6"
                style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
              >
                Pricing
              </h2>
              <div
                className="rounded-2xl border p-6"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
              >
                {/* Early bird strip — only shown while deadline is active */}
                {isEarlyBird && (
                  <div
                    className="flex items-center gap-2 rounded-xl px-4 py-2.5 mb-5 border"
                    style={{ backgroundColor: "rgba(252,211,77,0.05)", borderColor: "rgba(252,211,77,0.2)" }}
                  >
                    <Zap className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#FCD34D" }} />
                    <span className="text-xs font-semibold" style={{ color: "#FCD34D" }}>
                      Early bird closes in:
                    </span>
                    <EarlyBirdCountdown deadline={clinic.pricing.earlyBirdDeadline} />
                  </div>
                )}

                {/* Three bundles at a glance */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                  {clinic.pricing.bundles.map((bundle) => {
                    const ACCENTS: Record<string, string> = { solo: "#10B981", core: "#2563EB", pro: "#8B5CF6" };
                    const accent = ACCENTS[bundle.id] ?? "#2563EB";
                    return (
                      <div
                        key={bundle.id}
                        className="rounded-xl border p-4"
                        style={{
                          backgroundColor: "#FFFFFF",
                          borderColor: bundle.recommended ? `${accent}50` : "#1E293B",
                        }}
                      >
                        {bundle.recommended && (
                          <span
                            className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full mb-2 inline-block"
                            style={{ backgroundColor: `${accent}20`, color: accent }}
                          >
                            Most popular
                          </span>
                        )}
                        <p className="text-xs font-semibold mb-0.5" style={{ color: accent }}>{bundle.name}</p>
                        <p className="text-lg font-bold" style={{ color: "#111827" }}>
                          {formatNgn(usdToNgn(isEarlyBird ? bundle.usd.earlyBird : bundle.usd.regular, rate))}
                        </p>
                        <p className="text-xs" style={{ color: "#4B5563" }}>
                          ${isEarlyBird ? bundle.usd.earlyBird : bundle.usd.regular} USD{isEarlyBird ? " · early bird" : ""}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <Link
                  href="/clinics#pricing"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-[#1D4ED8]"
                  style={{ color: "#2563EB" }}
                >
                  See all bundles &amp; group pricing <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </section>

            {/* Private Consulting bridge */}
            <div
              className="rounded-2xl border overflow-hidden"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
            >
              <div className="h-0.5" style={{ background: "linear-gradient(90deg, #8B5CF6, #A78BFA)" }} />
              <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase mb-1.5" style={{ color: "#8B5CF6" }}>
                    Prefer 1-on-1?
                  </p>
                  <p className="text-base font-bold mb-1.5" style={{ color: "#111827" }}>
                    Private Consulting — Built Around You
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "#4B5563" }}>
                    Same expertise, applied exclusively to your profile. Written audit, optimised accounts,
                    and a live debrief call — no cohort schedule. Start anytime. From{" "}
                    <strong style={{ color: "#A78BFA" }}>$209 / {formatNgn(usdToNgn(209, rate))}</strong>.
                  </p>
                </div>
                <Link
                  href="/clinics/private-consulting"
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-all hover:opacity-90"
                  style={{ backgroundColor: "#8B5CF6", color: "#fff" }}
                >
                  View Private Consulting
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* From Our Research */}
            <section>
              <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#2563EB" }}>
                From Our Research
              </p>
              <h2
                className="text-2xl font-bold mb-6"
                style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
              >
                Read Before You Decide
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    href:    "/insights/understanding-research-visibility",
                    label:   "Scholarly Visibility",
                    title:   "Why Most Researchers Are Invisible",
                    excerpt: "The structural reasons your work isn't reaching the people who should cite it — and the systematic approach to fixing it.",
                  },
                  {
                    href:    "/insights/google-scholar-profile-optimisation",
                    label:   "Profile Optimisation",
                    title:   "Google Scholar: The Complete Guide",
                    excerpt: "Every element of your Google Scholar profile and how to get each one right, from photo to research interests to publication management.",
                  },
                  {
                    href:    "/insights/orcid-and-scholarly-identity",
                    label:   "Scholarly Identity",
                    title:   "ORCID and Your Permanent Research Identity",
                    excerpt: "How to build and maintain the identifier that anchors your entire scholarly output across every database and institution.",
                  },
                  {
                    href:    "/insights/how-to-grow-your-h-index",
                    label:   "Research Metrics",
                    title:   "How to Grow Your h-index Legitimately",
                    excerpt: "Proven, ethical strategies to systematically improve your h-index through better visibility — without gaming the system.",
                  },
                ].map(({ href, label, title, excerpt }) => (
                  <Link
                    key={href}
                    href={href}
                    className="group rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
                  >
                    <span
                      className="inline-block text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full mb-3"
                      style={{ backgroundColor: "rgba(37,99,235,0.08)", color: "#2563EB" }}
                    >
                      {label}
                    </span>
                    <p
                      className="text-sm font-bold mb-1.5 group-hover:text-[#2563EB] transition-colors"
                      style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
                    >
                      {title}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: "#4B5563" }}>
                      {excerpt}
                    </p>
                  </Link>
                ))}
              </div>
              <Link
                href="/insights"
                className="inline-flex items-center gap-1.5 text-sm font-semibold mt-5 transition-colors hover:text-[#1D4ED8]"
                style={{ color: "#2563EB" }}
              >
                Browse all 25 articles <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </section>

          </div>

          {/* Sticky enquiry sidebar — desktop only */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <EnquiryCard
                clinicName={clinic.name}
                duration={clinic.duration}
                format={clinic.format}
                capacity={clinic.capacity}
                earlyBirdFrom={earlyBirdLabel}
              />
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
