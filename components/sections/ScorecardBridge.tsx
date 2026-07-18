"use client";

import Link from "next/link";
import { BarChart2, ArrowRight } from "lucide-react";
import { trackCtaClick } from "@/lib/analytics/posthog";

const VALUE_LADDER = [
  { step: "1", label: "Visibility Scorecard", sub: "Free · 5 min", color: "#10B981", href: "/resources/visibility-scorecard" },
  { step: "2", label: "Digital Visibility Clinic", sub: "Live cohort · from $79", color: "#2563EB", href: "/clinics" },
  { step: "3", label: "Private Consulting", sub: "1-on-1 · from $209", color: "#8B5CF6", href: "/clinics/private-consulting" },
];

export function ScorecardBridge() {
  return (
    <div className="px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="mx-auto max-w-6xl pb-8 sm:pb-12">

        {/* Value Ladder — Item 17: surface the journey early */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0">
          {VALUE_LADDER.map(({ step, label, sub, color, href }, i) => (
            <span key={step} className="flex items-center gap-2 sm:gap-3">
              <Link href={href} className="flex items-center gap-2.5 group">
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: `${color}18`, color, border: `1px solid ${color}30` }}
                >
                  {step}
                </span>
                <div className="text-left">
                  <p className="text-xs font-semibold leading-none" style={{ color: "#111827" }}>{label}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "#9CA3AF" }}>{sub}</p>
                </div>
              </Link>
              {i < VALUE_LADDER.length - 1 && (
                <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 hidden sm:block" style={{ color: "#CBD5E1" }} />
              )}
            </span>
          ))}
        </div>

        <Link
          href="/resources/visibility-scorecard"
          className="group flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8 rounded-2xl border p-5 sm:p-6 transition-all duration-200 hover:border-[#10B981]/50"
          onClick={() => trackCtaClick("Check My Score, Free", "scorecard-bridge", "/resources/visibility-scorecard")}
          style={{
            backgroundColor: "rgba(16,185,129,0.04)",
            borderColor:     "rgba(16,185,129,0.22)",
          }}
        >
          {/* Icon */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background:  "linear-gradient(135deg, rgba(16,185,129,0.25), rgba(16,185,129,0.08))",
              border:      "1px solid rgba(16,185,129,0.3)",
            }}
          >
            <BarChart2 className="h-5 w-5" style={{ color: "#10B981" }} />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold mb-1" style={{ color: "#111827" }}>
              Not sure how bad your visibility gap actually is?
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
              The free Visibility Scorecard gives you a score out of 100 in 4 minutes, showing
              exactly what each gap is costing your citations, h-index, and career.
            </p>
          </div>

          {/* CTA */}
          <span
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold whitespace-nowrap flex-shrink-0 transition-transform group-hover:translate-x-0.5"
            style={{ backgroundColor: "#10B981", color: "#fff" }}
          >
            Check My Score, Free
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </div>
    </div>
  );
}
