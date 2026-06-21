import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { ScorecardLeadActions } from "./ScorecardLeadActions";
import { ArrowLeft, Mail, MessageCircle, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

const CHECKPOINTS = [
  { id: "orcid",         label: "ORCID iD",                    maxPoints: 9, dim: "Scholar Identity",       dimColor: "#2563EB" },
  { id: "googlescholar", label: "Google Scholar",               maxPoints: 8, dim: "Scholar Identity",       dimColor: "#2563EB" },
  { id: "scopus",        label: "Scopus Author Profile",        maxPoints: 8, dim: "Scholar Identity",       dimColor: "#2563EB" },
  { id: "openaccess",    label: "Open Access Rate",             maxPoints: 9, dim: "Discoverability",        dimColor: "#7C3AED" },
  { id: "keywords",      label: "Keywords & Abstracts",         maxPoints: 8, dim: "Discoverability",        dimColor: "#7C3AED" },
  { id: "repository",    label: "Institutional Repository",     maxPoints: 8, dim: "Discoverability",        dimColor: "#7C3AED" },
  { id: "cppratio",      label: "Citations Per Paper",          maxPoints: 9, dim: "Citation Health",        dimColor: "#059669" },
  { id: "hefficiency",   label: "h-index Efficiency",           maxPoints: 8, dim: "Citation Health",        dimColor: "#059669" },
  { id: "alerts",        label: "Citation Alert System",        maxPoints: 8, dim: "Citation Health",        dimColor: "#059669" },
  { id: "laysummaries",  label: "Lay Summary Practice",         maxPoints: 9, dim: "Research Communication", dimColor: "#D97706" },
  { id: "socialmedia",   label: "Professional Online Presence", maxPoints: 8, dim: "Research Communication", dimColor: "#D97706" },
  { id: "crosssector",   label: "Cross-Sector Engagement",      maxPoints: 8, dim: "Research Communication", dimColor: "#D97706" },
];

const DIM_COLORS: Record<string, string> = {
  identity:        "#2563EB",
  discoverability: "#7C3AED",
  citationhealth:  "#059669",
  communication:   "#D97706",
};

const DIM_LABELS: Record<string, string> = {
  identity:        "Scholar Identity",
  discoverability: "Discoverability Infrastructure",
  citationhealth:  "Citation Health",
  communication:   "Research Communication",
};

const TIER_COLORS: Record<string, string> = {
  leader:           "#10B981",
  emerging:         "#F59E0B",
  significant_gaps: "#F97316",
  invisible:        "#EF4444",
};

const TIER_LABELS: Record<string, string> = {
  leader:           "Visibility Leader",
  emerging:         "Emerging",
  significant_gaps: "Significant Gaps",
  invisible:        "Invisible",
};

interface Lead {
  id: string;
  created_at: string;
  email: string | null;
  name: string | null;
  total_score: number;
  tier: string;
  answers: Record<string, number>;
  dimension_scores: Record<string, { score: number; maxPoints: number }>;
  source: string | null;
  status: string;
  admin_notes: string | null;
  notified_at: string | null;
}

async function getLead(id: string): Promise<Lead | null> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("visibility_scorecard_leads")
    .select("*")
    .eq("id", id)
    .single();
  return data as Lead | null;
}

