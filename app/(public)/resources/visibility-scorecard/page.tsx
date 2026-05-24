import { generatePageMetadata } from "@/lib/seo/metadata";
import { VisibilityScorecard } from "@/components/resources/VisibilityScorecard";

export const metadata = generatePageMetadata({
  title: "Researcher Visibility Scorecard",
  description: "A 12-point self-assessment that calculates your exact scholarly visibility score — and reveals what it's costing you in citations, h-index, and career advancement.",
  path: "/resources/visibility-scorecard",
});

export default function ScorecardPage() {
  return (
    <div style={{ backgroundColor: "#080E1A", minHeight: "100vh" }}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <VisibilityScorecard />
      </div>
    </div>
  );
}
