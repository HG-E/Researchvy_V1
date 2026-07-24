import Link from "next/link";
import { ArrowRight, TrendingUp, CheckCircle } from "lucide-react";

const BEFORE = {
  total: 48,
  tier: "Significant Gaps",
  tierColor: "#F59E0B",
  dimensions: [
    { label: "Scholar Identity",  score: 9,  max: 25 },
    { label: "Discoverability",   score: 11, max: 25 },
    { label: "Citation Health",   score: 14, max: 25 },
    { label: "Communication",     score: 14, max: 25 },
  ],
};

const AFTER = {
  total: 82,
  tier: "Emerging Leader",
  tierColor: "#10B981",
  dimensions: [
    { label: "Scholar Identity",  score: 23, max: 25 },
    { label: "Discoverability",   score: 22, max: 25 },
    { label: "Citation Health",   score: 21, max: 25 },
    { label: "Communication",     score: 16, max: 25 },
  ],
};

function ScoreCard({
  label,
  data,
  accent,
}: {
  label: "Before Training" | "After Training";
  data: typeof BEFORE;
  accent: string;
}) {
  const isBefore = label === "Before Training";
  return (
    <div
      className="flex-1 rounded-2xl border overflow-hidden"
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: isBefore ? "#E2E8F0" : accent + "40",
        boxShadow: isBefore ? "none" : `0 0 0 1px ${accent}25, 0 4px 24px ${accent}10`,
      }}
    >
      <div className="h-1" style={{ background: isBefore ? "#E2E8F0" : `linear-gradient(90deg, ${accent}, ${accent}99)` }} />
      <div className="p-6">
        <p
          className="text-[10px] font-bold tracking-widest uppercase mb-4"
          style={{ color: isBefore ? "#9CA3AF" : accent }}
        >
          {label}
        </p>

        {/* Score ring area */}
        <div className="flex items-end gap-1 mb-1">
          <span
            className="text-5xl font-bold tabular-nums leading-none"
            style={{ fontFamily: "var(--font-serif)", color: isBefore ? "#4B5563" : "#111827" }}
          >
            {data.total}
          </span>
          <span className="text-lg font-semibold mb-1" style={{ color: "#9CA3AF" }}>/100</span>
        </div>

        <span
          className="inline-block text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full mb-5"
          style={{ backgroundColor: data.tierColor + "18", color: data.tierColor }}
        >
          {data.tier}
        </span>

        {/* Dimension bars */}
        <div className="space-y-3">
          {data.dimensions.map((d) => {
            const pct = Math.round((d.score / d.max) * 100);
            return (
              <div key={d.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-[11px]" style={{ color: "#4B5563" }}>{d.label}</span>
                  <span className="text-[11px] font-semibold tabular-nums" style={{ color: isBefore ? "#6B7280" : "#111827" }}>
                    {d.score}/{d.max}
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#F1F5F9" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: isBefore ? "#CBD5E1" : accent }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function VisibilityJourneySection() {
  const gain = AFTER.total - BEFORE.total;

  return (
    <section>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#10B981" }}>
            Free with Every Core &amp; Pro Enrollment
          </p>
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
          >
            Your Visibility, Measured Before and After
          </h2>
        </div>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold border"
          style={{ backgroundColor: "rgba(16,185,129,0.06)", borderColor: "rgba(16,185,129,0.25)", color: "#10B981" }}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          No university in Nigeria offers this
        </span>
      </div>

      <p className="text-sm leading-relaxed mb-8 max-w-2xl" style={{ color: "#4B5563" }}>
        Before the clinic starts, you take the free 12-point Researcher Visibility Scorecard — your baseline.
        After the clinic ends, you take it again. You see exactly how much you improved, in numbers.
        Individuals and departments love measurable outcomes. Now you have one.
      </p>

      {/* Before / After cards */}
      <div className="flex flex-col sm:flex-row items-stretch gap-4 mb-6">
        <ScoreCard label="Before Training" data={BEFORE} accent="#10B981" />

        {/* Arrow + delta */}
        <div className="flex sm:flex-col items-center justify-center gap-2 py-4 sm:py-0 sm:px-2 flex-shrink-0">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full border-2"
            style={{ borderColor: "#10B981", backgroundColor: "rgba(16,185,129,0.08)" }}
          >
            <ArrowRight className="h-5 w-5" style={{ color: "#10B981" }} />
          </div>
          <div className="text-center">
            <p className="text-lg font-bold tabular-nums leading-none" style={{ color: "#10B981" }}>+{gain}</p>
            <p className="text-[10px] font-semibold" style={{ color: "#9CA3AF" }}>points</p>
          </div>
        </div>

        <ScoreCard label="After Training" data={AFTER} accent="#10B981" />
      </div>

      {/* What they get */}
      <div
        className="rounded-2xl border p-5"
        style={{ backgroundColor: "rgba(16,185,129,0.03)", borderColor: "rgba(16,185,129,0.18)" }}
      >
        <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#10B981" }}>
          Every Core &amp; Pro participant receives — free
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {[
            "Visibility Scorecard before training — your baseline score",
            "Visibility Scorecard after training — your proof of improvement",
            "12-checkpoint breakdown across 4 visibility dimensions",
            "Before vs. after comparison you can share with your department",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2 text-sm" style={{ color: "#374151" }}>
              <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "#10B981" }} />
              {item}
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" style={{ borderColor: "rgba(16,185,129,0.15)" }}>
          <p className="text-xs leading-relaxed max-w-lg" style={{ color: "#4B5563" }}>
            Want to see where you stand right now?{" "}
            <span className="font-semibold" style={{ color: "#111827" }}>Take the free scorecard first</span>{" "}
            — your result becomes your pre-clinic baseline when you enrol.
          </p>
          <Link
            href="/resources/visibility-scorecard"
            className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white whitespace-nowrap flex-shrink-0 transition-all hover:opacity-90"
            style={{ backgroundColor: "#10B981" }}
          >
            Take Free Scorecard
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
