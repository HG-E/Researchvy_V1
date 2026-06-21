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

export default async function EventsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    type?: string; format?: string; audience?: string; upcoming?: string; q?: string;
  }>;
}) {
  const params      = searchParams ? await searchParams : {};
  const events      = await getEvents(params);
  const featured    = events.filter((e) => e.is_featured);
  const regular     = events.filter((e) => !e.is_featured);

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
    <div className="min-h-screen" style={{ backgroundColor: "#080E1A" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">

        {/* Hero */}
        <div className="max-w-3xl mb-10">
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#2563EB" }}>
            Researchvy Events
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold mb-5 leading-[1.1]"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB", letterSpacing: "-0.02em" }}
          >
            Academic Events for<br />
            <span style={{ color: "#10B981" }}>Research Professionals</span>
          </h1>
          <p className="text-base sm:text-lg leading-relaxed max-w-2xl mb-6" style={{ color: "#6B7280" }}>
            Conferences, workshops, seminars, and more — curated for researchers who want to stay
            connected, collaborate, and advance their academic careers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/events/submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white"
              style={{ backgroundColor: "#2563EB" }}
            >
              <Plus className="h-4 w-4" />
              Submit Your Event
            </Link>
            {!upcomingOnly ? (
              <Link
                href={filterHref({ upcoming: "true" })}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold border"
                style={{ borderColor: "#1E293B", color: "#9CA3AF" }}
              >
                <Calendar className="h-4 w-4" />
                Upcoming Only
              </Link>
            ) : (
              <Link
                href={filterHref({ upcoming: "" })}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold border"
                style={{ borderColor: "#2563EB", color: "#60A5FA" }}
              >
                <Calendar className="h-4 w-4" />
                Show All Events
              </Link>
            )}
          </div>
        </div>

        {/* Scorecard strip */}
        <div
          className="rounded-xl border px-5 py-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ backgroundColor: "rgba(16,185,129,0.04)", borderColor: "rgba(16,185,129,0.15)" }}
        >
          <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>
            <span className="font-semibold" style={{ color: "#F9FAFB" }}>Know your research visibility score</span>
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

        {/* Search */}
        <form method="GET" className="mb-6 relative max-w-xl">
          {activeType    && <input type="hidden" name="type"     value={activeType}   />}
          {activeFormat  && <input type="hidden" name="format"   value={activeFormat} />}
          {upcomingOnly  && <input type="hidden" name="upcoming" value="true"         />}
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: "#4B5563" }} />
          <input
            name="q"
            defaultValue={searchQuery}
            placeholder="Search events, organisers, disciplines…"
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
            style={{ backgroundColor: "#0F172A", border: "1px solid #1E293B", color: "#F9FAFB" }}
          />
        </form>

        {/* Filter bar */}
        <div className="flex flex-wrap gap-2 mb-10">
          {EVENT_TYPES.map(({ value, label }) => (
            <Link
              key={value}
              href={value ? filterHref({ type: value }) : filterHref({ type: "" })}
              className="rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all"
              style={{
                backgroundColor: activeType === value ? "#2563EB" : "rgba(255,255,255,0.04)",
                color:           activeType === value ? "#fff"    : "#6B7280",
                border:          activeType === value ? "none"    : "1px solid #1E293B",
              }}
            >
              {label}
            </Link>
          ))}

          <div className="w-px h-6 self-center" style={{ backgroundColor: "#1E293B" }} />

          {(["", "in-person", "virtual", "hybrid"] as const).map((f) => (
            <Link
              key={f}
              href={filterHref({ format: f })}
              className="rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all"
              style={{
                backgroundColor: activeFormat === f ? "#8B5CF6" : "rgba(255,255,255,0.04)",
                color:           activeFormat === f ? "#fff"    : "#6B7280",
                border:          activeFormat === f ? "none"    : "1px solid #1E293B",
              }}
            >
              {f === "" ? "Any format" : f === "in-person" ? "In-Person" : f.charAt(0).toUpperCase() + f.slice(1)}
            </Link>
          ))}

          {hasFilters && (
            <Link href="/events" className="rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>
              Clear filters
            </Link>
          )}
        </div>

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
              {events.length > 0 && <span style={{ color: "#6B7280" }}> · {events.length} events</span>}
            </p>
          )}

          {regular.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {regular.map((event) => <EventCard key={event.id} event={event} />)}
            </div>
          ) : featured.length === 0 ? (
            <div className="rounded-2xl border p-16 text-center" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
              <Calendar className="h-10 w-10 mx-auto mb-4" style={{ color: "#1E293B" }} />
              <p className="text-base font-semibold mb-2" style={{ color: "#F9FAFB" }}>
                {hasFilters ? "No events match your search" : "No events yet"}
              </p>
              <p className="text-sm mb-6" style={{ color: "#4B5563" }}>
                {hasFilters
                  ? "Try different keywords or clear the filters."
                  : "Be the first to promote your academic event to this community."}
              </p>
              <div className="flex justify-center gap-3">
                {hasFilters && (
                  <Link href="/events" className="rounded-xl px-4 py-2 text-sm font-semibold border"
                    style={{ borderColor: "#1E293B", color: "#9CA3AF" }}>
                    Clear filters
                  </Link>
                )}
                <Link href="/events/submit" className="rounded-xl px-4 py-2 text-sm font-bold text-white"
                  style={{ backgroundColor: "#2563EB" }}>
                  Submit an Event
                </Link>
              </div>
            </div>
          ) : null}
        </div>

        {/* Community CTA */}
        {events.length > 0 && (
          <div className="mt-16 rounded-2xl border p-8 text-center" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#4B5563" }}>
              Organising an Academic Event?
            </p>
            <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
              Reach researchers who care about your field
            </h2>
            <p className="text-sm max-w-xl mx-auto mb-6" style={{ color: "#6B7280" }}>
              Submit your conference, seminar, or workshop — free to list, reviewed within 2 business days,
              and visible to thousands of research professionals.
            </p>
            <Link href="/events/submit"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white"
              style={{ backgroundColor: "#2563EB" }}>
              <Plus className="h-4 w-4" />
              Submit Your Event — It&apos;s Free
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
