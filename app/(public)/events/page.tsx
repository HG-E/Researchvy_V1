import { Suspense } from "react";
import Link from "next/link";
import { Plus, Calendar, Zap, Search } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { EventCard } from "@/components/events/EventCard";
import type { AcademicEvent, EventType } from "@/types/event";

export const revalidate = 60;

export const metadata = generatePageMetadata({
  title: "Academic Events",
  description: "Discover conferences, workshops, seminars, webinars, and academic events curated for researchers.",
  path: "/events",
});

const EVENT_TYPES: { value: EventType | ""; label: string }[] = [
  { value: "",            label: "All types"  },
  { value: "conference",  label: "Conference" },
  { value: "seminar",     label: "Seminar"    },
  { value: "workshop",    label: "Workshop"   },
  { value: "symposium",   label: "Symposium"  },
  { value: "webinar",     label: "Webinar"    },
  { value: "lecture",     label: "Lecture"    },
  { value: "panel",       label: "Panel"      },
  { value: "hackathon",   label: "Hackathon"  },
];

async function getEvents(params: {
  type?: string; format?: string; audience?: string; upcoming?: string; q?: string;
}): Promise<AcademicEvent[]> {
  try {
    const admin = createSupabaseAdminClient();
    let q = admin
      .from("events")
      .select("id,title,slug,short_description,event_type,format,location,start_date,end_date,registration_deadline,featured_image,is_free,fee_amount,fee_currency,organizer_name,organizer_type,target_audience,disciplines,tags,status,is_featured,views_count,call_for_papers_deadline,capacity,has_travel_funding,is_competitive_admission")
      .in("status", ["published", "featured"])
      .order("is_featured", { ascending: false })
      .order("start_date", { ascending: true })
      .limit(60);

    if (params.type)     q = q.eq("event_type", params.type);
    if (params.format)   q = q.eq("format", params.format);
    if (params.audience) q = q.eq("target_audience", params.audience);
    if (params.upcoming === "true") q = q.gte("start_date", new Date().toISOString());
    if (params.q)        q = q.or(`title.ilike.%${params.q}%,short_description.ilike.%${params.q}%,organizer_name.ilike.%${params.q}%`);

    const { data } = await q;
    return (data ?? []) as AcademicEvent[];
  } catch {
    return [];
  }
}

// ── Streamed results component ────────────────────────────────────────────────

async function EventsResults({
  params,
}: {
  params: { type?: string; format?: string; audience?: string; upcoming?: string; q?: string };
}) {
  const events      = await getEvents(params);
  const featured    = events.filter((e) => e.is_featured);
  const regular     = events.filter((e) => !e.is_featured);
  const searchQuery = params.q ?? "";
  const hasFilters  = !!(params.type || params.format || params.upcoming === "true" || params.q);

  return (
    <>
      {/* Featured events */}
      {featured.length > 0 && !searchQuery && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-5">
            <Zap className="h-4 w-4" style={{ color: "#8B5CF6" }} />
            <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#8B5CF6" }}>
              Featured Events
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((event) => <EventCard key={event.id} event={event} />)}
          </div>
        </div>
      )}

      {/* All events */}
      <div>
        {(featured.length > 0 || searchQuery) && (
          <p className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: "#4B5563" }}>
            {searchQuery ? `Results for "${searchQuery}"` : hasFilters ? "Filtered Results" : "All Events"}
            {events.length > 0 && <span style={{ color: "#4B5563" }}> · {events.length} events</span>}
          </p>
        )}

        {regular.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {regular.map((event) => <EventCard key={event.id} event={event} />)}
          </div>
        ) : featured.length === 0 ? (
          hasFilters ? (
            <div className="rounded-2xl border p-14 text-center" style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}>
              <Search className="h-10 w-10 mx-auto mb-4" style={{ color: "#9CA3AF" }} />
              <p className="text-base font-semibold mb-2" style={{ color: "#111827" }}>No events match your search</p>
              <p className="text-sm mb-6" style={{ color: "#4B5563" }}>Try different keywords or clear the filters.</p>
              <Link href="/events" className="rounded-xl px-5 py-2.5 text-sm font-semibold border"
                style={{ borderColor: "#E2E8F0", color: "#4B5563" }}>
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Hero empty state */}
              <div
                className="rounded-2xl border p-10 sm:p-14 text-center"
                style={{ backgroundColor: "rgba(37,99,235,0.03)", borderColor: "rgba(37,99,235,0.15)" }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ backgroundColor: "rgba(37,99,235,0.1)" }}
                >
                  <Calendar className="h-8 w-8" style={{ color: "#2563EB" }} />
                </div>
                <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
                  Coming soon
                </p>
                <h2 className="text-xl sm:text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-serif)", color: "#111827" }}>
                  Academic events are being curated
                </h2>
                <p className="text-sm max-w-lg mx-auto mb-6 leading-relaxed" style={{ color: "#4B5563" }}>
                  We're building a curated calendar of conferences, workshops, and seminars for
                  research professionals. Be the first to list yours — free, reviewed within 2 business days.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <Link href="/events/submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white"
                    style={{ backgroundColor: "#2563EB" }}>
                    <Plus className="h-4 w-4" />
                    Submit Your Event — Free
                  </Link>
                  <Link href="/resources#newsletter"
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold border"
                    style={{ borderColor: "#E2E8F0", color: "#374151" }}>
                    Get notified when events go live
                  </Link>
                </div>
              </div>

              {/* Three benefit chips */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { title: "Free to list", desc: "No cost to submit your event to this community.", color: "#10B981" },
                  { title: "Reviewed in 48 hrs", desc: "Every submission is manually reviewed before publishing.", color: "#2563EB" },
                  { title: "Global reach", desc: "Researchers from 38+ countries discover events here.", color: "#7C3AED" },
                ].map(({ title, desc, color }) => (
                  <div key={title} className="rounded-xl border p-5" style={{ borderColor: "#E2E8F0", backgroundColor: "#FAFBFC" }}>
                    <div className="w-2 h-2 rounded-full mb-3" style={{ backgroundColor: color }} />
                    <p className="text-sm font-semibold mb-1" style={{ color: "#111827" }}>{title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: "#4B5563" }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        ) : null}
      </div>
    </>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────

function EventsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" aria-label="Loading events…">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border animate-pulse"
          style={{ height: 220, backgroundColor: "#F8FAFC", borderColor: "#E2E8F0" }}
        />
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function EventsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    type?: string; format?: string; audience?: string; upcoming?: string; q?: string;
  }>;
}) {
  const params      = searchParams ? await searchParams : {};

  const activeType   = params.type     ?? "";
  const activeFormat = params.format   ?? "";
  const upcomingOnly = params.upcoming === "true";
  const searchQuery  = params.q        ?? "";

  function filterHref(overrides: Record<string, string>) {
    const p = new URLSearchParams({
      ...(activeType   ? { type:   activeType   } : {}),
      ...(activeFormat ? { format: activeFormat } : {}),
      ...(upcomingOnly ? { upcoming: "true" }     : {}),
      ...(searchQuery  ? { q: searchQuery }        : {}),
      ...overrides,
    });
    const str = p.toString();
    return `/events${str ? `?${str}` : ""}`;
  }

  const hasFilters = !!(activeType || activeFormat || upcomingOnly || searchQuery);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">

        {/* Hero */}
        <div className="max-w-3xl mb-10">
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#2563EB" }}>
            Researchvy Events
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold mb-5 leading-[1.1]"
            style={{ fontFamily: "var(--font-serif)", color: "#111827", letterSpacing: "-0.02em" }}
          >
            Academic Events for<br />
            <span style={{ color: "#10B981" }}>Research Professionals</span>
          </h1>
          <p className="text-base sm:text-lg leading-relaxed max-w-2xl mb-6" style={{ color: "#4B5563" }}>
            Conferences, workshops, seminars, and more — curated for researchers who want to stay
            connected, collaborate, and advance their academic careers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            {!upcomingOnly ? (
              <Link
                href={filterHref({ upcoming: "true" })}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white"
                style={{ backgroundColor: "#2563EB" }}
              >
                <Calendar className="h-4 w-4" />
                See Upcoming Events
              </Link>
            ) : (
              <Link
                href={filterHref({ upcoming: "" })}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white"
                style={{ backgroundColor: "#2563EB" }}
              >
                <Calendar className="h-4 w-4" />
                Show All Events
              </Link>
            )}
            <Link
              href="/events/submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold border"
              style={{ borderColor: "#E2E8F0", color: "#4B5563" }}
            >
              <Plus className="h-4 w-4" />
              Submit an Event
            </Link>
          </div>
        </div>

        {/* Scorecard strip */}
        <div
          className="rounded-xl border px-5 py-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ backgroundColor: "rgba(16,185,129,0.04)", borderColor: "rgba(16,185,129,0.15)" }}
        >
          <p className="text-sm leading-relaxed" style={{ color: "#4B5563" }}>
            <span className="font-semibold" style={{ color: "#111827" }}>Know your research visibility score</span>
            {" "}— before you submit to conferences or apply for funding.
          </p>
          <Link
            href="/resources/visibility-scorecard"
            className="inline-flex items-center gap-1.5 text-xs font-bold whitespace-nowrap flex-shrink-0 rounded-lg px-4 py-2 text-white"
            style={{ backgroundColor: "#10B981" }}
          >
            Take the Scorecard Free →
          </Link>
        </div>

        {/* Search — Item 61: visible label for a11y */}
        <form method="GET" className="mb-6 relative max-w-xl">
          {activeType    && <input type="hidden" name="type"     value={activeType}   />}
          {activeFormat  && <input type="hidden" name="format"   value={activeFormat} />}
          {upcomingOnly  && <input type="hidden" name="upcoming" value="true"         />}
          <label htmlFor="events-search" className="sr-only">Search events</label>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" aria-hidden="true" style={{ color: "#4B5563" }} />
          <input
            id="events-search"
            name="q"
            defaultValue={searchQuery}
            placeholder="Search events, organisers, disciplines…"
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", color: "#111827" }}
          />
        </form>

        {/* Filter bar — Item 53: aria-pressed for a11y */}
        <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Filter by event type and format">
          {EVENT_TYPES.map(({ value, label }) => {
            const active = activeType === value;
            return (
              <Link
                key={value}
                href={value ? filterHref({ type: value }) : filterHref({ type: "" })}
                className="rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all"
                aria-pressed={active}
                style={{
                  backgroundColor: active ? "#2563EB" : "#F8FAFC",
                  color:           active ? "#fff"    : "#6B7280",
                  border:          active ? "none"    : "1px solid #E2E8F0",
                }}
              >
                {label}
              </Link>
            );
          })}

          <div className="w-px h-6 self-center" style={{ backgroundColor: "#E2E8F0" }} />

          {(["", "in-person", "virtual", "hybrid"] as const).map((f) => {
            const active = activeFormat === f;
            return (
              <Link
                key={f}
                href={filterHref({ format: f })}
                className="rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all"
                aria-pressed={active}
                style={{
                  backgroundColor: active ? "#8B5CF6" : "#F8FAFC",
                  color:           active ? "#fff"    : "#6B7280",
                  border:          active ? "none"    : "1px solid #E2E8F0",
                }}
              >
                {f === "" ? "Any format" : f === "in-person" ? "In-Person" : f.charAt(0).toUpperCase() + f.slice(1)}
              </Link>
            );
          })}

          {hasFilters && (
            <Link href="/events" className="rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all"
              style={{ backgroundColor: "#FEF2F2", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>
              Clear filters
            </Link>
          )}
        </div>

        {/* Streamed card grid */}
        <Suspense fallback={<EventsLoadingSkeleton />}>
          <EventsResults params={params} />
        </Suspense>

        {/* Newsletter strip — Item 62 */}
        <div
          className="mt-14 rounded-2xl border px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ backgroundColor: "#F8FAFC", borderColor: "#E2E8F0" }}
        >
          <div>
            <p className="text-sm font-semibold mb-0.5" style={{ color: "#111827" }}>
              Get new events &amp; calls for papers weekly — free
            </p>
            <p className="text-xs" style={{ color: "#4B5563" }}>
              Conferences, workshops, and deadlines worth attending, curated for research professionals.
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
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#4B5563" }}>
            Organising an Academic Event?
          </p>
          <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-serif)", color: "#111827" }}>
            Reach researchers who take visibility seriously
          </h2>
          <p className="text-sm max-w-xl mx-auto mb-6" style={{ color: "#4B5563" }}>
            Submit your conference, seminar, or workshop — free to list, reviewed within 2 business days,
            and visible to every researcher in this community.
          </p>
          <Link href="/events/submit"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white"
            style={{ backgroundColor: "#2563EB" }}>
            <Plus className="h-4 w-4" />
            Submit Your Event — It&apos;s Free
          </Link>
        </div>

      </div>
    </div>
  );
}
