import { Suspense } from "react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { getInsights } from "@/lib/cms/mdx";
import { InsightGrid } from "@/components/insights/InsightGrid";
import { CategoryFilter } from "@/components/insights/CategoryFilter";
import type { InsightCategory } from "@/types";

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
      </div>
    </div>
  );
}
