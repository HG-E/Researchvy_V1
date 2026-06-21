import Link from "next/link";
import { ArrowRight, MessageCircle, CheckCircle, User, ArrowLeft, Clock, Zap, Star } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildWhatsAppUrl } from "@/config/site";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { siteConfig } from "@/config/site";

export const metadata = generatePageMetadata({
  title: "Private Consulting — Researchvy",
  description:
    "Bespoke 1-on-1 research visibility consulting. ORCID optimisation, Google Scholar audit, dissemination strategy, citation growth, and personal research brand — built around your specific gaps, not a cohort curriculum.",
  path: "/clinics/private-consulting",
});

const PACKAGES = [
  {
    id:       "starter",
    name:     "Visibility Starter",
    tagline:  "Fix the foundations",
    usd:      209,
    ngn:      205_000,
    color:    "#10B981",
    recommended: false,
    deliverables: [
      "ORCID profile audit, disambiguation & full optimisation",
      "Google Scholar profile verification, missing-work reclaim & metadata fix",
      "Research identity review across Scopus, ResearchGate & Academia.edu",
      "Written gap report with prioritised action list",
      "30-min debrief call — walk through findings together",
    ],
    whatsappContext: "Visibility Starter private consulting — $209 / ₦205,000",
    cta: "Start with Starter",
    ideal: "Best for researchers who need their core discovery profiles fixed fast.",
  },
  {
    id:       "growth",
    name:     "Visibility Growth",
    tagline:  "Build the system",
    usd:      309,
    ngn:      305_000,
    color:    "#2563EB",
    recommended: true,
    deliverables: [
      "Everything in Visibility Starter",
      "Research dissemination strategy — how to distribute each paper for maximum reach",
      "Collaboration positioning — identifying and mapping your collaboration network gaps",
      "Platform-by-platform reach plan (Mendeley, SSRN, preprints, open-access repos)",
      "60-min strategy call — implementation roadmap, questions, priorities",
    ],
    whatsappContext: "Visibility Growth private consulting — $309 / ₦305,000",
    cta: "Start with Growth",
    ideal: "Best for researchers publishing consistently but not reaching outside their immediate circle.",
  },
  {
    id:       "authority",
    name:     "Visibility Authority",
    tagline:  "Lead your field",
    usd:      509,
    ngn:      505_000,
    color:    "#8B5CF6",
    recommended: false,
    deliverables: [
      "Everything in Visibility Growth",
      "Personal research brand development — your niche, narrative, and positioning",
      "Thought leadership plan — articles, speaking, media opportunities mapped to your research",
      "Citation growth roadmap — strategic, ethical citation-building over 12 months",
      "Ongoing advisory — one monthly 30-min check-in call for 3 months after delivery",
    ],
    whatsappContext: "Visibility Authority private consulting — $509 / ₦505,000",
    cta: "Start with Authority",
    ideal: "Best for researchers aiming for global recognition, keynote invitations, and career-defining impact.",
  },
];

const HOW_DIFFERENT = [
  {
    label: "Cohort Clinic",
    href:  "/clinics",
    color: "#10B981",
    points: [
      "Up to 20 researchers per cohort",
      "Fixed 5-session live curriculum",
      "Group discussions and shared learning",
      "Scheduled start dates — join the next cohort",
      "₦85,000 – ₦130,000",
    ],
    cta: "View the Clinic",
  },
  {
    label: "Private Consulting",
    href:  "/clinics/private-consulting",
    color: "#8B5CF6",
    points: [
      "1-on-1 — only you, only your gaps",
      "Bespoke to your profile, field, and career stage",
      "Deliverables-based — you receive a written strategy, not just sessions",
      "Start anytime — no cohort schedule to join",
      "₦205,000 – ₦505,000",
    ],
    cta: "View Consulting",
    current: true,
  },
];

const PROCESS_STEPS = [
  {
    step:  "01",
    title: "You reach out via WhatsApp",
    desc:  "Tell us your career stage, field, and which package interests you. We confirm availability and answer any questions.",
    color: "#10B981",
  },
  {
    step:  "02",
    title: "We audit your current profiles",
    desc:  "You share your ORCID, Google Scholar, Scopus, and any other active platforms. We conduct a full independent audit before we speak.",
    color: "#2563EB",
  },
  {
    step:  "03",
    title: "You receive your deliverables",
    desc:  "Within 5 working days: a written gap report, optimised profiles (we make the changes for you), and your strategy document.",
    color: "#8B5CF6",
  },
  {
    step:  "04",
    title: "Debrief call — walk through everything",
    desc:  "We review the findings, explain every decision, and answer your questions. You leave knowing exactly what changed and why.",
    color: "#A78BFA",
  },
];

