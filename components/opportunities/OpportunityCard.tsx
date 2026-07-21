import Link from "next/link";
import { Calendar, ExternalLink, Banknote, Star, Plane } from "lucide-react";
import type { ResearchOpportunity, OpportunityCategory } from "@/types/opportunity";

const CAT_META: Record<OpportunityCategory, { label: string; color: string; bg: string }> = {
  grant:          { label: "Grant",                    color: "#10B981", bg: "rgba(16,185,129,0.1)"  },
  fellowship:     { label: "Fellowship",               color: "#8B5CF6", bg: "rgba(139,92,246,0.1)"  },
  conference:     { label: "Call for Papers",          color: "#F59E0B", bg: "rgba(245,158,11,0.1)"  },
  speaking:       { label: "Call for Speakers",        color: "#06B6D4", bg: "rgba(6,182,212,0.1)"   },
  collaboration:  { label: "Collaboration",            color: "#EC4899", bg: "rgba(236,72,153,0.1)"  },
  job:            { label: "Job / Position",           color: "#6366F1", bg: "rgba(99,102,241,0.1)"  },
  award:          { label: "Award",                    color: "#F97316", bg: "rgba(249,115,22,0.1)"  },
  "travel-grant": { label: "Travel Grant / Bursary",  color: "#22D3EE", bg: "rgba(34,211,238,0.1)"  },
  other:          { label: "Other",                    color: "#4B5563", bg: "rgba(107,114,128,0.1)" },
};

const LEVEL_LABEL: Record<string, string> = {
  early_career: "Early-Career",
  mid:          "Mid-Career",
  senior:       "Senior",
  all:          "All Levels",
};

function isExpiringSoon(deadline: string | null) {
  if (!deadline) return false;
  const daysLeft = (new Date(deadline).getTime() - Date.now()) / 86_400_000;
  return daysLeft >= 0 && daysLeft <= 7;
}

function isPast(deadline: string | null) {
  if (!deadline) return false;
  return new Date(deadline).getTime() < Date.now();
}

type Props = {
  opp: Pick<
    ResearchOpportunity,
    "id" | "title" | "body" | "category" | "funder" | "value" | "deadline" | "apply_url" |
    "target_level" | "is_featured" | "linked_event_id"
  >;
};

export function OpportunityCard({ opp }: Props) {
  const cat    = CAT_META[opp.category] ?? CAT_META.other;
  const past   = isPast(opp.deadline);
  const expiring = isExpiringSoon(opp.deadline);

  return (
    <Link
      href={`/opportunities/${opp.id}`}
      className="group block rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg relative overflow-hidden"
      style={{ backgroundColor: "#FFFFFF", borderColor: opp.is_featured ? "#7C3AED" : "#1E293B" }}
    >
      {/* Featured accent */}
      {opp.is_featured && (
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: "#7C3AED" }} />
      )}

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: cat.bg, color: cat.color }}
            >
              {cat.label}
            </span>
            {opp.is_featured && (
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full"
                style={{ backgroundColor: "rgba(124,58,237,0.12)", color: "#A78BFA" }}>
                <Star className="h-3 w-3" fill="currentColor" /> Featured
              </span>
            )}
            {opp.category === "travel-grant" && (
              <span className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-full"
                style={{ backgroundColor: "rgba(34,211,238,0.08)", color: "#22D3EE" }}>
                <Plane className="h-3 w-3" /> Travel funded
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold leading-snug mb-1 group-hover:text-blue-400 transition-colors line-clamp-2"
          style={{ color: "#111827" }}>
          {opp.title}
        </h3>

        {/* Funder */}
        {opp.funder && (
          <p className="text-xs mb-3" style={{ color: "#4B5563" }}>{opp.funder}</p>
        )}

        {/* Value */}
        {opp.value && (
          <div className="flex items-center gap-1.5 mb-3">
            <Banknote className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#10B981" }} />
            <span className="text-xs font-semibold" style={{ color: "#10B981" }}>{opp.value}</span>
          </div>
        )}

        {/* Excerpt */}
        {opp.body && (
          <p className="text-xs leading-relaxed line-clamp-2 mb-4" style={{ color: "#4B5563" }}>
            {opp.body.replace(/[#*_[\]()]/g, "").slice(0, 160)}
          </p>
        )}

        {/* Footer row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            {opp.deadline ? (
              <span className={`flex items-center gap-1 text-[11px] font-medium ${past ? "line-through" : ""}`}
                style={{ color: expiring ? "#EF4444" : past ? "#374151" : "#6B7280" }}>
                <Calendar className="h-3 w-3" />
                {/* eslint-disable-next-line react-hooks/purity */}
                {past ? "Closed" : expiring ? `${Math.ceil((new Date(opp.deadline).getTime() - Date.now()) / 86_400_000)}d left` : new Date(opp.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            ) : (
              <span className="text-[11px]" style={{ color: "#4B5563" }}>Rolling deadline</span>
            )}

            {opp.target_level && opp.target_level !== "all" && (
              <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "#F1F5F9", color: "#4B5563" }}>
                {LEVEL_LABEL[opp.target_level] ?? opp.target_level}
              </span>
            )}
          </div>

          <span className="text-[11px] font-medium flex items-center gap-1" style={{ color: "#4B5563" }}>
            {opp.apply_url.startsWith("http") ? (
              <><ExternalLink className="h-3 w-3" /> Details</>
            ) : "View →"}
          </span>
        </div>
      </div>
    </Link>
  );
}
