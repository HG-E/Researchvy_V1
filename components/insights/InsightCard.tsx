"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar } from "lucide-react";
import { format } from "date-fns";
import type { InsightListItem, InsightCategory } from "@/types";

const CATEGORY_LABELS: Record<InsightCategory, string> = {
  "scholarly-visibility":      "Scholarly Visibility",
  "research-intelligence":     "Research Intelligence",
  "scholarly-communication":   "Scholarly Communication",
  "modern-scholarly-systems":  "Modern Scholarly Systems",
  "institutional-positioning": "Institutional Positioning",
};

const CATEGORY_COLORS: Record<InsightCategory, { bg: string; text: string; border: string; accent: string }> = {
  "scholarly-visibility":      { bg: "rgba(37,99,235,0.12)",   text: "#60A5FA", border: "rgba(37,99,235,0.3)",  accent: "#2563EB" },
  "research-intelligence":     { bg: "rgba(124,58,237,0.12)",  text: "#A78BFA", border: "rgba(124,58,237,0.3)", accent: "#7C3AED" },
  "scholarly-communication":   { bg: "rgba(5,150,105,0.12)",   text: "#34D399", border: "rgba(5,150,105,0.3)",  accent: "#059669" },
  "modern-scholarly-systems":  { bg: "rgba(217,119,6,0.12)",   text: "#FCD34D", border: "rgba(217,119,6,0.3)",  accent: "#D97706" },
  "institutional-positioning": { bg: "rgba(219,39,119,0.12)",  text: "#F472B6", border: "rgba(219,39,119,0.3)", accent: "#DB2777" },
};

export function InsightCard({ insight }: { insight: InsightListItem }) {
  const colors = CATEGORY_COLORS[insight.category];
  const [over, setOver] = useState(false);

  return (
    // group is kept for the image zoom effect only
    <Link href={`/insights/${insight.slug}`} className="group block h-full">
      <article
        className="h-full rounded-2xl border flex flex-col overflow-hidden transition-all duration-200"
        style={{
          backgroundColor: "#FFFFFF",
          borderColor:     over ? `${colors.accent}55` : "#1E293B",
          transform:       over ? "translateY(-4px)"   : "translateY(0)",
        }}
        onMouseEnter={() => setOver(true)}
        onMouseLeave={() => setOver(false)}
      >
        {/* Featured image — 16:9 with per-category gradient fallback */}
        <div className="relative overflow-hidden flex-shrink-0" style={{ aspectRatio: "16/9" }}>
          {insight.featured_image ? (
            <Image
              src={insight.featured_image}
              alt={insight.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${colors.accent}28 0%, ${colors.accent}08 100%)`,
              }}
            />
          )}

          {/* Category pill — floats over image */}
          <div className="absolute top-3 left-3">
            <span
              className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold"
              style={{
                backgroundColor:      "rgba(8,14,26,0.82)",
                color:                colors.text,
                backdropFilter:       "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                border:               `1px solid ${colors.border}`,
              }}
            >
              {CATEGORY_LABELS[insight.category]}
            </span>
          </div>
        </div>

        {/* Card body */}
        <div className="flex flex-col flex-1 p-5 gap-3">
          {/* Reading time */}
          <span className="flex items-center gap-1 text-xs self-start" style={{ color: "#4B5563" }}>
            <Clock className="h-3 w-3" />
            {insight.reading_time} min read
          </span>

          {/* Title — color shifts to category accent on hover */}
          <h2
            className="text-base font-bold leading-snug flex-1 transition-colors duration-200"
            style={{
              fontFamily: "var(--font-serif)",
              color:      over ? colors.text : "#F9FAFB",
            }}
          >
            {insight.title}
          </h2>

          {/* Excerpt — 2 lines */}
          <p className="text-sm leading-relaxed line-clamp-2" style={{ color: "#4B5563" }}>
            {insight.excerpt}
          </p>

          {/* Footer */}
          <div
            className="flex items-center justify-between pt-3 border-t"
            style={{ borderColor: "#E2E8F0" }}
          >
            <span className="text-xs font-medium" style={{ color: "#4B5563" }}>
              {insight.author?.name ?? "Researchvy Editorial"}
            </span>
            <span className="flex items-center gap-1 text-xs" style={{ color: "#4B5563" }}>
              <Calendar className="h-3 w-3" />
              {format(new Date(insight.published_at), "MMM d, yyyy")}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
