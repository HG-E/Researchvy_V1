import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { createSupabaseAdminClient, getServerUser } from "@/lib/auth/supabase";
import { Calendar, ExternalLink, Award, Zap, Users, Mic, Briefcase, BookOpen, Globe, Plane, Clock, XCircle, Plus } from "lucide-react";

export const dynamic  = "force-dynamic";
export const metadata = generatePageMetadata({ title: "Research Opportunities", noIndex: true });

type Opp = {
  id: string; title: string; body: string; category: string;
  funder: string | null; value: string | null; deadline: string | null;
  apply_url: string; target_level: string; is_featured: boolean;
  submitted_by: string | null; submission_status: string | null;
};

const CAT_META: Record<string, { label: string; color: string; Icon: React.ElementType }> = {
  grant:         { label: "Grant",                   color: "#10B981", Icon: BookOpen  },
  fellowship:    { label: "Fellowship",              color: "#8B5CF6", Icon: Award     },
  conference:    { label: "Call for Papers",         color: "#F59E0B", Icon: Users     },
  speaking:      { label: "Call for Speakers",       color: "#06B6D4", Icon: Mic       },
  collaboration: { label: "Collaboration",           color: "#EC4899", Icon: Users     },
  job:           { label: "Job / Position",          color: "#6366F1", Icon: Briefcase },
  award:         { label: "Award / Prize",           color: "#F97316", Icon: Zap       },
  "travel-grant":{ label: "Travel Grant / Bursary", color: "#22D3EE", Icon: Plane     },
  other:         { label: "Other",                   color: "#6B7280", Icon: Globe     },
};

const LEVEL_LABEL: Record<string, string> = {
  all:          "All career stages",
  early_career: "Early-career",
  mid:          "Mid-career",
  senior:       "Senior researcher",
};

const SUBMISSION_STATUS: Record<string, { label: string; color: string; Icon: React.ElementType }> = {
  pending:   { label: "Under review",  color: "#F59E0B", Icon: Clock    },
  rejected:  { label: "Not published", color: "#F87171", Icon: XCircle  },
};

function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
}

type Props = { searchParams: Promise<{ category?: string; q?: string }> };

