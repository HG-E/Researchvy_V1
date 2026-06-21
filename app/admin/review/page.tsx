import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { CheckCircle2, ExternalLink, Calendar, Clock } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = generatePageMetadata({ title: "Review Queue", noIndex: true });

const OPP_CAT: Record<string, { label: string; color: string; bg: string }> = {
  grant:          { label: "Grant",              color: "#10B981", bg: "rgba(16,185,129,0.12)"  },
  fellowship:     { label: "Fellowship",         color: "#8B5CF6", bg: "rgba(139,92,246,0.12)"  },
  conference:     { label: "Call for Papers",    color: "#F59E0B", bg: "rgba(245,158,11,0.12)"  },
  speaking:       { label: "Call for Speakers",  color: "#06B6D4", bg: "rgba(6,182,212,0.12)"   },
  collaboration:  { label: "Collaboration",      color: "#EC4899", bg: "rgba(236,72,153,0.12)"  },
  job:            { label: "Job / Position",     color: "#6366F1", bg: "rgba(99,102,241,0.12)"  },
  award:          { label: "Award",              color: "#F97316", bg: "rgba(249,115,22,0.12)"  },
  "travel-grant": { label: "Travel Grant",       color: "#22D3EE", bg: "rgba(34,211,238,0.12)" },
  other:          { label: "Other",              color: "#6B7280", bg: "rgba(107,114,128,0.1)"  },
};

const EVT_TYPE: Record<string, { label: string; color: string; bg: string }> = {
  conference:  { label: "Conference",      color: "#60A5FA", bg: "rgba(96,165,250,0.12)"   },
  workshop:    { label: "Workshop",        color: "#A78BFA", bg: "rgba(167,139,250,0.12)"  },
  webinar:     { label: "Webinar",         color: "#34D399", bg: "rgba(52,211,153,0.12)"   },
  seminar:     { label: "Seminar",         color: "#F472B6", bg: "rgba(244,114,182,0.12)"  },
  summit:      { label: "Summit",          color: "#FB923C", bg: "rgba(251,146,60,0.12)"   },
  networking:  { label: "Networking",      color: "#FBBF24", bg: "rgba(251,191,36,0.12)"   },
  call:        { label: "Call for Papers", color: "#F59E0B", bg: "rgba(245,158,11,0.12)"   },
  other:       { label: "Other",           color: "#6B7280", bg: "rgba(107,114,128,0.1)"   },
};

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function ReviewQueuePage() {
  const admin = createSupabaseAdminClient();

  const [{ data: pendingOpps }, { data: pendingEvents }] = await Promise.all([
    admin
      .from("research_opportunities")
      .select("id, title, category, funder, deadline, created_at")
      .eq("submission_status", "pending")
      .order("created_at", { ascending: true })
      .limit(50),
    admin
      .from("events")
      .select("id, title, slug, event_type, start_date, created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(50),
  ]);

  const opps  = pendingOpps  ?? [];
  const evts  = pendingEvents ?? [];
  const total = opps.length + evts.length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>
          Admin
        </p>
        <div className="flex items-center gap-3">
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
          >
            Review Queue
          </h1>
          {total > 0 && (
            <span
              className="text-sm font-bold px-3 py-1 rounded-full"
              style={{ backgroundColor: "rgba(245,158,11,0.15)", color: "#FCD34D" }}
            >
              {total} pending
            </span>
          )}
        </div>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          All community-submitted content awaiting moderation.
        </p>
      </div>

      {/* All clear */}
      {total === 0 && (
        <div
          className="rounded-2xl border p-12 flex flex-col items-center justify-center text-center"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <CheckCircle2 className="h-12 w-12 mb-4" style={{ color: "#10B981" }} />
          <h2 className="text-lg font-semibold mb-1" style={{ color: "#F9FAFB" }}>All clear!</h2>
          <p className="text-sm" style={{ color: "#6B7280" }}>
            No pending submissions at this time.
          </p>
        </div>
      )}

      {/* Opportunities section */}
      {opps.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2.5 mb-4">
            <h2 className="text-base font-semibold" style={{ color: "#F9FAFB" }}>Opportunities</h2>
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "rgba(245,158,11,0.12)", color: "#FCD34D" }}
            >
              {opps.length}
            </span>
          </div>
          <div
            className="rounded-2xl border overflow-hidden"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            {opps.map((opp, i) => {
              const cat = OPP_CAT[opp.category as string] ?? OPP_CAT.other;
              return (
                <div
                  key={opp.id as string}
                  className="flex items-center gap-4 px-5 py-4"
                  style={{ borderTop: i === 0 ? "none" : "1px solid #1E293B" }}
                >
                  {/* Category badge */}
                  <span
                    className="hidden sm:inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0"
                    style={{ backgroundColor: cat.bg, color: cat.color }}
                  >
                    {cat.label}
                  </span>

                  {/* Title + meta */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "#F9FAFB" }}>
                      {opp.title as string}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-0.5">
                      {opp.funder && (
                        <span className="text-xs" style={{ color: "#6B7280" }}>{opp.funder as string}</span>
                      )}
                      {opp.deadline && (
                        <span className="flex items-center gap-1 text-xs" style={{ color: "#6B7280" }}>
                          <Calendar className="h-3 w-3" />
                          {fmt(opp.deadline as string)}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs" style={{ color: "#4B5563" }}>
                        <Clock className="h-3 w-3" />
                        Submitted {fmt(opp.created_at as string)}
                      </span>
                    </div>
                  </div>

                  {/* Review link */}
                  <Link
                    href={`/admin/opportunities/${opp.id as string}`}
                    className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors hover:opacity-80"
                    style={{ backgroundColor: "rgba(37,99,235,0.12)", color: "#60A5FA" }}
                  >
                    Review
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Events section */}
      {evts.length > 0 && (
        <section>
          <div className="flex items-center gap-2.5 mb-4">
            <h2 className="text-base font-semibold" style={{ color: "#F9FAFB" }}>Events</h2>
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "rgba(245,158,11,0.12)", color: "#FCD34D" }}
            >
              {evts.length}
            </span>
          </div>
          <div
            className="rounded-2xl border overflow-hidden"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            {evts.map((evt, i) => {
              const type = EVT_TYPE[evt.event_type as string] ?? EVT_TYPE.other;
              return (
                <div
                  key={evt.id as string}
                  className="flex items-center gap-4 px-5 py-4"
                  style={{ borderTop: i === 0 ? "none" : "1px solid #1E293B" }}
                >
                  {/* Type badge */}
                  <span
                    className="hidden sm:inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0"
                    style={{ backgroundColor: type.bg, color: type.color }}
                  >
                    {type.label}
                  </span>

                  {/* Title + meta */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "#F9FAFB" }}>
                      {evt.title as string}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-0.5">
                      {evt.start_date && (
                        <span className="flex items-center gap-1 text-xs" style={{ color: "#6B7280" }}>
                          <Calendar className="h-3 w-3" />
                          {fmt(evt.start_date as string)}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs" style={{ color: "#4B5563" }}>
                        <Clock className="h-3 w-3" />
                        Submitted {fmt(evt.created_at as string)}
                      </span>
                    </div>
                  </div>

                  {/* Review link */}
                  <Link
                    href={`/admin/events/${evt.id as string}`}
                    className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors hover:opacity-80"
                    style={{ backgroundColor: "rgba(37,99,235,0.12)", color: "#60A5FA" }}
                  >
                    Review
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
