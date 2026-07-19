"use client";

import Link from "next/link";
import { BarChart2, Users, UserCheck, ArrowRight, ChevronRight, CheckCircle2 } from "lucide-react";
import { trackCtaClick } from "@/lib/analytics/posthog";

const STEPS = [
  {
    step:    "01",
    icon:    BarChart2,
    label:   "Visibility Scorecard",
    badge:   "Start here",
    price:   "Free · 5 min",
    color:   "#10B981",
    bg:      "rgba(16,185,129,0.06)",
    border:  "rgba(16,185,129,0.2)",
    badgeBg: "rgba(16,185,129,0.12)",
    href:    "/resources/visibility-scorecard",
    cta:     "Get My Score",
    bullets: [
      "Score out of 100 in ~5 min",
      "Identifies exactly where you're losing citations",
      "Instant personalised action plan",
    ],
  },
  {
    step:    "02",
    icon:    Users,
    label:   "Digital Visibility Clinic",
    badge:   "Most popular",
    price:   "Live cohort · from $79",
    color:   "#2563EB",
    bg:      "rgba(37,99,235,0.06)",
    border:  "rgba(37,99,235,0.2)",
    badgeBg: "rgba(37,99,235,0.12)",
    href:    "/clinics",
    cta:     "Join the Clinic",
    bullets: [
      "≤20 researchers per live cohort",
      "5 hands-on sessions with expert guidance",
      "Certificate of completion",
    ],
  },
  {
    step:    "03",
    icon:    UserCheck,
    label:   "Private Consulting",
    badge:   "Fastest results",
    price:   "1-on-1 · from $209",
    color:   "#7C3AED",
    bg:      "rgba(124,58,237,0.06)",
    border:  "rgba(124,58,237,0.2)",
    badgeBg: "rgba(124,58,237,0.12)",
    href:    "/clinics/private-consulting",
    cta:     "Book a Session",
    bullets: [
      "Dedicated strategy tailored to your work",
      "Direct access to senior consultant",
      "Priority scheduling & follow-up",
    ],
  },
];

export function ScorecardBridge() {
  return (
    <section
      className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20"
      style={{ backgroundColor: "#F8FAFC" }}
    >
      <div className="mx-auto max-w-6xl">

        {/* Section header */}
        <div className="text-center mb-12">
          <p
            className="text-xs font-bold tracking-[0.2em] uppercase mb-3"
            style={{ color: "#2563EB" }}
          >
            Your visibility journey
          </p>
          <h2
            className="text-2xl sm:text-3xl font-bold mb-3"
            style={{ fontFamily: "var(--font-serif)", color: "#0B1B3E" }}
          >
            Three steps to research that gets found
          </h2>
          <p className="text-sm sm:text-base max-w-xl mx-auto" style={{ color: "#6B7280" }}>
            Start free, go deeper at your own pace. Each step builds on the last.
          </p>
        </div>

        {/* Step cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {STEPS.map(({ step, icon: Icon, label, badge, price, color, bg, border, badgeBg, href, cta, bullets }, i) => (
            <div key={step} className="relative flex flex-col">

              {/* Connector arrow — hidden on last card and on mobile */}
              {i < STEPS.length - 1 && (
                <ChevronRight
                  className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-6 w-6"
                  style={{ color: "#CBD5E1" }}
                />
              )}

              <div
                className="flex flex-col h-full rounded-2xl border p-6 transition-shadow hover:shadow-md"
                style={{ backgroundColor: bg, borderColor: border }}
              >
                {/* Top row: step number + badge */}
                <div className="flex items-center justify-between mb-5">
                  <span
                    className="text-[11px] font-black tracking-widest"
                    style={{ color }}
                  >
                    STEP {step}
                  </span>
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: badgeBg, color }}
                  >
                    {badge}
                  </span>
                </div>

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${color}25, ${color}0a)`,
                    border:     `1px solid ${color}30`,
                  }}
                >
                  <Icon className="h-6 w-6" style={{ color }} />
                </div>

                {/* Title */}
                <h3
                  className="text-base font-bold mb-1 leading-snug"
                  style={{ color: "#0B1B3E" }}
                >
                  {label}
                </h3>

                {/* Price / meta */}
                <p
                  className="text-xs font-semibold mb-4"
                  style={{ color }}
                >
                  {price}
                </p>

                {/* Bullet points */}
                <ul className="space-y-2 mb-6 flex-1">
                  {bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <CheckCircle2
                        className="h-3.5 w-3.5 flex-shrink-0 mt-0.5"
                        style={{ color }}
                      />
                      <span className="text-xs leading-snug" style={{ color: "#374151" }}>
                        {b}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA button */}
                <Link
                  href={href}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
                  style={{ backgroundColor: color }}
                  onClick={() => trackCtaClick(cta, "scorecard-bridge", href)}
                >
                  {cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <Link
          href="/resources/visibility-scorecard"
          className="group flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8 rounded-2xl border p-5 sm:p-6 transition-all duration-200 hover:border-[#10B981]/50"
          onClick={() => trackCtaClick("Check My Score, Free", "scorecard-bridge", "/resources/visibility-scorecard")}
          style={{
            backgroundColor: "rgba(16,185,129,0.04)",
            borderColor:     "rgba(16,185,129,0.22)",
          }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, rgba(16,185,129,0.25), rgba(16,185,129,0.08))",
              border:     "1px solid rgba(16,185,129,0.3)",
            }}
          >
            <BarChart2 className="h-5 w-5" style={{ color: "#10B981" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold mb-1" style={{ color: "#111827" }}>
              Not sure how bad your visibility gap actually is?
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
              The free Visibility Scorecard gives you a score out of 100 in 4 minutes, showing
              exactly what each gap is costing your citations, h-index, and career.
            </p>
          </div>
          <span
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold whitespace-nowrap flex-shrink-0 transition-transform group-hover:translate-x-0.5"
            style={{ backgroundColor: "#10B981", color: "#fff" }}
          >
            Check My Score, Free
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>

      </div>
    </section>
  );
}
