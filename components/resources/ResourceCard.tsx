"use client";

import { useState } from "react";
import { GraduationCap, ArrowRight, FileText, CheckSquare, Layout, BarChart2, BookOpen, Layers, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";
import { buildWhatsAppUrl } from "@/config/site";
import type { StaticResource, ResourceIconName } from "@/constants/resources";

const ICON_MAP: Record<ResourceIconName, LucideIcon> = {
  FileText, CheckSquare, Layout, BarChart2, BookOpen, Layers,
};

const CATEGORY_LABELS: Record<StaticResource["category"], string> = {
  guide:     "Guide",
  checklist: "Checklist",
  template:  "Template",
  workbook:  "Workbook",
  toolkit:   "Toolkit",
  report:    "Report",
};

export function ResourceCard({ resource }: { resource: StaticResource }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = ICON_MAP[resource.icon];

  return (
    <div
      className="rounded-2xl border flex flex-col transition-all duration-200 overflow-hidden"
      style={{ backgroundColor: "#0F172A", borderColor: expanded ? resource.color : "#1E293B" }}
    >
      <div className="p-6 flex flex-col gap-4 flex-1">
        {/* Icon + category */}
        <div className="flex items-center justify-between">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${resource.color}1A` }}
          >
            <Icon className="h-5 w-5" style={{ color: resource.color }} />
          </div>
          <span
            className="text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ backgroundColor: "#1E293B", color: "#6B7280" }}
          >
            {CATEGORY_LABELS[resource.category]}
          </span>
        </div>

        {/* Title + description */}
        <div className="flex-1">
          <h3 className="text-sm font-bold mb-2 leading-snug" style={{ color: "#F9FAFB" }}>
            {resource.title}
          </h3>
          <p className="text-xs leading-relaxed line-clamp-3" style={{ color: "#6B7280" }}>
            {resource.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {resource.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#1E293B", color: "#4B5563" }}>
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        {resource.access === "clinic" ? (
          <Link
            href="/clinics"
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-200 border"
            style={{ borderColor: "#1E293B", color: "#6B7280" }}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            Clinic Participants Only
            <ArrowRight className="h-3.5 w-3.5 ml-auto" />
          </Link>
        ) : resource.access === "free" ? (
          <a
            href={buildWhatsAppUrl(`the ${resource.title}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-white transition-all duration-200"
            style={{ backgroundColor: "#25D366" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1DAE54")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#25D366")}
          >
            Request via WhatsApp
          </a>
        ) : (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-white transition-all duration-200 w-full"
            style={{ backgroundColor: resource.color }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {expanded ? "Close" : "Get This Resource"}
          </button>
        )}
      </div>

      {/* Inline newsletter form */}
      {resource.access === "newsletter" && expanded && (
        <div className="px-6 pb-6 border-t pt-4" style={{ borderColor: "#1E293B" }}>
          <p className="text-xs mb-3" style={{ color: "#9CA3AF" }}>
            Enter your email and we&apos;ll send this resource within 24 hours.
          </p>
          <NewsletterForm variant="inline" resourceTitle={resource.title} />
        </div>
      )}
    </div>
  );
}
