"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { InsightCard } from "./InsightCard";
import type { InsightListItem } from "@/types";

const INITIAL_COUNT = 6;
const INCREMENT     = 6;

interface Props {
  insights: InsightListItem[];
}

export function InsightGrid({ insights }: Props) {
  const [visible, setVisible] = useState(INITIAL_COUNT);

  const shown     = insights.slice(0, visible);
  const remaining = insights.length - visible;
  const hasMore   = remaining > 0;

  return (
    <div>
      {/* Count */}
      <p className="text-xs mb-6" style={{ color: "#4B5563" }}>
        Showing {shown.length} of {insights.length}{" "}
        {insights.length === 1 ? "article" : "articles"}
      </p>

      {/* Grid */}
      {insights.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {shown.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>

          {/* Show More */}
          {hasMore && (
            <div className="mt-10 flex flex-col items-center gap-3">
              <button
                onClick={() => setVisible((v) => v + INCREMENT)}
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  backgroundColor: "#0F172A",
                  border: "1px solid #1E293B",
                  color: "#60A5FA",
                }}
              >
                <ChevronDown className="h-4 w-4" />
                Show more
                <span
                  className="ml-1 rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{ backgroundColor: "#1E293B", color: "#6B7280" }}
                >
                  {remaining} left
                </span>
              </button>
            </div>
          )}
        </>
      ) : (
        <div
          className="rounded-2xl border p-16 flex flex-col items-center text-center"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <p className="text-2xl mb-3" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
            No articles yet
          </p>
          <p className="text-sm" style={{ color: "#6B7280" }}>
            Articles in this category are coming soon.
          </p>
        </div>
      )}
    </div>
  );
}
