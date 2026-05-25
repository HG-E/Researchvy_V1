import Link from "next/link";
import { ArrowRight, BookOpen, BarChart2, CheckSquare, FileText, Layout, Layers, Clock } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { getInsights } from "@/lib/cms/mdx";
import { RESOURCES } from "@/constants/resources";
import type { ResourceIconName } from "@/constants/resources";
import type { LucideIcon } from "lucide-react";

export const metadata = generatePageMetadata({ title: "My Resources", noIndex: true });

const ICON_MAP: Record<ResourceIconName, LucideIcon> = {
  FileText, CheckSquare, Layout, BarChart2, BookOpen, Layers,
};

const CATEGORY_LABELS: Record<string, string> = {
  "scholarly-visibility":      "Scholarly Visibility",
  "research-intelligence":     "Research Intelligence",
  "scholarly-communication":   "Scholarly Communication",
  "modern-scholarly-systems":  "Modern Scholarly Systems",
  "institutional-positioning": "Institutional Positioning",
};

export default async function ResourcesPage() {
  const recentInsights = await getInsights({ limit: 6 });

  // Put featured resource first, rest after
  const featured  = RESOURCES.find((r) => r.featured)!;
  const secondary = RESOURCES.filter((r) => !r.featured && r.access !== "clinic");

  return (
    <div className="max-w-3xl mx-auto space-y-10">

      {/* Header */}
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>
          Dashboard
        </p>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
          Resources
        </h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          Guides, tools, and recommended reading for your visibility journey
        </p>
      </div>

      {/* Scorecard CTA — hero card */}
      <div
        className="rounded-3xl border overflow-hidden relative"
        style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
      >
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg, #10B981, #2563EB)" }} />
        <div className="p-8">
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold mb-4"
            style={{ backgroundColor: "rgba(16,185,129,0.12)", color: "#10B981", border: "1px solid rgba(16,185,129,0.25)" }}
          >
            Free · Start Here
          </span>
          <h2 className="text-2xl font-bold mb-2 leading-tight" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
            {featured.title}
          </h2>
          <p className="text-sm leading-relaxed mb-6" style={{ color: "#6B7280" }}>
            A 12-point interactive self-assessment across Scholar Identity, Discoverability, Citation Health,
            and Research Communication. See exactly where you stand and what every gap is costing your h-index right now.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/resources/visibility-scorecard"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-colors"
              style={{ backgroundColor: "#10B981" }}
            >
              Take the Free Scorecard <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/clinics/digital-visibility-clinic"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors"
              style={{ backgroundColor: "#1E293B", color: "#9CA3AF", border: "1px solid #334155" }}
            >
              Book a Clinic Session
            </Link>
          </div>
          <p className="text-xs mt-4" style={{ color: "#374151" }}>
            Most researchers score between 25–45. Where do you rank?
          </p>
        </div>
      </div>

      {/* Free resources */}
      <div>
        <h2 className="text-sm font-semibold mb-4" style={{ color: "#9CA3AF" }}>
          Free Resources
        </h2>
        <div className="space-y-3">
          {secondary.map((resource) => {
            const Icon = ICON_MAP[resource.icon];
            return (
              <Link
                key={resource.id}
                href={`/resources`}
                className="group flex items-center gap-4 rounded-2xl border p-4 transition-colors"
                style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${resource.color}1A` }}
                >
                  <Icon className="h-5 w-5" style={{ color: resource.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "#F9FAFB" }}>
                    {resource.title}
                  </p>
                  <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "#6B7280" }}>
                    {resource.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {resource.access === "free" && (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: "rgba(37,99,235,0.12)", color: "#2563EB" }}>
                      Free
                    </span>
                  )}
                  {resource.access === "newsletter" && (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: "rgba(16,185,129,0.12)", color: "#10B981" }}>
                      Email
                    </span>
                  )}
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#6B7280" }} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recommended reading */}
      {recentInsights.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold" style={{ color: "#9CA3AF" }}>
              Recommended Reading
            </h2>
            <Link
              href="/insights"
              className="text-xs font-medium transition-colors hover:opacity-80"
              style={{ color: "#2563EB" }}
            >
              Browse all articles →
            </Link>
          </div>
          <div className="space-y-3">
            {recentInsights.map((insight) => (
              <Link
                key={insight.slug}
                href={`/insights/${insight.slug}`}
                className="group flex items-start gap-4 rounded-2xl border p-4 transition-colors"
                style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: "rgba(37,99,235,0.08)" }}
                >
                  <BookOpen className="h-5 w-5" style={{ color: "#2563EB" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-snug mb-1" style={{ color: "#F9FAFB" }}>
                    {insight.title}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs" style={{ color: "#4B5563" }}>
                      {CATEGORY_LABELS[insight.category] ?? insight.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: "#4B5563" }}>
                      <Clock className="h-3 w-3" />
                      {insight.reading_time} min
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-1" style={{ color: "#6B7280" }} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Browse more */}
      <div
        className="rounded-2xl border p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
      >
        <div>
          <p className="text-sm font-semibold" style={{ color: "#F9FAFB" }}>Explore the full resource library</p>
          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Guides, checklists, templates, and workbooks, all free.</p>
        </div>
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white whitespace-nowrap transition-colors"
          style={{ backgroundColor: "#2563EB" }}
        >
          View All Resources <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

    </div>
  );
}
