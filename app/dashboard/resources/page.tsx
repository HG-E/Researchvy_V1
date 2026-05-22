import Link from "next/link";
import { BookOpen, ArrowRight, FileText, Video, Link2 } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";

export const metadata = generatePageMetadata({ title: "My Resources", noIndex: true });

const FEATURED_RESOURCES = [
  {
    icon: FileText,
    label: "Researcher Visibility Checklist",
    description: "A complete 50-point checklist for optimising your digital scholarly presence",
    type: "PDF Guide",
    color: "#2563EB",
  },
  {
    icon: Video,
    label: "ORCID Setup Masterclass",
    description: "Step-by-step walkthrough of setting up and optimising your ORCID profile",
    type: "Video",
    color: "#8B5CF6",
  },
  {
    icon: Link2,
    label: "Google Scholar Optimisation Guide",
    description: "How to structure your profile for maximum discoverability",
    type: "Article",
    color: "#10B981",
  },
];

export default function ResourcesPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-1"
          style={{ color: "#2563EB" }}
        >
          Dashboard
        </p>
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
        >
          Resources
        </h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          Guides, templates, and tools for your visibility journey
        </p>
      </div>

      {/* Empty state */}
      <div
        className="rounded-2xl border p-10 flex flex-col items-center text-center"
        style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
          style={{ backgroundColor: "rgba(16,185,129,0.1)" }}
        >
          <BookOpen className="h-8 w-8" style={{ color: "#10B981" }} />
        </div>
        <h2 className="text-lg font-bold mb-2" style={{ color: "#F9FAFB" }}>
          No saved resources
        </h2>
        <p className="text-sm max-w-sm mb-6 leading-relaxed" style={{ color: "#6B7280" }}>
          Browse our resource library and save guides, templates, and tools to your dashboard for
          easy access.
        </p>
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200"
          style={{ backgroundColor: "#10B981" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#059669")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#10B981")}
        >
          Browse Resources <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Featured resources */}
      <div>
        <h2 className="text-sm font-semibold mb-4" style={{ color: "#9CA3AF" }}>
          Featured Resources
        </h2>
        <div className="space-y-3">
          {FEATURED_RESOURCES.map((resource) => (
            <Link
              key={resource.label}
              href="/resources"
              className="group flex items-center gap-4 rounded-2xl border p-4 transition-all duration-200"
              style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = resource.color)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1E293B")}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${resource.color}1A` }}
              >
                <resource.icon className="h-5 w-5" style={{ color: resource.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: "#F9FAFB" }}>
                  {resource.label}
                </p>
                <p className="text-xs mt-0.5 truncate" style={{ color: "#6B7280" }}>
                  {resource.description}
                </p>
              </div>
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0"
                style={{ backgroundColor: "#1E293B", color: "#6B7280" }}
              >
                {resource.type}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
