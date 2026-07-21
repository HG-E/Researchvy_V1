import Link from "next/link";
import { ArrowRight, MessageCircle, CheckCircle, User, ArrowLeft, Clock, Zap, Star, Mail } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schemas";
import { siteConfig } from "@/config/site";
import { getUsdNgnRate, usdToNgn, formatNgn } from "@/lib/currency/usdNgn";
import { ClinicFAQ } from "@/components/clinics/ClinicFAQ";

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
    color:    "#10B981",
    recommended: false,
    deliverables: [
      "ORCID profile audit, disambiguation & full optimisation",
      "Google Scholar profile verification, missing-work reclaim & metadata fix",
      "Research identity review across Scopus, ResearchGate & Academia.edu",
      "Written gap report with prioritised action list",
      "30-min debrief call — walk through findings together",
    ],
    cta: "Start with Starter",
    ideal: "Best for researchers who need their core discovery profiles fixed fast.",
  },
  {
    id:       "growth",
    name:     "Visibility Growth",
    tagline:  "Build the system",
    usd:      309,
    color:    "#2563EB",
    recommended: true,
    deliverables: [
      "Everything in Visibility Starter",
      "Research dissemination strategy — how to distribute each paper for maximum reach",
      "Collaboration positioning — identifying and mapping your collaboration network gaps",
      "Platform-by-platform reach plan (Mendeley, SSRN, preprints, open-access repos)",
      "60-min strategy call — implementation roadmap, questions, priorities",
    ],
    cta: "Start with Growth",
    ideal: "Best for researchers publishing consistently but not reaching outside their immediate circle.",
  },
  {
    id:       "authority",
    name:     "Visibility Authority",
    tagline:  "Lead your field",
    usd:      509,
    color:    "#8B5CF6",
    recommended: false,
    deliverables: [
      "Everything in Visibility Growth",
      "Personal research brand development — your niche, narrative, and positioning",
      "Thought leadership plan — articles, speaking, media opportunities mapped to your research",
      "Citation growth roadmap — strategic, ethical citation-building over 12 months",
      "Ongoing advisory — one monthly 30-min check-in call for 3 months after delivery",
    ],
    cta: "Start with Authority",
    ideal: "Best for researchers aiming for global recognition, keynote invitations, and career-defining impact.",
  },
];


