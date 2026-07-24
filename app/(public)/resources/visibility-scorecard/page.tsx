import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { VisibilityScorecard } from "@/components/resources/VisibilityScorecard";

export const metadata = generatePageMetadata({
  title: "Researcher Visibility Scorecard",
  description: "A 12-point self-assessment that calculates your exact scholarly visibility score and reveals what it's costing you in citations, h-index, and career advancement.",
  path: "/resources/visibility-scorecard",
});

export default function ScorecardPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Clinic baseline callout */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl border px-5 py-4 mb-10"
          style={{ backgroundColor: "rgba(16,185,129,0.04)", borderColor: "rgba(16,185,129,0.22)" }}
        >
          <div className="flex-1">
            <p className="text-xs font-bold mb-0.5" style={{ color: "#10B981" }}>
              Enrolling in the Digital Visibility Clinic?
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "#4B5563" }}>
              Your score today becomes your pre-training baseline. Complete it now and Step 1 of
              your clinic journey is already done before training begins.
            </p>
          </div>
          <Link
            href="/clinics/digital-visibility-clinic"
            className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all hover:opacity-90"
            style={{ backgroundColor: "#10B981", color: "#fff" }}
          >
            View the Clinic
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <VisibilityScorecard />
      </div>
    </div>
  );
}
