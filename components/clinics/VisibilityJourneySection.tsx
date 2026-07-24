import Link from "next/link";
import { ArrowRight, ClipboardList, BookOpen, BarChart3, FileCheck } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: ClipboardList,
    when: "Before sessions begin",
    heading: "Your baseline score",
    body: "Every participant — online and in-person — takes the free 12-point Researcher Visibility Scorecard. Four dimensions. Scored out of 100. That number is yours to keep.",
    accent: "#2563EB",
  },
  {
    number: "02",
    icon: BookOpen,
    when: "5 live sessions",
    heading: "Targeted work on every dimension",
    body: "Scholar Identity. Discoverability. Citation Health. Scholarly Communication. Each session directly addresses what the scorecard measures, so improvements are intentional — not accidental.",
    accent: "#8B5CF6",
  },
  {
    number: "03",
    icon: BarChart3,
    when: "After sessions end",
    heading: "Your after score",
    body: "Same 12 checkpoints. Same four dimensions. You complete the scorecard again and see exactly which areas moved — and by how much.",
    accent: "#10B981",
  },
  {
    number: "04",
    icon: FileCheck,
    when: "Yours to keep",
    heading: "A comparison you can show",
    body: "Your before and after scores side by side — a concrete, numbered record of improvement. The kind of outcome your department, institution, or funder can actually read.",
    accent: "#F59E0B",
  },
];

const DIMENSIONS = [
  { label: "Scholar Identity",         max: 25, detail: "ORCID, Google Scholar, Scopus — your presence on the systems that count" },
  { label: "Discoverability",          max: 25, detail: "Keywords, open access, ResearchGate, preprints — how findable your work is" },
  { label: "Citation Health",          max: 25, detail: "Citation hygiene, self-citation strategy, reference management, altmetrics" },
  { label: "Scholarly Communication",  max: 25, detail: "Writing for visibility, peer review presence, conference footprint, public scholarship" },
];

export function VisibilityJourneySection() {
  return (
    <section>
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#10B981" }}>
          Free with Every Core &amp; Pro Enrollment
        </p>
        <h2
          className="text-2xl font-bold mb-3"
          style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
        >
          The Only Training That Proves You Improved
        </h2>
        <p className="text-sm leading-relaxed max-w-xl" style={{ color: "#4B5563" }}>
          Every participant arrives with a score and leaves with a better one — both documented.
          No other research training programme in Nigeria currently offers this.
        </p>
      </div>

      {/* Journey steps */}
      <div className="relative mb-10">
        {/* Connector line — desktop */}
        <div
          className="hidden sm:block absolute top-7 left-7 right-7 h-px"
          style={{ background: "linear-gradient(90deg, #2563EB22, #10B98122)" }}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map(({ number, icon: Icon, when, heading, body, accent }) => (
            <div key={number} className="relative flex flex-col">
              {/* Step number + icon */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 relative z-10"
                  style={{ backgroundColor: accent + "12", border: `1px solid ${accent}30` }}
                >
                  <Icon className="h-5 w-5" style={{ color: accent }} />
                </div>
                <span
                  className="text-[10px] font-bold tracking-widest"
                  style={{ color: accent + "99" }}
                >
                  STEP {number}
                </span>
              </div>

              <p className="text-[10px] font-semibold tracking-wider uppercase mb-1" style={{ color: "#9CA3AF" }}>
                {when}
              </p>
              <p className="text-sm font-bold mb-2" style={{ color: "#111827" }}>{heading}</p>
              <p className="text-xs leading-relaxed" style={{ color: "#4B5563" }}>{body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What gets measured */}
      <div
        className="rounded-2xl border p-5 mb-6"
        style={{ backgroundColor: "#F8FAFC", borderColor: "#E2E8F0" }}
      >
        <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: "#4B5563" }}>
          What the scorecard measures — before and after
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DIMENSIONS.map(({ label, max, detail }) => (
            <div key={label} className="flex items-start gap-3">
              <div
                className="mt-0.5 flex-shrink-0 text-[10px] font-bold tabular-nums rounded px-1.5 py-0.5"
                style={{ backgroundColor: "#E2E8F0", color: "#4B5563" }}
              >
                /  {max}
              </div>
              <div>
                <p className="text-xs font-semibold mb-0.5" style={{ color: "#111827" }}>{label}</p>
                <p className="text-[11px] leading-relaxed" style={{ color: "#6B7280" }}>{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Differentiation + CTAs */}
      <div
        className="rounded-2xl border p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5"
        style={{
          background: "linear-gradient(135deg, rgba(16,185,129,0.04) 0%, rgba(37,99,235,0.04) 100%)",
          borderColor: "rgba(16,185,129,0.2)",
        }}
      >
        <div className="flex-1">
          <p className="text-sm font-bold mb-1" style={{ color: "#111827" }}>
            Want to know your score right now?
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "#4B5563" }}>
            Take the free scorecard before you enrol — your result becomes your pre-clinic
            baseline, so you already have Step 1 complete when training begins.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
          <Link
            href="/resources/visibility-scorecard"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold border whitespace-nowrap transition-all hover:opacity-90"
            style={{ borderColor: "#10B981", color: "#10B981", backgroundColor: "transparent" }}
          >
            Take Free Scorecard
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/clinics/checkout?bundle=core"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white whitespace-nowrap transition-all hover:opacity-90"
            style={{ backgroundColor: "#10B981" }}
          >
            Enrol in the Clinic
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