const OBJECTIONS = [
  {
    q: "How is this different from just getting advice on a call?",
    a: "We do the work, not just explain it. By the time we meet on the debrief call, your ORCID is already optimised, your missing publications are already reclaimed, and your strategy is already written. You're not paying for a consultation — you're paying for a done-for-you deliverable.",
  },
  {
    q: "Can I upgrade from Starter to Growth later?",
    a: "Yes. If you start with Starter and want to add Growth work afterwards, you pay the difference — not the full Growth price. We carry forward everything we've already done.",
  },
  {
    q: "How long does it take from payment to delivery?",
    a: "Typically 5–7 working days from the date we receive your profile details. We'll confirm the exact timeline when you reach out.",
  },
  {
    q: "I'm in the middle of submitting papers — is now a good time?",
    a: "Yes, especially for the Starter package. Getting your ORCID and Google Scholar optimised before a paper publishes means it gets attributed correctly from day one, not after months of chasing corrections.",
  },
];

export default function PrivateConsultingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080E1A" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home",               url: siteConfig.url },
              { name: "Clinics",            url: `${siteConfig.url}/clinics` },
              { name: "Private Consulting", url: `${siteConfig.url}/clinics/private-consulting` },
            ])
          ),
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

        {/* Back */}
        <Link
          href="/clinics"
          className="inline-flex items-center gap-1.5 text-sm mb-10 transition-colors"
          style={{ color: "#4B5563" }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All Clinics
        </Link>

        {/* Hero */}
        <div className="max-w-3xl mb-16">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold mb-5"
            style={{ backgroundColor: "rgba(139,92,246,0.1)", color: "#A78BFA", border: "1px solid rgba(139,92,246,0.2)" }}
          >
            <User className="h-3.5 w-3.5" />
            Private Consulting
          </span>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-[1.1]"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB", letterSpacing: "-0.02em" }}
          >
            Your Gaps. Your Profile.<br />
            <span style={{ color: "#8B5CF6" }}>Done For You.</span>
          </h1>
          <p className="text-base sm:text-lg leading-relaxed mb-6" style={{ color: "#6B7280" }}>
            One-on-one consulting built around your specific research identity — not a cohort curriculum.
            We audit your profiles, fix what&apos;s broken, build your strategy, and hand you the deliverables.
            You leave with a fully optimised scholarly presence, not homework.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={buildWhatsAppUrl("Researchvy private consulting — enquiry")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white"
              style={{ backgroundColor: "#8B5CF6" }}
            >
              <MessageCircle className="h-4 w-4" />
              Enquire via WhatsApp
            </a>
            <a
              href="#packages"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold border transition-colors"
              style={{ borderColor: "#1E293B", color: "#9CA3AF" }}
            >
              See Packages <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Clinic vs Private Consulting — two-track comparison */}
        <div className="mb-20">
          <p className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: "#4B5563" }}>
            Which track is right for you?
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {HOW_DIFFERENT.map((track) => (
              <div
                key={track.label}
                className="rounded-2xl border overflow-hidden flex flex-col"
                style={{
                  backgroundColor: "#0F172A",
                  borderColor: track.current ? `${track.color}50` : "#1E293B",
                  boxShadow: track.current ? `0 0 0 1px ${track.color}30` : "none",
                }}
              >
                <div className="h-1" style={{ backgroundColor: track.color }} />
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-5">
                    <p className="text-base font-bold" style={{ color: "#F9FAFB" }}>{track.label}</p>
                    {track.current && (
                      <span
                        className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: `${track.color}20`, color: track.color, border: `1px solid ${track.color}40` }}
                      >
                        You&apos;re here
                      </span>
                    )}
                  </div>
                  <ul className="space-y-2.5 flex-1 mb-6">
                    {track.points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-sm" style={{ color: "#9CA3AF" }}>
                        <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: track.color }} />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={track.href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
                    style={{ color: track.color }}
                  >
                    {track.cta} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Packages */}
        <div className="mb-20" id="packages">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#8B5CF6" }}>
              Private Consulting Packages
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
            >
              Choose Your Level
            </h2>
            <p className="text-sm max-w-xl mx-auto" style={{ color: "#6B7280" }}>
              All packages are delivered as written documents + a live debrief call.
              Prices in USD and NGN. Start anytime — no cohort schedule.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className="rounded-2xl border overflow-hidden flex flex-col"
                style={{
                  backgroundColor: "#0F172A",
                  borderColor: pkg.recommended ? `${pkg.color}60` : "#1E293B",
                  boxShadow: pkg.recommended ? `0 0 0 1px ${pkg.color}40` : "none",
                }}
              >
                <div className="h-1" style={{ backgroundColor: pkg.color }} />
                <div className="p-7 flex flex-col flex-1">

                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div>
                      <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: pkg.color }}>
                        {pkg.tagline}
                      </p>
                      <h3 className="text-xl font-bold" style={{ color: "#F9FAFB" }}>
                        {pkg.name}
                      </h3>
                    </div>
                    {pkg.recommended && (
                      <span
                        className="flex-shrink-0 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full whitespace-nowrap flex items-center gap-1"
                        style={{ backgroundColor: `${pkg.color}20`, color: pkg.color, border: `1px solid ${pkg.color}40` }}
                      >
                        <Star className="h-2.5 w-2.5" />
                        Most Popular
                      </span>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: "#1E293B" }}>
                    <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: "#4B5563" }}>
                      One-time investment
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold" style={{ color: "#F9FAFB" }}>
                        ${pkg.usd}
                      </span>
                      <span className="text-base font-semibold" style={{ color: "#6B7280" }}>USD</span>
                    </div>
                    <p className="text-sm font-semibold mt-0.5" style={{ color: pkg.color }}>
                      ₦{pkg.ngn.toLocaleString("en-NG")} NGN
                    </p>
                    <div className="pt-3 mt-3 border-t" style={{ borderColor: "#334155" }}>
                      <div className="flex items-center gap-1.5">
                        <Zap className="h-3 w-3" style={{ color: "#4B5563" }} />
                        <p className="text-xs" style={{ color: "#4B5563" }}>Delivered within 5–7 working days</p>
                      </div>
                    </div>
                  </div>

                  {/* Deliverables */}
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {pkg.deliverables.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs leading-relaxed">
                        <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" style={{ color: pkg.color }} />
                        <span style={{ color: "#D1D5DB" }}>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Ideal for */}
                  <p className="text-[11px] leading-relaxed mb-5" style={{ color: "#4B5563" }}>
                    {pkg.ideal}
                  </p>

                  {/* CTA */}
                  <a
                    href={buildWhatsAppUrl(pkg.whatsappContext)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold text-white"
                    style={{ backgroundColor: pkg.color }}
                  >
                    <MessageCircle className="h-4 w-4" />
                    {pkg.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#6B7280" }}>
              The Process
            </p>
            <h2
              className="text-3xl font-bold"
              style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
            >
              What Happens After You Reach Out
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PROCESS_STEPS.map(({ step, title, desc, color }) => (
              <div
                key={step}
                className="rounded-2xl border p-6"
                style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
              >
                <p
                  className="text-4xl font-black mb-4 tabular-nums"
                  style={{ color: `${color}25`, fontFamily: "var(--font-serif)" }}
                >
                  {step}
                </p>
                <p className="text-sm font-bold mb-2" style={{ color: "#F9FAFB" }}>{title}</p>
                <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>{desc}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-6 justify-center">
            <Clock className="h-3.5 w-3.5" style={{ color: "#4B5563" }} />
            <p className="text-xs" style={{ color: "#4B5563" }}>
              From WhatsApp message to debrief call: typically 7–10 working days.
            </p>
          </div>
        </div>

        {/* FAQ / Objections */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#6B7280" }}>
              Common questions
            </p>
            <h2
              className="text-3xl font-bold"
              style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
            >
              What You Need to Know
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {OBJECTIONS.map(({ q, a }) => (
              <div
                key={q}
                className="rounded-2xl border p-6"
                style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
              >
                <p className="text-sm font-bold mb-2" style={{ color: "#F9FAFB" }}>{q}</p>
                <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div
          className="rounded-3xl border p-8 sm:p-12 text-center relative overflow-hidden"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(139,92,246,0.08) 0%, transparent 80%)",
            }}
          />
          <div className="relative">
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#8B5CF6" }}>
              Ready to Start?
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4 leading-tight"
              style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
            >
              One conversation.<br />
              <span style={{ color: "#8B5CF6" }}>Everything changes.</span>
            </h2>
            <p className="text-base max-w-xl mx-auto mb-8 leading-relaxed" style={{ color: "#6B7280" }}>
              Send a WhatsApp message with your career stage, field, and the package you&apos;re interested in.
              We&apos;ll confirm availability and tell you exactly what to expect.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={buildWhatsAppUrl("Researchvy private consulting — ready to start")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-sm font-bold text-white"
                style={{ backgroundColor: "#8B5CF6" }}
              >
                <MessageCircle className="h-4 w-4" />
                Start via WhatsApp
              </a>
              <Link
                href="/clinics"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-sm font-semibold border transition-colors"
                style={{ borderColor: "#1E293B", color: "#9CA3AF" }}
              >
                View the Cohort Clinic Instead
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