export default async function OpportunitiesPage({ searchParams }: Props) {
  const { category = "", q = "" } = await searchParams;

  const user  = await getServerUser();
  const admin = createSupabaseAdminClient();

  // Published opportunities (for everyone)
  let query = admin
    .from("research_opportunities")
    .select("id,title,body,category,funder,value,deadline,apply_url,target_level,is_featured,submitted_by,submission_status")
    .eq("is_published", true)
    .order("is_featured", { ascending: false })
    .order("deadline",    { ascending: true,  nullsFirst: false })
    .order("created_at",  { ascending: false })
    .limit(100);

  if (category) query = query.eq("category", category);
  if (q)        query = query.or(`title.ilike.%${q}%,body.ilike.%${q}%,funder.ilike.%${q}%`);

  const { data } = await query;
  const opps     = (data ?? []) as Opp[];
  const featured  = opps.filter((o) => o.is_featured);
  const rest      = opps.filter((o) => !o.is_featured);

  // User's own pending/rejected submissions
  let mySubmissions: Opp[] = [];
  if (user) {
    const { data: mine } = await admin
      .from("research_opportunities")
      .select("id,title,body,category,funder,value,deadline,apply_url,target_level,is_featured,submitted_by,submission_status")
      .eq("submitted_by", user.id)
      .neq("submission_status", "published")
      .order("created_at", { ascending: false });
    mySubmissions = (mine ?? []) as Opp[];
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>
            Dashboard
          </p>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
            Research Opportunities
          </h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            Curated grants, fellowships, conferences, and collaboration calls.
          </p>
        </div>
        <Link
          href="/opportunities/submit"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white whitespace-nowrap flex-shrink-0"
          style={{ backgroundColor: "#2563EB" }}
        >
          <Plus className="h-4 w-4" />
          Submit One
        </Link>
      </div>

      {/* My Submissions section */}
      {mySubmissions.length > 0 && (
        <div className="rounded-2xl border p-5" style={{ backgroundColor: "rgba(245,158,11,0.04)", borderColor: "rgba(245,158,11,0.2)" }}>
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#F59E0B" }}>
            My Submissions
          </p>
          <div className="space-y-3">
            {mySubmissions.map((opp) => {
              const meta   = CAT_META[opp.category] ?? CAT_META.other;
              const status = opp.submission_status ? (SUBMISSION_STATUS[opp.submission_status] ?? null) : null;
              return (
                <div key={opp.id} className="rounded-xl border p-4 flex items-center justify-between gap-4"
                  style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate mb-1" style={{ color: "#F9FAFB" }}>{opp.title}</p>
                    <span className="text-[11px] px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${meta.color}18`, color: meta.color }}>
                      {meta.label}
                    </span>
                  </div>
                  {status && (
                    <div className="flex items-center gap-1.5 flex-shrink-0 text-xs font-medium rounded-lg px-2.5 py-1.5"
                      style={{ backgroundColor: `${status.color}12`, color: status.color }}>
                      <status.Icon className="h-3 w-3" />
                      {status.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-xs mt-3" style={{ color: "#4B5563" }}>
            Approved submissions appear in the board below and are visible to all researchers.
          </p>
        </div>
      )}

      {/* Search */}
      <form method="GET" action="/dashboard/opportunities" className="relative">
        {category && <input type="hidden" name="category" value={category} />}
        <input
          name="q"
          defaultValue={q}
          placeholder="Search opportunities…"
          className="w-full pl-4 pr-4 py-2.5 rounded-xl text-sm outline-none"
          style={{ backgroundColor: "#0F172A", border: "1px solid #1E293B", color: "#F9FAFB" }}
        />
      </form>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {[{ value: "", label: "All" }, ...Object.entries(CAT_META).map(([k, v]) => ({ value: k, label: v.label }))].map(({ value: val, label }) => {
          const active = val === "" ? !category : category === val;
          const params = new URLSearchParams();
          if (val)  params.set("category", val);
          if (q)    params.set("q", q);
          return (
            <Link
              key={val}
              href={`/dashboard/opportunities${params.toString() ? `?${params}` : ""}`}
              className="text-xs px-3 py-1.5 rounded-full font-medium transition-colors"
              style={{
                backgroundColor: active ? "#2563EB" : "rgba(31,41,55,0.8)",
                color:           active ? "#fff" : "#6B7280",
                border:          active ? "1px solid #2563EB" : "1px solid #1E293B",
              }}
            >
              {label}
            </Link>
          );
        })}
        {(category || q) && (
          <Link href="/dashboard/opportunities" className="text-xs px-3 py-1.5 rounded-full font-medium"
            style={{ backgroundColor: "transparent", color: "#4B5563", border: "1px solid #1E293B" }}>
            Clear ×
          </Link>
        )}
      </div>

      {opps.length === 0 ? (
        <div className="rounded-2xl border p-12 text-center" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(37,99,235,0.1)" }}>
            <Globe className="h-7 w-7" style={{ color: "#2563EB" }} />
          </div>
          {(category || q) ? (
            <>
              <h2 className="text-base font-semibold mb-2" style={{ color: "#F9FAFB" }}>No results</h2>
              <p className="text-sm max-w-sm mx-auto mb-4" style={{ color: "#6B7280" }}>
                Try a different filter or search term.
              </p>
              <Link href="/dashboard/opportunities" className="text-sm font-medium" style={{ color: "#2563EB" }}>
                Clear filters
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-base font-semibold mb-2" style={{ color: "#F9FAFB" }}>First batch coming soon</h2>
              <p className="text-sm max-w-sm mx-auto" style={{ color: "#6B7280" }}>
                We curate and review every opportunity before publishing. Check back on Sunday — our weekly fetch runs automatically.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-10">
          {/* Featured */}
          {featured.length > 0 && !q && (
            <section>
              <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#F59E0B" }}>
                ⭐ Featured This Week
              </p>
              <div className="space-y-4">
                {featured.map((opp) => <OppCard key={opp.id} opp={opp} featured />)}
              </div>
            </section>
          )}

          {/* All opportunities */}
          {rest.length > 0 && (
            <section>
              {featured.length > 0 && !q && (
                <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#4B5563" }}>
                  All Opportunities
                </p>
              )}
              <div className="space-y-4">
                {rest.map((opp) => <OppCard key={opp.id} opp={opp} />)}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Submit CTA */}
      <div className="rounded-2xl border p-5" style={{ backgroundColor: "#0A0F1A", borderColor: "#1E293B" }}>
        <p className="text-xs font-semibold mb-1" style={{ color: "#F9FAFB" }}>Know of an opportunity we should feature?</p>
        <p className="text-xs mb-3" style={{ color: "#4B5563" }}>
          Submit a grant, fellowship, travel bursary, or CFP and we will review and publish it within 48 hours.
        </p>
        <Link href="/opportunities/submit" className="inline-flex items-center gap-1.5 text-xs font-semibold"
          style={{ color: "#2563EB" }}>
          <Plus className="h-3 w-3" /> Submit an Opportunity →
        </Link>
      </div>
    </div>
  );
}

function stripMd(text: string): string {
  return text
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\(.*?\)/g, "$1")
    .replace(/#{1,6}\s+/g, "")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/^[-*>]\s+/gm, "")
    .replace(/\n{2,}/g, " ")
    .trim();
}

function OppCard({ opp, featured = false }: { opp: Opp; featured?: boolean }) {
  const meta  = CAT_META[opp.category] ?? CAT_META.other;
  const Icon  = meta.Icon;
  const days  = opp.deadline ? daysUntil(opp.deadline) : null;
  const urgent = days !== null && days <= 14;

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-colors"
      style={{
        backgroundColor: featured ? "rgba(37,99,235,0.04)" : "#0F172A",
        borderColor:     featured ? "rgba(37,99,235,0.25)" : "#1E293B",
      }}
    >
      {featured && <div className="h-0.5" style={{ background: "linear-gradient(90deg,#2563EB,#10B981)" }} />}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: `${meta.color}15` }}>
              <Icon className="h-4 w-4" style={{ color: meta.color }} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center flex-wrap gap-2 mb-1">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${meta.color}15`, color: meta.color }}>
                  {meta.label}
                </span>
                <span className="text-[11px]" style={{ color: "#4B5563" }}>
                  {LEVEL_LABEL[opp.target_level] ?? "All career stages"}
                </span>
              </div>

              <h3 className="text-sm font-semibold leading-snug mb-1" style={{ color: "#F9FAFB" }}>
                {opp.title}
              </h3>

              {(opp.funder || opp.value) && (
                <div className="flex items-center gap-3 mb-2">
                  {opp.funder && <span className="text-xs" style={{ color: "#6B7280" }}>{opp.funder}</span>}
                  {opp.value  && <span className="text-xs font-semibold" style={{ color: "#10B981" }}>{opp.value}</span>}
                </div>
              )}

              <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "#4B5563" }}>
                {stripMd(opp.body).slice(0, 200)}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {opp.deadline && (
              <div className="flex items-center gap-1 text-xs rounded-lg px-2.5 py-1"
                style={{
                  backgroundColor: urgent ? "rgba(239,68,68,0.08)" : "rgba(31,41,55,0.8)",
                  color:           urgent ? "#F87171" : "#6B7280",
                }}>
                <Calendar className="h-3 w-3" />
                {urgent ? `${days}d left` : new Date(opp.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              </div>
            )}
            <Link
              href={`/opportunities/${opp.id}`}
              className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold min-h-[36px]"
              style={{ backgroundColor: "rgba(37,99,235,0.1)", color: "#60A5FA" }}
            >
              View <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
