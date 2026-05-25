import Link from "next/link";
import { ArrowRight, CheckCircle2, AlertTriangle, TrendingUp, Clock } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";
import { HoverCard } from "@/components/ui/HoverCard";

export const metadata = generatePageMetadata({
  title: "Research Visibility for Early-Career Researchers",
  description: "PhD students, postdocs, and junior faculty: your work deserves to be found. Build strategic scholarly visibility before the competitive window closes.",
  path: "/researchers/early-career",
});

const FEARS = [
  "Publishing consistently, but citations are slow and h-index isn't moving",
  "Applying for funding and positions where bibliometric scores matter",
  "Watching peers with fewer publications appear more 'visible' in your field",
  "Not knowing if your online profiles are helping or quietly hurting you",
];

const WINS = [
  { metric: "h-index recovery",      detail: "Average 4-point h-index gain after correcting disambiguation alone" },
  { metric: "Citation recapture",     detail: "23 citations recovered on average by fixing split Scopus profiles" },
  { metric: "Google Scholar",         detail: "89% of researchers have at least one unclaimed or misattributed publication" },
  { metric: "ORCID integration",      detail: "A verified ORCID auto-attributes new citations across all linked platforms" },
];

const STAGES = [
  {
    stage:  "PhD / Doctoral candidate",
    urgency: "Establish your identity before you publish",
    actions: ["Register and verify your ORCID now, before your first paper", "Set up a Google Scholar profile at submission", "Choose a consistent author name and use it everywhere"],
    color:  "#10B981",
  },
  {
    stage:  "Postdoc / Research associate",
    urgency: "Clean up what the PhD years left behind",
    actions: ["Audit your Scopus profile for disambiguation issues", "Merge duplicate author profiles", "Build your first strategic citation network"],
    color:  "#2563EB",
  },
  {
    stage:  "Junior faculty / Lecturer",
    urgency: "Compete on metrics before tenure review",
    actions: ["Run a full bibliometric audit: h-index, citation gaps, platform coverage", "Build a 12-month visibility strategy tied to promotion criteria", "Translate research into policy briefs and media-ready abstracts"],
    color:  "#8B5CF6",
  },
];

