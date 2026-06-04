import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { ExternalLink, Calendar, Award, Mic, Users, Briefcase, Globe, Star } from "lucide-react";

export const dynamic  = "force-dynamic";
export const metadata = generatePageMetadata({ title: "Research Opportunities", noIndex: true });

type Opportunity = {
  id:           string;
  title:        string;
  body:         string;
  category:     string;
  funder:       string | null;
  value:        string | null;
  deadline:     string | null;
  apply_url:    string;
  target_level: string;
  is_featured:  boolean;
};

type LucideIcon = React.ComponentType<{ className?: string; style?: React.CSSProperties }>;

const CATEGORY_META: Record<string, { label: string; color: string; Icon: LucideIcon }> = {
  grant:         { label: "Grant",          color: "#10B981", Icon: Award       },
  fellowship:    { label: "Fellowship",     color: "#8B5CF6", Icon: Star        },
  conference:    { label: "Conference",     color: "#2563EB", Icon: Users       },
  speaking:      { label: "Speaking",       color: "#F59E0B", Icon: Mic         },
  collaboration: { label: "Collaboration",  color: "#06B6D4", Icon: Globe       },
  job:           { label: "Job",            color: "#F472B6", Icon: Briefcase   },
  award:         { label: "Award",          color: "#FCD34D", Icon: Award       },
  other:         { label: "Opportunity",    color: "#6B7280", Icon: ExternalLink},
};

const LEVEL_LABELS: Record<string, string> = {
  all:          "All career stages",
  early_career: "Early-career researchers",
  mid:          "Mid-career researchers",
  senior:       "Senior researchers",
};

function daysUntil(deadline: string): number {
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / 86_400_000);
}

function DeadlineBadge({ deadline }: { deadline: string | null }) {
  if (!deadline) return (
    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#10B981" }}>
      Rolling deadline
    </span>
  );
  const days = daysUntil(deadline);
  const date = new Date(deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  if (days < 0) return (
    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(107,114,128,0.1)", color: "#6B7280" }}>
      Closed {date}
    </span>
  );
  const urgent = days <= 14;
  return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{
      backgroundColor: urgent ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)",
      color: urgent ? "#F87171" : "#F59E0B",
    }}>
      <Calendar className="inline h-3 w-3 mr-1" />
      {urgent ? `${days}d left` : date}
    </span>
  );
}

export default async function OpportunitiesPage() {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("research_opportunities")
    .select("id,title,body,category,funder,value,deadline,apply_url,target_level,is_featured")
    .eq("is_published", true)
    .order("is_featured", { ascending: false })
    .order("deadline", { ascending: true, nullsFirst: false })
    .limit(100);

  const opps = (data ?? []) as Opportunity[];
  const featured  = opps.filter((o) => o.is_featured);
  const byCategory = Object.fromEntries(
    Object.keys(CATEGORY_META).map((cat) => [cat, opps.filter((o) => o.category === cat && !o.is_featured)])
  );
  const hasAny = opps.length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-10">

      {/* Header */}
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>
          Dashboard
        </p>
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
          Research Opportunities
        </h1>
        <p className="text-sm" style={{ color: "#6B7280" }}>
          Curated grants, fellowships, speaking invitations, and collaboration calls — updated weekly.
        </p>
      </div>

      {!hasAny ? (
        <div className="rounded-2xl border p-12 text-center" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
          <Globe className="h-10 w-10 mx-auto mb-4" style={{ color: "#2563EB" }} />
          <h2 className="text-lg font-bold mb-2" style={{ color: "#F9FAFB" }}>Opportunities loading soon</h2>
          <p className="text-sm max-w-md mx-auto" style={{ color: "#6B7280" }}>
            We're curating the first batch of grants, fellowships, and collaboration calls for African researchers.
            Check back shortly — new opportunities are added weekly.
          </p>
        </div>
      ) : (
        <>
          {/* Featured */}
          {featured.length > 0 && (
            <section>
              <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#F59E0B" }}>
                ⭐ Featured
              </p>
              <div className="grid gap-4">
                {featured.map((opp) => <OppCard key={opp.id} opp={opp} featured />)}
              </div>
            </section>
          )}

          {/* By category */}
          {Object.entries(CATEGORY_META).map(([cat, meta]) => {
            const list = byCategory[cat] ?? [];
            if (list.length === 0) return null;
            return (
              <section key={cat}>
                <div className="flex items-center gap-2 mb-4">
                  <meta.Icon className="h-4 w-4" style={{ color: meta.color }} />
                  <p className="text-sm font-bold" style={{ color: "#F9FAFB" }}>{meta.label}s</p>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#1E293B", color: "#6B7280" }}>
                    {list.length}
                  </span>
                </div>
                <div className="grid gap-4">
                  {list.map((opp) => <OppCard key={opp.id} opp={opp} />)}
                </div>
              </section>
            );
          })}
        </>
      )}

      <div className="text-center pt-4 border-t" style={{ borderColor: "#1E293B" }}>
        <p className="text-xs" style={{ color: "#374151" }}>
          Know of an opportunity we should feature?{" "}
          <a href="mailto:info@researchvy.com?subject=Opportunity Submission" style={{ color: "#4B5563", textDecoration: "underline" }}>
            Submit it here
          </a>
        </p>
      </div>
    </div>
  );
}

function OppCard({ opp, featured = false }: { opp: Opportunity; featured?: boolean }) {
  const meta = CATEGORY_META[opp.category] ?? CATEGORY_META.other;
  const Icon = meta.Icon;

  return (
    <div
      className="rounded-2xl border p-5"
      style={{
        backgroundColor: featured ? "rgba(37,99,235,0.04)" : "#0F172A",
        borderColor: featured ? "rgba(37,99,235,0.25)" : "#1E293B",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${meta.color}15`, color: meta.color }}>
              <Icon className="inline h-3 w-3 mr-1" />{meta.label}
            </span>
            <DeadlineBadge deadline={opp.deadline} />
            {opp.value && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#10B981" }}>
                {opp.value}
              </span>
            )}
          </div>

          <h3 className="text-sm font-bold mb-1 leading-snug" style={{ color: "#F9FAFB" }}>{opp.title}</h3>

          {opp.funder && (
            <p className="text-xs mb-2" style={{ color: "#4B5563" }}>{opp.funder}</p>
          )}

          <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: "#6B7280" }}>{opp.body}</p>

          <div className="flex items-center gap-4">
            <a
              href={opp.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-2 transition-opacity hover:opacity-90 min-h-[36px]"
              style={{ backgroundColor: "#2563EB", color: "#fff" }}
            >
              Apply / Learn More <ExternalLink className="h-3 w-3" />
            </a>
            <span className="text-xs" style={{ color: "#374151" }}>
              {LEVEL_LABELS[opp.target_level] ?? "All researchers"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
