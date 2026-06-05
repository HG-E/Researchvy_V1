import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { OpportunityCard } from "@/components/opportunities/OpportunityCard";
import { Search, Plus } from "lucide-react";
import type { ResearchOpportunity, OpportunityCategory } from "@/types/opportunity";

export const revalidate = 120;

export const metadata = generatePageMetadata({
  title: "Research Opportunities",
  description: "Grants, fellowships, travel bursaries, calls for papers, and speaking invitations curated for African and global researchers.",
});

const CAT_FILTERS: { value: "" | OpportunityCategory; label: string }[] = [
  { value: "",             label: "All" },
  { value: "grant",        label: "Grants" },
  { value: "fellowship",   label: "Fellowships" },
  { value: "travel-grant", label: "Travel Grants" },
  { value: "conference",   label: "Calls for Papers" },
  { value: "speaking",     label: "Calls for Speakers" },
  { value: "collaboration",label: "Collaborations" },
  { value: "job",          label: "Jobs" },
  { value: "award",        label: "Awards" },
];

type Props = { searchParams: Promise<{ category?: string; level?: string; q?: string }> };

export default async function OpportunitiesPage({ searchParams }: Props) {
  const { category = "", level = "", q = "" } = await searchParams;

  const admin = createSupabaseAdminClient();
  let query = admin
    .from("research_opportunities")
    .select("id,title,body,category,funder,value,deadline,apply_url,target_level,is_featured,auto_fetched,source_url,created_at,linked_event_id")
    .eq("is_published", true)
    .order("is_featured", { ascending: false })
    .order("deadline", { ascending: true, nullsFirst: false })
    .limit(80);

  if (category) query = query.eq("category", category);
  if (level)    query = query.eq("target_level", level);
  if (q)        query = query.or(`title.ilike.%${q}%,body.ilike.%${q}%,funder.ilike.%${q}%`);

  const { data } = await query;
  const opps = (data ?? []) as ResearchOpportunity[];

  const featured = opps.filter((o) => o.is_featured);
  const regular  = opps.filter((o) => !o.is_featured);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080E1A" }}>
      {/* Hero */}
      <section className="border-b" style={{ borderColor: "#1E293B" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
            Research Opportunities
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-3"
                style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
                Grants, Fellowships &amp;<br />Calls for Papers
              </h1>
              <p className="text-base max-w-xl" style={{ color: "#9CA3AF" }}>
                Curated opportunities for researchers at every career stage — from travel bursaries to major research grants.
              </p>
            </div>
            <Link
              href="/opportunities/submit"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold flex-shrink-0 transition-colors hover:bg-blue-700"
              style={{ backgroundColor: "#2563EB", color: "#fff" }}
            >
              <Plus className="h-4 w-4" />
              Submit an Opportunity
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <form method="GET" className="flex-1 relative">
            {category && <input type="hidden" name="category" value={category} />}
            {level    && <input type="hidden" name="level"    value={level}    />}
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: "#4B5563" }} />
            <input
              name="q"
              defaultValue={q}
              placeholder="Search grants, fellowships, funders…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ backgroundColor: "#0F172A", border: "1px solid #1E293B", color: "#F9FAFB" }}
            />
          </form>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CAT_FILTERS.map((f) => {
            const active = (f.value === "" && !category) || f.value === category;
            const params = new URLSearchParams();
            if (f.value) params.set("category", f.value);
            if (level)   params.set("level", level);
            if (q)       params.set("q", q);
            return (
              <Link
                key={f.value}
                href={`/opportunities${params.toString() ? `?${params}` : ""}`}
                className="px-4 py-2 rounded-full text-xs font-medium transition-colors"
                style={{
                  backgroundColor: active ? "#2563EB" : "#0F172A",
                  color:           active ? "#fff"    : "#6B7280",
                  border:          active ? "1px solid #2563EB" : "1px solid #1E293B",
                }}
              >
                {f.label}
              </Link>
            );
          })}
        </div>

        {/* Featured row */}
        {featured.length > 0 && !q && (
          <div className="mb-10">
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#7C3AED" }}>
              Featured Opportunities
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map((opp) => (
                <OpportunityCard key={opp.id} opp={opp} />
              ))}
            </div>
            <div className="h-px my-8" style={{ backgroundColor: "#1E293B" }} />
          </div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs" style={{ color: "#6B7280" }}>
            {opps.length} {opps.length === 1 ? "opportunity" : "opportunities"}
            {(category || q) && " matching your filters"}
          </p>
          {(category || q || level) && (
            <Link href="/opportunities" className="text-xs" style={{ color: "#2563EB" }}>Clear filters</Link>
          )}
        </div>

        {/* Grid */}
        {regular.length === 0 && featured.length === 0 ? (
          <div className="rounded-2xl border p-16 text-center" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
            <p className="text-sm mb-1" style={{ color: "#4B5563" }}>
              {(category || q) ? "No opportunities match your filters." : "No opportunities yet — check back soon."}
            </p>
            {(category || q) && (
              <Link href="/opportunities" className="text-xs mt-2 inline-block" style={{ color: "#2563EB" }}>
                Clear filters
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {regular.map((opp) => (
              <OpportunityCard key={opp.id} opp={opp} />
            ))}
          </div>
        )}

        {/* Community CTA */}
        <div className="mt-16 rounded-2xl border p-8 text-center" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
          <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#2563EB" }}>
            Know an Opportunity?
          </p>
          <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
            Help the Community
          </h3>
          <p className="text-sm max-w-md mx-auto mb-5" style={{ color: "#6B7280" }}>
            Submit a grant, fellowship, travel bursary, or CFP and we will review and publish it within 48 hours.
          </p>
          <Link
            href="/opportunities/submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-colors hover:bg-blue-700"
            style={{ backgroundColor: "#2563EB", color: "#fff" }}
          >
            <Plus className="h-4 w-4" />
            Submit an Opportunity
          </Link>
        </div>
      </div>
    </div>
  );
}