export default async function ScorecardLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) notFound();

  const color    = TIER_COLORS[lead.tier] ?? "#6B7280";
  const tLabel   = TIER_LABELS[lead.tier] ?? lead.tier;
  const answers  = (lead.answers ?? {}) as Record<string, number>;

  const waText   = lead.email
    ? encodeURIComponent(`Hi ${lead.name?.split(" ")[0] ?? "there"}, I noticed you scored ${lead.total_score}/100 on the Researcher Visibility Scorecard. I'd love to help you close those gaps — got 20 minutes this week?`)
    : encodeURIComponent(`Hi, I wanted to follow up about the Researcher Visibility Scorecard you completed.`);
  const waUrl    = `https://wa.me/2347030515183?text=${waText}`;

  return (
    <div>
      {/* Back nav */}
      <Link
        href="/admin/scorecard"
        className="inline-flex items-center gap-1.5 text-sm mb-6 transition-colors hover:text-white"
        style={{ color: "#6B7280" }}
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All Scorecard Leads
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: full profile */}
        <div className="lg:col-span-2 space-y-5">

          {/* Score reveal */}
          <div
            className="rounded-2xl border p-6 flex items-center gap-6"
            style={{ backgroundColor: color + "10", borderColor: color + "30" }}
          >
            <div className="text-center min-w-[80px]">
              <p className="text-5xl font-bold leading-none" style={{ color: "#F9FAFB" }}>
                {lead.total_score}
              </p>
              <p className="text-xs mt-1 font-semibold" style={{ color }}>/ 100</p>
            </div>
            <div>
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full mb-2 inline-block"
                style={{ backgroundColor: color + "20", color }}
              >
                {tLabel}
              </span>
              <p className="text-base font-bold" style={{ color: "#F9FAFB" }}>
                {lead.name ?? "Anonymous Researcher"}
              </p>
              {lead.email && (
                <p className="text-sm mt-0.5" style={{ color: "#60A5FA" }}>{lead.email}</p>
              )}
              <p className="text-xs mt-1" style={{ color: "#4B5563" }}>
                Completed {new Date(lead.created_at).toLocaleDateString("en-GB", {
                  weekday: "long", day: "numeric", month: "long", year: "numeric",
                })}
                {lead.source && ` · from ${lead.source}`}
              </p>
            </div>
          </div>

          {/* Dimension breakdown */}
          <div
            className="rounded-2xl border p-6"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            <p className="text-sm font-bold mb-5" style={{ color: "#F9FAFB" }}>Dimension breakdown</p>
            <div className="space-y-4">
              {Object.entries(lead.dimension_scores ?? {}).map(([id, d]) => {
                const pct = d.maxPoints > 0 ? Math.round((d.score / d.maxPoints) * 100) : 0;
                const c   = DIM_COLORS[id] ?? "#6B7280";
                return (
                  <div key={id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium" style={{ color: "#9CA3AF" }}>
                        {DIM_LABELS[id] ?? id}
                      </span>
                      <span className="text-xs font-bold" style={{ color: c }}>
                        {d.score}/{d.maxPoints} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ backgroundColor: "#1E293B" }}>
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: c }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Per-checkpoint answers */}
          <div
            className="rounded-2xl border"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            <div className="p-5 border-b" style={{ borderColor: "#1E293B" }}>
              <p className="text-sm font-bold" style={{ color: "#F9FAFB" }}>All 12 checkpoints</p>
            </div>
            <div className="divide-y" style={{ "--tw-divide-opacity": 1 } as React.CSSProperties}>
              {CHECKPOINTS.map(cp => {
                const val    = answers[cp.id] ?? null;
                const isNull = val === null;
                const pct    = isNull ? 0 : Math.round((val / cp.maxPoints) * 100);
                const isZero = val === 0;
                const isMax  = val === cp.maxPoints;
                return (
                  <div
                    key={cp.id}
                    className="px-5 py-4 flex items-center gap-4"
                    style={{ borderColor: "#1E293B" }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium" style={{ color: "#D1D5DB" }}>{cp.label}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: "#4B5563" }}>{cp.dim}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="w-20 h-1.5 rounded-full" style={{ backgroundColor: "#1E293B" }}>
                        <div
                          className="h-1.5 rounded-full"
                          style={{ width: `${pct}%`, backgroundColor: cp.dimColor }}
                        />
                      </div>
                      <span
                        className="text-xs font-bold w-16 text-right"
                        style={{
                          color: isNull ? "#374151" : isZero ? "#F87171" : isMax ? "#10B981" : "#F9FAFB",
                        }}
                      >
                        {isNull ? "—" : `${val}/${cp.maxPoints}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: actions panel */}
        <div className="space-y-5">

          {/* Quick contact */}
          <div
            className="rounded-2xl border p-5"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#4B5563" }}>
              Contact this lead
            </p>
            <div className="space-y-2">
              {lead.email && (
                <a
                  href={`mailto:${lead.email}`}
                  className="flex items-center gap-2 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-[#1E293B]"
                  style={{ backgroundColor: "#1E293B", color: "#F9FAFB" }}
                >
                  <Mail className="h-4 w-4" style={{ color: "#60A5FA" }} />
                  Send email
                </a>
              )}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors"
                style={{ backgroundColor: "#25D366", color: "#fff" }}
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp follow-up
                <ExternalLink className="h-3 w-3 ml-auto opacity-60" />
              </a>
              <Link
                href="/clinics/digital-visibility-clinic"
                target="_blank"
                className="flex items-center gap-2 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors"
                style={{ backgroundColor: "#2563EB", color: "#fff" }}
              >
                Share clinic link
                <ExternalLink className="h-3 w-3 ml-auto opacity-60" />
              </Link>
            </div>
          </div>

          {/* Status + notes — client component */}
          <ScorecardLeadActions
            leadId={lead.id}
            currentStatus={lead.status}
            currentNotes={lead.admin_notes ?? ""}
          />

          {/* Meta */}
          <div
            className="rounded-2xl border p-5 space-y-3"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#4B5563" }}>
              Lead metadata
            </p>
            {[
              ["Lead ID",        lead.id.split("-")[0] + "…"],
              ["Source",         lead.source ?? "Direct"],
              ["Email captured", lead.email ? "Yes" : "No (anonymous)"],
              ["Notified at",    lead.notified_at
                ? new Date(lead.notified_at).toLocaleDateString("en-GB")
                : "Not yet"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-start justify-between gap-2">
                <span className="text-xs" style={{ color: "#4B5563" }}>{label}</span>
                <span className="text-xs font-medium text-right" style={{ color: "#9CA3AF" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
