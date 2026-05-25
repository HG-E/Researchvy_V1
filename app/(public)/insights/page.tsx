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
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
            Researchvy Insights
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB", letterSpacing: "-0.02em" }}
          >
            Research Intelligence<br />
            <span style={{ color: "#60A5FA" }}>& Visibility</span>
          </h1>
          <p className="text-base leading-relaxed" style={{ color: "#6B7280" }}>
            Institutional-grade articles on scholarly visibility, bibliometrics, research communication,
            and the systems that shape academic impact.
          </p>
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
