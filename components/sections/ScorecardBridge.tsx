import Link from "next/link";
import { BarChart2, ArrowRight } from "lucide-react";

export function ScorecardBridge() {
  return (
    <div className="px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#080E1A" }}>
      <div className="mx-auto max-w-6xl pb-8 sm:pb-12">
        <Link
          href="/resources/visibility-scorecard"
          className="group flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8 rounded-2xl border p-5 sm:p-6 transition-all duration-200 hover:border-[#10B981]/50"
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
            <p className="text-sm font-bold mb-1" style={{ color: "#F9FAFB" }}>
              Not sure how bad your visibility gap actually is?
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
              The free Visibility Scorecard gives you a score out of 100 in 4 minutes — and shows
              exactly what each gap is costing your citations, h-index, and career.
            </p>
          </div>

          {/* CTA */}
          <span
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold whitespace-nowrap flex-shrink-0 transition-transform group-hover:translate-x-0.5"
            style={{ backgroundColor: "#10B981", color: "#fff" }}
          >
            Check My Score — Free
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </div>
    </div>
  );
}
