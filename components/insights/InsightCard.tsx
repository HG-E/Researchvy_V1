"use client";

import Link from "next/link";
import { Clock, Calendar } from "lucide-react";
import { format } from "date-fns";
import type { InsightListItem, InsightCategory } from "@/types";

const CATEGORY_LABELS: Record<InsightCategory, string> = {
  "scholarly-visibility":     "Scholarly Visibility",
  "research-intelligence":    "Research Intelligence",
  "scholarly-communication":  "Scholarly Communication",
  "modern-scholarly-systems": "Modern Scholarly Systems",
  "institutional-positioning":"Institutional Positioning",
};

const CATEGORY_COLORS: Record<InsightCategory, { bg: string; text: string; border: string }> = {
  "scholarly-visibility":     { bg: "rgba(37,99,235,0.1)",   text: "#60A5FA", border: "rgba(37,99,235,0.3)" },
  "research-intelligence":    { bg: "rgba(124,58,237,0.1)",  text: "#A78BFA", border: "rgba(124,58,237,0.3)" },
  "scholarly-communication":  { bg: "rgba(5,150,105,0.1)",   text: "#34D399", border: "rgba(5,150,105,0.3)" },
  "modern-scholarly-systems": { bg: "rgba(217,119,6,0.1)",   text: "#FCD34D", border: "rgba(217,119,6,0.3)" },
  "institutional-positioning":{ bg: "rgba(219,39,119,0.1)",  text: "#F472B6", border: "rgba(219,39,119,0.3)" },
};

export function InsightCard({ insight }: { insight: InsightListItem }) {
  const colors = CATEGORY_COLORS[insight.category];

  return (
    <Link href={`/insights/${insight.slug}`} className="group block h-full">
      <article
        className="h-full rounded-2xl border p-6 flex flex-col gap-4 transition-all duration-200 group-hover:border-[#2563EB]/40 group-hover:-translate-y-0.5"
        style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
      >
        {/* Category badge */}
        <div className="flex items-center justify-between gap-3">
          <span
            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
            style={{ backgroundColor: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
          >
            {CATEGORY_LABELS[insight.category]}
          </span>
          <span className="flex items-center gap-1 text-xs" style={{ color: "#4B5563" }}>
            <Clock className="h-3 w-3" />
            {insight.reading_time} min
          </span>
        </div>

        {/* Title */}
        <h2
          className="text-base font-bold leading-snug flex-1 group-hover:text-[#60A5FA] transition-colors duration-200"
          style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
        >
          {insight.title}
        </h2>

        {/* Excerpt */}
        <p
          className="text-sm leading-relaxed line-clamp-3"
          style={{ color: "#6B7280" }}
        >
          {insight.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "#1E293B" }}>
          <span className="text-xs font-medium" style={{ color: "#4B5563" }}>
            {insight.author?.name ?? "Researchvy Editorial"}
          </span>
          <span className="flex items-center gap-1 text-xs" style={{ color: "#4B5563" }}>
            <Calendar className="h-3 w-3" />
            {format(new Date(insight.published_at), "MMM d, yyyy")}
          </span>
        </div>
      </article>
    </Link>
  );
}