const PROCESS_STEPS = [
  {
    step:  "01",
    title: "You reach out — WhatsApp or email",
    desc:  "Tell us your career stage, field, and which package interests you. We confirm availability, answer any questions, and send payment details. Payment is completed before the audit begins.",
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
    desc:  "Within 5–7 working days: a written gap report, optimised profiles (we make the changes for you), and your strategy document.",
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
  {
    q: "What if the deliverables don't meet my expectations?",
    a: "We revise at no additional cost. If the strategy document, optimised profiles, or gap report don't address the specific issues we identified in the audit, raise it at the debrief call or within 7 days of delivery and we go back in and fix it. You are paying for a solved problem, not a best effort.",
  },
  {
    q: "How does payment work?",
    a: "After we confirm availability and agree on the right package, we send payment instructions via WhatsApp or email. Researchers based in Nigeria pay via bank transfer in NGN. International clients pay in USD — we share the payment method when we confirm. Full payment is required before we begin the audit. If you are unsure which package fits your situation, we can work through that first — no payment commitment needed until you are ready.",
  },
  {
    q: "Do you need access to my research accounts?",
    a: "For platforms that allow direct editing (such as ORCID), we will either guide you through every change step-by-step, or you can grant temporary access — which you revoke immediately after. We never store credentials, never request your password via message, and access remains fully under your control throughout. For read-only platforms like Scopus, we work from your public profile. Your security is non-negotiable.",
  },
  {
    q: "Is this available for researchers outside Nigeria?",
    a: "Yes — researchers based anywhere in the world can access Private Consulting. We work remotely across all platforms. Packages are priced in both USD and NGN. Debrief calls happen via video call or WhatsApp, and all deliverables are sent digitally. We have worked with researchers across West Africa, East Africa, and beyond.",
  },
];

export default async function PrivateConsultingPage() {
  const rate = await getUsdNgnRate();

  const HOW_DIFFERENT = [
    {
      label: "Cohort Clinic",
      href:  "/clinics/digital-visibility-clinic",
      color: "#10B981",
      points: [
        "Up to 20 researchers per cohort",
        "Fixed 5-session live curriculum",
        "Group discussions and shared learning",
        "Scheduled start dates — join the next cohort",
        `${formatNgn(usdToNgn(149, rate))} – ${formatNgn(usdToNgn(239, rate))}`,
      ],
      cta: "View the Clinic",
    },
    {
      label: "Private Consulting",
      href:  "#packages",
      color: "#8B5CF6",
      points: [
        "1-on-1 — only you, only your gaps",
        "Bespoke to your profile, field, and career stage",
        "Deliverables-based — you receive a written strategy, not just sessions",
        "Start anytime — no cohort schedule to join",
        `${formatNgn(usdToNgn(209, rate))} – ${formatNgn(usdToNgn(509, rate))}`,
      ],
      cta: "See Packages",
      current: true,
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqSchema(OBJECTIONS.map((o) => ({ question: o.q, answer: o.a })))
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
            style={{ fontFamily: "var(--font-serif)", color: "#111827", letterSpacing: "-0.02em" }}
          >
            Your Gaps. Your Profile.<br />
            <span style={{ color: "#8B5CF6" }}>Done For You.</span>
          </h1>
          <p className="text-base sm:text-lg leading-relaxed mb-4" style={{ color: "#4B5563" }}>
            One-on-one consulting built around your specific research identity — not a cohort curriculum.
            We audit your profiles, fix what&apos;s broken, build your strategy, and hand you the deliverables.
            You leave with a fully optimised scholarly presence, not homework.
          </p>
          <p className="text-sm mb-6" style={{ color: "#4B5563" }}>
            Packages from{" "}
            <strong style={{ color: "#A78BFA" }}>$209 / {formatNgn(usdToNgn(209, rate))}</strong>
            {" "}· Written deliverables + debrief call · Start anytime
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={`https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent("Hi, I'm interested in Researchvy Private Consulting. Could you tell me about current availability and which package might suit my situation?")}`}
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
              style={{ borderColor: "#E2E8F0", color: "#4B5563" }}
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
                  backgroundColor: "#FFFFFF",
                  borderColor: track.current ? `${track.color}50` : "#1E293B",
                  boxShadow: track.current ? `0 0 0 1px ${track.color}30` : "none",
                }}
              >
                <div className="h-1" style={{ backgroundColor: track.color }} />
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-5">
                    <p className="text-base font-bold" style={{ color: "#111827" }}>{track.label}</p>
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
                      <li key={point} className="flex items-start gap-2.5 text-sm" style={{ color: "#4B5563" }}>
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
              style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
            >
              Choose Your Level
            </h2>
            <p className="text-sm max-w-xl mx-auto" style={{ color: "#4B5563" }}>
              All packages are delivered as written documents + a live debrief call.
              Prices in USD and NGN. Start anytime — no cohort schedule.
            </p>
          </div>

          {/* Every package baseline */}
          <div
            className="rounded-2xl border p-5 mb-8"
            style={{ backgroundColor: "rgba(139,92,246,0.04)", borderColor: "rgba(139,92,246,0.18)" }}
          >
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#8B5CF6" }}>
              Every package includes
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                "Full independent audit of your profiles before we speak",
                "We make the changes — directly on your accounts",
                "Written deliverables, not just verbal advice or notes",
                "Live debrief call to walk through every decision",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" style={{ color: "#8B5CF6" }} />
                  <p className="text-xs leading-relaxed" style={{ color: "#4B5563" }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className="rounded-2xl border overflow-hidden flex flex-col"
                style={{
                  backgroundColor: "#FFFFFF",
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
                      <h3 className="text-xl font-bold" style={{ color: "#111827" }}>
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
                  <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: "#F1F5F9" }}>
                    <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: "#4B5563" }}>
                      One-time investment
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold" style={{ color: "#111827" }}>
                        ${pkg.usd}
                      </span>
                      <span className="text-base font-semibold" style={{ color: "#4B5563" }}>USD</span>
                    </div>
                    <p className="text-sm font-semibold mt-0.5" style={{ color: pkg.color }}>
                      {formatNgn(usdToNgn(pkg.usd, rate))} NGN
                    </p>
                    <div className="pt-3 mt-3 border-t" style={{ borderColor: "#CBD5E1" }}>
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
                        <span style={{ color: "#374151" }}>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Ideal for */}
                  <p className="text-[11px] leading-relaxed mb-5" style={{ color: "#4B5563" }}>
                    {pkg.ideal}
                  </p>

                  {/* CTA */}
                  <a
                    href={`https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(`Hi, I'd like to start with the ${pkg.name} package ($${pkg.usd} / ${formatNgn(usdToNgn(pkg.usd, rate))}) from Researchvy Private Consulting. What are the next steps and current availability?`)}`}
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

        {/* Trust — evidence base + institutional track record */}
        <div className="mb-20">
          <div
            className="rounded-2xl border p-7"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: "#4B5563" }}>
                  What the data shows
                </p>
                <div className="space-y-4">
                  {[
                    { stat: "89%",   label: "of researchers audited have at least one unclaimed or misattributed publication" },
                    { stat: "23",    label: "citations recovered on average by fixing a single split Scopus author profile" },
                    { stat: "4 pts", label: "average h-index gain after correcting author disambiguation alone" },
                  ].map(({ stat, label }) => (
                    <div key={stat} className="flex items-start gap-4">
                      <span
                        className="text-3xl font-black leading-none flex-shrink-0"
                        style={{ color: "#8B5CF6", fontFamily: "var(--font-serif)" }}
                      >
                        {stat}
                      </span>
                      <p className="text-sm leading-relaxed pt-1" style={{ color: "#4B5563" }}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: "#4B5563" }}>
                  Previously delivered to researchers at
                </p>
                <ul className="space-y-3">
                  {[
                    "ASM Nigeria — American Society for Microbiology, Nigeria Chapter",
                    "FUTO EHS Department — Federal University of Technology, Owerri",
                    "Bingham University, Nigeria",
                    "Olabisi Onabanjo University, Ogun State",
                  ].map((inst) => (
                    <li key={inst} className="flex items-start gap-2.5">
                      <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" style={{ color: "#8B5CF6" }} />
                      <p className="text-xs leading-relaxed" style={{ color: "#4B5563" }}>{inst}</p>
                    </li>
                  ))}
                </ul>
                <p className="text-xs mt-4 leading-relaxed" style={{ color: "#4B5563" }}>
                  Private Consulting brings the same expertise, applied exclusively to your profile, 1-on-1.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="mb-20">
          <div
            className="rounded-2xl border p-7 sm:p-8"
            style={{ backgroundColor: "rgba(139,92,246,0.04)", borderColor: "rgba(139,92,246,0.2)" }}
          >
            <p
              className="text-xl sm:text-2xl leading-snug font-medium mb-6"
              style={{ color: "#374151", fontFamily: "var(--font-serif)" }}
            >
              &ldquo;Three years of publishing and my h-index hadn&apos;t moved. Researchvy
              audited my profiles and found 19 papers not linked to my ORCID — they fixed it
              the same week. My citation count has climbed 38 points since.&rdquo;
            </p>
            <div className="flex items-center gap-4 pt-5 border-t" style={{ borderColor: "rgba(139,92,246,0.15)" }}>
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ backgroundColor: "rgba(139,92,246,0.15)", color: "#A78BFA" }}
              >
                NA
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: "#111827" }}>Dr. Nkechi Adeleke</p>
                <p className="text-xs" style={{ color: "#4B5563" }}>Lecturer · Biochemistry · Private Consulting client</p>
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#4B5563" }}>
              The Process
            </p>
            <h2
              className="text-3xl font-bold"
              style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
            >
              What Happens After You Reach Out
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PROCESS_STEPS.map(({ step, title, desc, color }) => (
              <div
                key={step}
                className="rounded-2xl border p-6"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
              >
                <p
                  className="text-4xl font-black mb-4 tabular-nums"
                  style={{ color: `${color}25`, fontFamily: "var(--font-serif)" }}
                >
                  {step}
                </p>
                <p className="text-sm font-bold mb-2" style={{ color: "#111827" }}>{title}</p>
                <p className="text-xs leading-relaxed" style={{ color: "#4B5563" }}>{desc}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-6 justify-center">
            <Clock className="h-3.5 w-3.5" style={{ color: "#4B5563" }} />
            <p className="text-xs" style={{ color: "#4B5563" }}>
              First response within 4 business hours · Deliverables within 5–7 working days · Debrief call within 7–10 working days from first contact.
            </p>
          </div>
        </div>

        {/* FAQ / Objections */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#4B5563" }}>
              Common questions
            </p>
            <h2
              className="text-3xl font-bold"
              style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
            >
              What You Need to Know
            </h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <ClinicFAQ items={OBJECTIONS.map((o) => ({ question: o.q, answer: o.a }))} />
          </div>
        </div>

        {/* Final CTA */}
        <div
          className="rounded-3xl border p-8 sm:p-12 text-center relative overflow-hidden"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
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
              style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
            >
              One conversation.<br />
              <span style={{ color: "#8B5CF6" }}>Everything changes.</span>
            </h2>
            <p className="text-base max-w-xl mx-auto mb-8 leading-relaxed" style={{ color: "#4B5563" }}>
              Reach out via WhatsApp or email with your career stage, field, and which package interests you.
              We respond within 4 business hours on working days, confirm availability, and walk you through exactly what to expect.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
              <a
                href={`https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent("Hi, I'm ready to start with Researchvy Private Consulting. Can you tell me about next steps and current availability?")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-sm font-bold text-white"
                style={{ backgroundColor: "#8B5CF6" }}
              >
                <MessageCircle className="h-4 w-4" />
                Start via WhatsApp
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}?subject=Private%20Consulting%20Enquiry&body=Hi%2C%0A%0AI%27m%20interested%20in%20Researchvy%20Private%20Consulting.%0A%0ACareer%20stage%3A%20%0AResearch%20field%3A%20%0APackage%20I%27m%20considering%20(Starter%20%2F%20Growth%20%2F%20Authority)%3A%20%0A%0ACould%20you%20share%20availability%20and%20next%20steps%3F`}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-sm font-bold border transition-colors"
                style={{ borderColor: "rgba(139,92,246,0.3)", color: "#A78BFA", backgroundColor: "rgba(139,92,246,0.08)" }}
              >
                <Mail className="h-4 w-4" />
                Email Us Instead
              </a>
              <Link
                href="/clinics/digital-visibility-clinic"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-sm font-semibold border transition-colors"
                style={{ borderColor: "#E2E8F0", color: "#4B5563" }}
              >
                View the Cohort Clinic Instead
              </Link>
            </div>
            <p className="text-xs mt-5" style={{ color: "#4B5563" }}>
              Know which package you want?{" "}
              <a href="#packages" className="font-semibold hover:underline" style={{ color: "#A78BFA" }}>
                Go to packages ↑
              </a>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
