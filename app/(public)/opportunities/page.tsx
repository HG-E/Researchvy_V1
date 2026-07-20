import { Suspense } from "react";
import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { OpportunityCard } from "@/components/opportunities/OpportunityCard";
import { Search, Plus } from "lucide-react";
import type { ResearchOpportunity, OpportunityCategory } from "@/types/opportunity";

export const revalidate = 60;

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

// ── Streamed results component ────────────────────────────────────────────────

async function OpportunitiesResults({
  category, level, q,
}: {
  category: string; level: string; q: string;
}) {
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
  const opps    = (data ?? []) as ResearchOpportunity[];
  const featured = opps.filter((o) => o.is_featured);
  const regular  = opps.filter((o) => !o.is_featured);

  return (
    <>
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
          <div className="h-px my-8" style={{ backgroundColor: "#F1F5F9" }} />
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
        (category || q) ? (
          <div className="rounded-2xl border p-14 text-center" style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}>
            <p className="text-sm mb-3" style={{ color: "#6B7280" }}>No opportunities match your filters.</p>
            <Link href="/opportunities" className="text-xs font-semibold" style={{ color: "#2563EB" }}>
              Clear filters →
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            <div
              className="rounded-2xl border p-10 sm:p-14 text-center"
              style={{ backgroundColor: "rgba(16,185,129,0.03)", borderColor: "rgba(16,185,129,0.18)" }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ backgroundColor: "rgba(16,185,129,0.1)" }}
              >
                <Plus className="h-8 w-8" style={{ color: "#10B981" }} />
              </div>
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#10B981" }}>
                Coming soon
              </p>
              <h2 className="text-xl sm:text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-serif)", color: "#111827" }}>
                Grants &amp; fellowships are being curated
              </h2>
              <p className="text-sm max-w-lg mx-auto mb-6 leading-relaxed" style={{ color: "#6B7280" }}>
                We're building a comprehensive database of grants, fellowships, travel bursaries, and
                calls for papers — curated specifically for African and global researchers. Know one? Submit it free.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link href="/opportunities/submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white"
                  style={{ backgroundColor: "#10B981" }}>
                  <Plus className="h-4 w-4" />
                  Submit an Opportunity — Free
                </Link>
                <Link href="/resources#newsletter"
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold border"
                  style={{ borderColor: "#E2E8F0", color: "#374151" }}>
                  Get weekly opportunities by email
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { title: "Free to submit", desc: "Share a grant, fellowship, or CFP with the community at no cost.", color: "#10B981" },
                { title: "Published in 48 hrs", desc: "Every submission is manually reviewed and listed within 2 business days.", color: "#2563EB" },
                { title: "Maximise applications", desc: "Take the visibility scorecard first — know your score before applying.", color: "#7C3AED" },
              ].map(({ title, desc, color }) => (
                <div key={title} className="rounded-xl border p-5" style={{ borderColor: "#E2E8F0", backgroundColor: "#FAFBFC" }}>
                  <div className="w-2 h-2 rounded-full mb-3" style={{ backgroundColor: color }} />
                  <p className="text-sm font-semibold mb-1" style={{ color: "#111827" }}>{title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {regular.map((opp) => (
            <OpportunityCard key={opp.id} opp={opp} />
          ))}
        </div>
      )}
    </>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────

function OpportunitiesLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" aria-label="Loading opportunities…">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border animate-pulse"
          style={{ height: 200, backgroundColor: "#F8FAFC", borderColor: "#E2E8F0" }}
        />
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

type Props = { searchParams: Promise<{ category?: string; level?: string; q?: string }> };

export default async function OpportunitiesPage({ searchParams }: Props) {
  const { category = "", level = "", q = "" } = await searchParams;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      {/* Hero */}
      <section className="border-b" style={{ borderColor: "#E2E8F0" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
            Research Opportunities
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-3"
                style={{ fontFamily: "var(--font-serif)", color: "#111827" }}>
                Grants, Fellowships &amp;<br />Calls for Papers
              </h1>
              <p className="text-base max-w-xl" style={{ color: "#6B7280" }}>
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

        {/* Scorecard strip */}
        <div
          className="rounded-xl border px-5 py-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ backgroundColor: "rgba(16,185,129,0.04)", borderColor: "rgba(16,185,129,0.15)" }}
        >
          <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
            <span className="font-semibold" style={{ color: "#111827" }}>Maximise your application success</span>
            {" "}— know your visibility score across Scholar Identity, Discoverability, and Citation Health before you apply.
          </p>
          <Link
            href="/resources/visibility-scorecard"
            className="inline-flex items-center gap-1.5 text-xs font-bold whitespace-nowrap flex-shrink-0 rounded-lg px-4 py-2 text-white"
            style={{ backgroundColor: "#10B981" }}
          >
            Take the Scorecard Free →
          </Link>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <form method="GET" className="flex-1 relative">
            {category && <input type="hidden" name="category" value={category} />}
            {level    && <input type="hidden" name="level"    value={level}    />}
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: "#6B7280" }} />
            <input
              name="q"
              defaultValue={q}
              placeholder="Search grants, fellowships, funders…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", color: "#111827" }}
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
                  backgroundColor: active ? "#2563EB" : "#F8FAFC",
                  color:           active ? "#fff"    : "#6B7280",
                  border:          active ? "1px solid #2563EB" : "1px solid #E2E8F0",
                }}
                aria-pressed={active}
              >
                {f.label}
              </Link>
            );
          })}
        </div>

        {/* Streamed card grid */}
        <Suspense fallback={<OpportunitiesLoadingSkeleton />}>
          <OpportunitiesResults category={category} level={level} q={q} />
        </Suspense>

        {/* Newsletter strip — Item 62 */}
        <div
          className="mt-14 rounded-2xl border px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ backgroundColor: "#F8FAFC", borderColor: "#E2E8F0" }}
        >
          <div>
            <p className="text-sm font-semibold mb-0.5" style={{ color: "#111827" }}>
              Get new grants &amp; calls delivered weekly — free
            </p>
            <p className="text-xs" style={{ color: "#6B7280" }}>
              Fellowships, travel bursaries, and CFPs curated for African researchers, every Monday.
            </p>
          </div>
          <Link
            href="/resources#newsletter"
            className="inline-flex items-center gap-1.5 text-xs font-bold whitespace-nowrap flex-shrink-0 rounded-lg px-4 py-2.5 text-white"
            style={{ backgroundColor: "#2563EB" }}
          >
            Subscribe Free →
          </Link>
        </div>

        {/* Community CTA */}
        <div className="mt-8 rounded-2xl border p-8 text-center" style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}>
          <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#2563EB" }}>
            Know an Opportunity?
          </p>
          <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-serif)", color: "#111827" }}>
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
