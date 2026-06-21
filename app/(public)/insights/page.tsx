import Link from "next/link";
import { Suspense } from "react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { getInsights } from "@/lib/cms/mdx";
import { InsightGrid } from "@/components/insights/InsightGrid";
import { CategoryFilter } from "@/components/insights/CategoryFilter";
import { ArrowRight } from "lucide-react";
import type { InsightCategory } from "@/types";

export const revalidate = 3600;

export const metadata = generatePageMetadata({
  title: "Insights",
  description: "Institutional articles on scholarly visibility, research intelligence, and academic discoverability from the Researchvy team.",
  path: "/insights",
});

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function InsightsPage({ searchParams }: PageProps) {
  const { category } = await searchParams;

  const insights = await getInsights({
    category: category as InsightCategory | undefined,
    limit: 100,
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080E1A" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Page header */}
        <div className="max-w-2xl mb-12 relative">
          {/* Subtle glow behind heading */}
          <div
            className="absolute -top-6 -left-6 w-64 h-64 rounded-full blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, #2563EB18, transparent 70%)" }}
            aria-hidden="true"
          />
          <p className="relative text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
            Researchvy Insights
          </p>
          <h1
            className="relative text-4xl sm:text-5xl font-bold mb-4"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB", letterSpacing: "-0.02em" }}
          >
            Research Intelligence<br />
            <span style={{ color: "#60A5FA" }}>&amp; Visibility</span>
          </h1>
          <p className="relative text-base leading-relaxed mb-6" style={{ color: "#6B7280" }}>
            Institutional-grade articles on scholarly visibility, bibliometrics, research communication,
            and the systems that shape academic impact.
          </p>
          {/* Stat pills */}
          <div className="relative flex flex-wrap gap-2.5">
            {[
              { value: "25+", label: "Articles" },
              { value: "5",   label: "Categories" },
              { value: "Free", label: "Always" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 border text-sm"
                style={{ backgroundColor: "rgba(15,23,42,0.6)", borderColor: "#1E293B" }}
              >
                <span className="font-bold" style={{ color: "#60A5FA" }}>{value}</span>
                <span style={{ color: "#6B7280" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category filter */}
        <div className="mb-10">
          <Suspense fallback={null}>
            <CategoryFilter />
          </Suspense>
        </div>

        <InsightGrid insights={insights} />

        {/* Funnel CTA — insights readers are high-intent; give them a frictionless next step */}
        <div
          className="mt-16 rounded-3xl border p-8 sm:p-10 relative overflow-hidden"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg, #10B981, #2563EB)" }} />
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#10B981" }}>
              Free Diagnostic Tool
            </p>
            <h2
              className="text-2xl sm:text-3xl font-bold mb-3 leading-tight"
              style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
            >
              Know where you actually stand.
            </h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#6B7280" }}>
              The Researcher Visibility Scorecard gives you an exact score across Scholar Identity,
              Discoverability, Citation Health, and Research Communication — and shows you precisely
              what every gap is costing your h-index and career right now.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/resources/visibility-scorecard"
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5"
                style={{ backgroundColor: "#10B981" }}
              >
                Take the Scorecard Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/consultation"
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold border transition-all duration-200 hover:border-[#2563EB] hover:text-white"
                style={{ borderColor: "#1E293B", color: "#9CA3AF" }}
              >
                Book a Free Strategy Call
              </Link>
            </div>
            <p className="text-xs mt-4" style={{ color: "#4B5563" }}>
              4–6 minutes · 12 checkpoints · Results shown immediately
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