export default function EarlyCareerPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080E1A" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Header */}
        <div className="max-w-3xl mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#10B981" }}>
            For Early-Career Researchers
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold mb-5 leading-tight"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB", letterSpacing: "-0.02em" }}
          >
            You're Publishing.<br />
            <span style={{ color: "#10B981" }}>Is Anyone Finding You?</span>
          </h1>
          <p className="text-lg leading-relaxed mb-8" style={{ color: "#6B7280" }}>
            The early career window is the highest-leverage moment for building scholarly visibility.
            The researchers who establish strong discovery profiles now will outperform peers with
            equivalent output for the rest of their careers, in citations, funding success, and
            academic opportunity.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/resources/visibility-scorecard"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
              style={{ backgroundColor: "#10B981" }}
            >
              Check Your Visibility Score, Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/clinics/digital-visibility-clinic"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold border"
              style={{ borderColor: "#1E293B", color: "#9CA3AF" }}
            >
              Book a Clinic Session
            </Link>
          </div>
        </div>

        {/* The recognition problem */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 items-start">
          <div
            className="rounded-2xl border p-8"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            <div className="flex items-center gap-2 mb-5">
              <AlertTriangle className="h-5 w-5" style={{ color: "#F59E0B" }} />
              <h2 className="text-lg font-bold" style={{ color: "#F9FAFB" }}>
                Sound familiar?
              </h2>
            </div>
            <ul className="space-y-4">
              {FEARS.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>
                  <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: "#F59E0B" }} />
                  {f}
                </li>
              ))}
            </ul>
            <div
              className="mt-6 rounded-xl p-4"
              style={{ backgroundColor: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.15)" }}
            >
              <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>
                These aren't signs that your research isn't good enough. They're signs that
                your <strong style={{ color: "#F9FAFB" }}>discovery infrastructure is broken</strong>,
                and nobody in academia ever taught you how to fix it.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#6B7280" }}>
              What fixing it looks like
            </p>
            {WINS.map(({ metric, detail }) => (
              <HoverCard key={metric} accentColor="#10B981" className="flex items-start gap-4 p-4">
                <TrendingUp className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: "#10B981" }} />
                <div>
                  <p className="text-sm font-bold" style={{ color: "#F9FAFB" }}>{metric}</p>
                  <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "#6B7280" }}>{detail}</p>
                </div>
              </HoverCard>
            ))}
          </div>
        </div>

        {/* Stage-specific advice */}
        <div className="mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#6B7280" }}>
            Where you are in your career
          </p>
          <h2
            className="text-3xl font-bold mb-8"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
          >
            The right actions at the right stage
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {STAGES.map(({ stage, urgency, actions, color }) => (
              <HoverCard key={stage} accentColor={color} className="overflow-hidden">
                <div className="h-1" style={{ backgroundColor: color }} />
                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color }}>
                    {stage}
                  </p>
                  <p className="text-sm font-semibold mb-4 leading-snug" style={{ color: "#F9FAFB" }}>
                    {urgency}
                  </p>
                  <ul className="space-y-2.5">
                    {actions.map((a) => (
                      <li key={a} className="flex items-start gap-2.5 text-xs leading-relaxed" style={{ color: "#9CA3AF" }}>
                        <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" style={{ color }} />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </HoverCard>
            ))}
          </div>
        </div>

        {/* The window argument */}
        <div
          className="rounded-3xl border p-10 mb-16"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5" style={{ color: "#F59E0B" }} />
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#F59E0B" }}>
                Why timing matters more than you think
              </p>
            </div>
            <h2
              className="text-2xl font-bold mb-4"
              style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
            >
              The researcher who builds visibility at 35<br />
              doesn't catch up to the one who built it at 28.
            </h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#6B7280" }}>
              Citation compounding is real. A researcher who fixes their discovery infrastructure
              early sees citations accumulate faster, and those citations attract more citations.
              The h-index gap between a researcher with optimal visibility and one with equivalent
              output but poor visibility widens by roughly 1-2 points per year. Over a career,
              that's a different funding bracket, a different promotion track, and a different
              level of international recognition.
            </p>
            <p className="text-sm font-semibold" style={{ color: "#F9FAFB" }}>
              The best time to fix your visibility was when you published your first paper.
              The second-best time is now.
            </p>
          </div>
        </div>

        {/* Free start + Clinic CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          <div
            className="rounded-2xl border p-8"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold mb-4"
              style={{ backgroundColor: "rgba(16,185,129,0.12)", color: "#10B981", border: "1px solid rgba(16,185,129,0.25)" }}
            >
              Free · Start Here
            </span>
            <h3 className="text-xl font-bold mb-2" style={{ color: "#F9FAFB" }}>
              The Researcher Visibility Scorecard
            </h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#6B7280" }}>
              12 questions. 4 minutes. A score out of 100 that shows you exactly where your
              visibility is strong, where it&apos;s broken, and what each gap is costing your career.
            </p>
            <Link
              href="/resources/visibility-scorecard"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white"
              style={{ backgroundColor: "#10B981" }}
            >
              Take the Free Scorecard <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="text-xs mt-3" style={{ color: "#374151" }}>
              Most early-career researchers score between 18–42. See where you stand.
            </p>
          </div>

          <div
            className="rounded-2xl border p-8"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold mb-4"
              style={{ backgroundColor: "rgba(37,99,235,0.12)", color: "#2563EB", border: "1px solid rgba(37,99,235,0.25)" }}
            >
              Guided · 4 Live Sessions
            </span>
            <h3 className="text-xl font-bold mb-2" style={{ color: "#F9FAFB" }}>
              Digital Visibility Clinic
            </h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#6B7280" }}>
              Six expert-guided sessions that fix your entire visibility system from the ground up.
              Profiles, disambiguation, citations, communication, strategy, all covered.
              Designed specifically for researchers at a critical career stage.
            </p>
            <Link
              href="/clinics/digital-visibility-clinic"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white"
              style={{ backgroundColor: "#2563EB" }}
            >
              View the Clinic Programme <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Newsletter */}
        <div
          className="rounded-3xl border p-10 text-center"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
            Visibility intelligence, built for early-career researchers
          </h2>
          <p className="text-sm mb-8 max-w-lg mx-auto" style={{ color: "#6B7280" }}>
            Weekly insights on building strategic scholarly presence at every stage. Free.
          </p>
          <div className="flex justify-center">
            <NewsletterForm variant="inline" />
          </div>
        </div>

      </div>
    </div>
  );
}
