import { generatePageMetadata } from "@/lib/seo/metadata";
import { RESOURCES } from "@/constants/resources";
import { FileText, CheckSquare, Layout, BarChart2, BookOpen, Layers, type LucideIcon } from "lucide-react";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";
import type { ResourceIconName } from "@/constants/resources";

const ICON_MAP: Record<ResourceIconName, LucideIcon> = {
  FileText, CheckSquare, Layout, BarChart2, BookOpen, Layers,
};

export const metadata = generatePageMetadata({
  title:       "Resource Library",
  description: "Free guides, checklists, templates and toolkits to help researchers build strategic scholarly visibility.",
  path:        "/resources",
});

const featured = RESOURCES.find((r) => r.featured)!;
const rest      = RESOURCES.filter((r) => !r.featured);

export default function ResourceLibraryPage() {
  const FeaturedIcon = ICON_MAP[featured.icon];

  return (
    <div style={{ backgroundColor: "#080E1A", minHeight: "100vh" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">

        {/* Header */}
        <div className="max-w-2xl mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
            Resource Library
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold mb-4 leading-tight"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB", letterSpacing: "-0.02em" }}
          >
            Tools for Scholarly<br />
            <span style={{ color: "#10B981" }}>Visibility</span>
          </h1>
          <p className="text-base leading-relaxed" style={{ color: "#6B7280" }}>
            Free guides, checklists, templates, and workbooks to help you build a strategic,
            sustainable scholarly visibility system.
          </p>
        </div>

        {/* Featured resource */}
        <div
          className="rounded-3xl border p-8 lg:p-10 mb-14 overflow-hidden relative"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${featured.color}, #2563EB)` }} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span
                className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold mb-5"
                style={{ backgroundColor: `${featured.color}1A`, color: featured.color, border: `1px solid ${featured.color}33` }}
              >
                Featured Resource
              </span>
              <h2
                className="text-3xl font-bold mb-3 leading-tight"
                style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
              >
                {featured.title}
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: "#6B7280" }}>
                {featured.description}
              </p>
              <div>
                <p className="text-sm mb-1 font-medium" style={{ color: "#9CA3AF" }}>
                  Free — enter your email to access instantly:
                </p>
                <p className="text-xs mb-3 leading-relaxed" style={{ color: "#4B5563" }}>
                  Most researchers score between 25–45. See exactly where you stand.
                </p>
                <NewsletterForm
                  variant="inline"
                  resourceTitle={featured.title}
                  redirectTo="/resources/visibility-scorecard"
                />
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div
                className="w-48 h-48 rounded-3xl flex items-center justify-center"
                style={{ backgroundColor: `${featured.color}15`, border: `2px solid ${featured.color}30` }}
              >
                <FeaturedIcon className="h-24 w-24" style={{ color: featured.color, opacity: 0.8 }} />
              </div>
            </div>
          </div>
        </div>

        {/* Access legend */}
        <div className="flex flex-wrap gap-4 mb-8">
          {[
            { label: "Free via WhatsApp", color: "#25D366" },
            { label: "Free with email signup", color: "#2563EB" },
            { label: "Clinic participants only", color: "#6B7280" },
          ].map(({ label, color }) => (
            <span key={label} className="flex items-center gap-2 text-xs" style={{ color: "#6B7280" }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              {label}
            </span>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {rest.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>

        {/* Newsletter banner */}
        <div
          className="rounded-3xl border p-10 text-center"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
            Stay Informed
          </p>
          <h2
            className="text-3xl font-bold mb-3"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
          >
            Research Visibility Insights
          </h2>
          <p className="text-sm mb-8 max-w-lg mx-auto" style={{ color: "#6B7280" }}>
            New resources, articles, and clinic announcements delivered to your inbox.
            No spam — scholarly intelligence only.
          </p>
          <div className="flex justify-center">
            <NewsletterForm variant="inline" />
          </div>
          <p className="text-xs mt-4" style={{ color: "#374151" }}>
            Join researchers from universities and institutions worldwide.
          </p>
        </div>

      </div>
    </div>
  );
}
