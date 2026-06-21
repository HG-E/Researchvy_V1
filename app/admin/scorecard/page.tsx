import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { BarChart2, Mail, Users, TrendingUp, AlertCircle, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

// ── Checkpoint metadata (mirrors VisibilityScorecard.tsx) ────────────────────

const CHECKPOINTS = [
  { id: "orcid",         label: "ORCID iD",                    maxPoints: 9, dim: "Scholar Identity",       dimId: "identity"        },
  { id: "googlescholar", label: "Google Scholar",               maxPoints: 8, dim: "Scholar Identity",       dimId: "identity"        },
  { id: "scopus",        label: "Scopus Author Profile",        maxPoints: 8, dim: "Scholar Identity",       dimId: "identity"        },
  { id: "openaccess",    label: "Open Access Rate",             maxPoints: 9, dim: "Discoverability",        dimId: "discoverability" },
  { id: "keywords",      label: "Keywords & Abstracts",         maxPoints: 8, dim: "Discoverability",        dimId: "discoverability" },
  { id: "repository",    label: "Institutional Repository",     maxPoints: 8, dim: "Discoverability",        dimId: "discoverability" },
  { id: "cppratio",      label: "Citations Per Paper",          maxPoints: 9, dim: "Citation Health",        dimId: "citationhealth"  },
  { id: "hefficiency",   label: "h-index Efficiency",           maxPoints: 8, dim: "Citation Health",        dimId: "citationhealth"  },
  { id: "alerts",        label: "Citation Alert System",        maxPoints: 8, dim: "Citation Health",        dimId: "citationhealth"  },
  { id: "laysummaries",  label: "Lay Summary Practice",         maxPoints: 9, dim: "Research Communication", dimId: "communication"   },
  { id: "socialmedia",   label: "Professional Online Presence", maxPoints: 8, dim: "Research Communication", dimId: "communication"   },
  { id: "crosssector",   label: "Cross-Sector Engagement",      maxPoints: 8, dim: "Research Communication", dimId: "communication"   },
];

const DIM_COLORS: Record<string, string> = {
  identity:        "#2563EB",
  discoverability: "#7C3AED",
  citationhealth:  "#059669",
  communication:   "#D97706",
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

const STATUS_COLORS: Record<string, string> = {
  new:       "#2563EB",
  contacted: "#F59E0B",
  booked:    "#8B5CF6",
  enrolled:  "#10B981",
  lost:      "#4B5563",
};

// ── Data fetching ─────────────────────────────────────────────────────────────

interface Lead {
  id: string;
  created_at: string;
  email: string | null;
  name: string | null;
  total_score: number;
  tier: string;
  answers: Record<string, number>;
  dimension_scores: Record<string, { score: number; maxPoints: number }>;
  status: string;
}

async function getLeads(): Promise<Lead[]> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("visibility_scorecard_leads")
    .select("id, created_at, email, name, total_score, tier, answers, dimension_scores, status")
    .order("created_at", { ascending: false })
    .limit(500);
  return (data ?? []) as Lead[];
}

// ── Analytics computation ─────────────────────────────────────────────────────

function buildAnalytics(leads: Lead[]) {
  const total   = leads.length;
  const withEmail = leads.filter(l => l.email).length;
  const avgScore  = total > 0 ? Math.round(leads.reduce((a, l) => a + l.total_score, 0) / total) : 0;

  const tierCounts: Record<string, number> = { leader: 0, emerging: 0, significant_gaps: 0, invisible: 0 };
  for (const l of leads) tierCounts[l.tier] = (tierCounts[l.tier] ?? 0) + 1;

  // Per-checkpoint: count how many leads scored 0, scored max, and average pct
  const checkpointStats = CHECKPOINTS.map(cp => {
    const values = leads
      .map(l => l.answers?.[cp.id])
      .filter((v): v is number => typeof v === "number");

    const n        = values.length;
    const zeros    = values.filter(v => v === 0).length;
    const maxes    = values.filter(v => v === cp.maxPoints).length;
    const avgPct   = n > 0 ? Math.round(values.reduce((a, v) => a + (v / cp.maxPoints * 100), 0) / n) : 0;
    const zeroPct  = n > 0 ? Math.round((zeros / n) * 100) : 0;
    const maxPct   = n > 0 ? Math.round((maxes / n) * 100) : 0;

    return { ...cp, n, zeros, maxes, avgPct, zeroPct, maxPct };
  });

  // Sort by zeroPct desc = biggest gaps first
  const sortedByGap = [...checkpointStats].sort((a, b) => b.zeroPct - a.zeroPct);

  // 7-day rolling trend
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentCount  = leads.filter(l => new Date(l.created_at) > sevenDaysAgo).length;

  return { total, withEmail, avgScore, tierCounts, checkpointStats, sortedByGap, recentCount };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AdminScorecardPage() {
  const leads = await getLeads();
  const { total, withEmail, avgScore, tierCounts, checkpointStats, sortedByGap, recentCount } = buildAnalytics(leads);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1" style={{ color: "#F9FAFB" }}>
          Scorecard Leads
        </h1>
        <p className="text-sm" style={{ color: "#6B7280" }}>
          Every Visibility Scorecard completion — real-time, with full gap analytics.
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Completions",    value: total,      icon: Users,      color: "#60A5FA" },
          { label: "Email Leads Captured", value: withEmail,  icon: Mail,       color: "#34D399" },
          { label: "Average Score",        value: avgScore,   icon: BarChart2,  color: "#FBBF24", suffix: "/100" },
          { label: "Last 7 Days",          value: recentCount,icon: TrendingUp, color: "#A78BFA" },
        ].map(({ label, value, icon: Icon, color, suffix }) => (
          <div
            key={label}
            className="rounded-2xl border p-5"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Icon className="h-4 w-4" style={{ color }} />
              <p className="text-xs font-medium" style={{ color: "#6B7280" }}>{label}</p>
            </div>
            <p className="text-3xl font-bold" style={{ color: "#F9FAFB" }}>
              {value}
              {suffix && <span className="text-base font-normal ml-1" style={{ color: "#4B5563" }}>{suffix}</span>}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

        {/* Tier distribution */}
        <div
          className="rounded-2xl border p-6"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <p className="text-sm font-bold mb-5" style={{ color: "#F9FAFB" }}>Score tier distribution</p>
          <div className="space-y-3">
            {(["invisible", "significant_gaps", "emerging", "leader"] as const).map(tier => {
              const count = tierCounts[tier] ?? 0;
              const pct   = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={tier}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: TIER_COLORS[tier] }}>{TIER_LABELS[tier]}</span>
                    <span className="text-xs font-bold" style={{ color: "#F9FAFB" }}>
                      {count} <span style={{ color: "#4B5563" }}>({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ backgroundColor: "#1E293B" }}>
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: TIER_COLORS[tier] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top 5 audience gaps */}
        <div
          className="lg:col-span-2 rounded-2xl border p-6"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <div className="flex items-center gap-2 mb-5">
            <AlertCircle className="h-4 w-4" style={{ color: "#F87171" }} />
            <p className="text-sm font-bold" style={{ color: "#F9FAFB" }}>
              Biggest gaps across your audience
            </p>
          </div>
          <p className="text-xs mb-4" style={{ color: "#6B7280" }}>
            % of researchers who scored zero on each checkpoint — your most common pain points and best marketing angles.
          </p>
          <div className="space-y-3">
            {sortedByGap.slice(0, 5).map((cp, i) => (
              <div key={cp.id} className="flex items-center gap-3">
                <span className="text-xs font-bold w-5 text-right flex-shrink-0" style={{ color: "#4B5563" }}>
                  #{i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium truncate" style={{ color: "#D1D5DB" }}>{cp.label}</span>
                    <span className="text-xs font-bold ml-2 flex-shrink-0" style={{ color: "#F87171" }}>
                      {cp.zeroPct}% score 0
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: "#1E293B" }}>
                    <div
                      className="h-1.5 rounded-full"
                      style={{ width: `${cp.zeroPct}%`, backgroundColor: DIM_COLORS[cp.dimId] }}
                    />
                  </div>
                  <p className="text-[10px] mt-0.5" style={{ color: "#4B5563" }}>{cp.dim}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full checkpoint analytics table */}
      <div
        className="rounded-2xl border mb-8"
        style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
      >
        <div className="p-6 border-b" style={{ borderColor: "#1E293B" }}>
          <p className="text-sm font-bold" style={{ color: "#F9FAFB" }}>All 12 checkpoints — audience performance</p>
          <p className="text-xs mt-1" style={{ color: "#6B7280" }}>
            Use this to target marketing messages, plan consultation topics, and identify where the clinic adds the most value.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid #1E293B" }}>
                {["Checkpoint", "Dimension", "Avg Score", "Score 0 (Gap)", "Score Max (Strength)", "Responses"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold" style={{ color: "#4B5563" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {checkpointStats.map(cp => (
                <tr key={cp.id} style={{ borderBottom: "1px solid #1E293B" }}>
                  <td className="px-5 py-3">
                    <p className="text-xs font-medium" style={{ color: "#D1D5DB" }}>{cp.label}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: DIM_COLORS[cp.dimId] + "20",
                        color: DIM_COLORS[cp.dimId],
                      }}
                    >
                      {cp.dim}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: "#1E293B" }}>
                        <div
                          className="h-1.5 rounded-full"
                          style={{ width: `${cp.avgPct}%`, backgroundColor: DIM_COLORS[cp.dimId] }}
                        />
                      </div>
                      <span className="text-xs font-bold" style={{ color: "#F9FAFB" }}>{cp.avgPct}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className="text-xs font-bold"
                      style={{ color: cp.zeroPct > 50 ? "#F87171" : cp.zeroPct > 25 ? "#F59E0B" : "#6B7280" }}
                    >
                      {cp.zeroPct}%
                    </span>
                    <span className="text-xs ml-1" style={{ color: "#4B5563" }}>({cp.zeros})</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-bold" style={{ color: "#10B981" }}>{cp.maxPct}%</span>
                    <span className="text-xs ml-1" style={{ color: "#4B5563" }}>({cp.maxes})</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs" style={{ color: "#6B7280" }}>{cp.n}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leads table */}
      <div
        className="rounded-2xl border"
        style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
      >
        <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: "#1E293B" }}>
          <p className="text-sm font-bold" style={{ color: "#F9FAFB" }}>All leads ({total})</p>
          <p className="text-xs" style={{ color: "#4B5563" }}>Click any row to see full answers + take action</p>
        </div>

        {total === 0 ? (
          <div className="p-12 text-center">
            <BarChart2 className="h-8 w-8 mx-auto mb-3" style={{ color: "#1E293B" }} />
            <p className="text-sm" style={{ color: "#4B5563" }}>No scorecard completions yet.</p>
            <p className="text-xs mt-1" style={{ color: "#374151" }}>
              Share the scorecard link and leads will appear here in real time.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid #1E293B" }}>
                  {["Researcher", "Score", "Tier", "Status", "Date", ""].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold" style={{ color: "#4B5563" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => (
                  <tr
                    key={lead.id}
                    style={{ borderBottom: "1px solid #0F1929" }}
                    className="hover:bg-[#0F1929] transition-colors"
                  >
                    <td className="px-5 py-3">
                      <p className="text-xs font-medium" style={{ color: lead.name ? "#F9FAFB" : "#4B5563" }}>
                        {lead.name ?? "Anonymous"}
                      </p>
                      {lead.email && (
                        <p className="text-[11px] mt-0.5" style={{ color: "#60A5FA" }}>{lead.email}</p>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm font-bold" style={{ color: TIER_COLORS[lead.tier] ?? "#6B7280" }}>
                        {lead.total_score}
                      </span>
                      <span className="text-xs ml-0.5" style={{ color: "#4B5563" }}>/100</span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: (TIER_COLORS[lead.tier] ?? "#6B7280") + "20",
                          color: TIER_COLORS[lead.tier] ?? "#6B7280",
                        }}
                      >
                        {TIER_LABELS[lead.tier] ?? lead.tier}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
                        style={{
                          backgroundColor: (STATUS_COLORS[lead.status] ?? "#4B5563") + "20",
                          color: STATUS_COLORS[lead.status] ?? "#4B5563",
                        }}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs" style={{ color: "#6B7280" }}>
                        {new Date(lead.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/scorecard/${lead.id}`}
                        className="flex items-center gap-1 text-xs font-medium transition-colors hover:text-white"
                        style={{ color: "#4B5563" }}
                      >
                        View <ChevronRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
