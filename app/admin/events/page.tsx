import Link from "next/link";
import { Plus, Calendar, Zap, ExternalLink } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { EventStatusToggle } from "@/components/admin/events/EventStatusToggle";
import type { AcademicEvent } from "@/types/event";

export const dynamic  = "force-dynamic";
export const metadata = generatePageMetadata({ title: "Events — Admin" });

const TYPE_COLORS: Record<string, string> = {
  conference: "#818CF8", seminar: "#34D399", workshop: "#FB923C",
  symposium:  "#A78BFA", webinar: "#22D3EE", lecture:  "#FBBF24",
  panel:      "#F472B6", hackathon: "#4ADE80", other:  "#94A3B8",
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending:   { label: "Pending",   color: "#F59E0B" },
  approved:  { label: "Approved",  color: "#60A5FA" },
  published: { label: "Live",      color: "#10B981" },
  featured:  { label: "Featured",  color: "#A78BFA" },
  rejected:  { label: "Rejected",  color: "#F87171" },
  archived:  { label: "Archived",  color: "#6B7280" },
  cancelled: { label: "Cancelled", color: "#EF4444" },
};

type EventRow = Pick<AcademicEvent, "id" | "title" | "slug" | "event_type" | "format" | "status" | "is_featured" | "organizer_name" | "organizer_type" | "start_date" | "submitted_by" | "reviewed_at" | "views_count" | "created_at">;

export default async function AdminEventsPage() {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("events")
    .select("id,title,slug,event_type,format,status,is_featured,organizer_name,organizer_type,start_date,submitted_by,reviewed_at,views_count,created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const rows         = (data ?? []) as EventRow[];
  const pendingCount = rows.filter((r) => r.status === "pending").length;
  const liveCount    = rows.filter((r) => r.status === "published" || r.status === "featured").length;
  const featuredCount = rows.filter((r) => r.is_featured).length;

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>Admin › Events</p>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>Academic Events</h1>
          <p className="mt-1 text-sm" style={{ color: "#6B7280" }}>
            {rows.length} total ·{" "}
            <span style={{ color: "#F59E0B" }}>{pendingCount} pending review</span> ·{" "}
            <span style={{ color: "#10B981" }}>{liveCount} live</span> ·{" "}
            <span style={{ color: "#A78BFA" }}>{featuredCount} featured</span>
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white whitespace-nowrap"
          style={{ backgroundColor: "#2563EB" }}
        >
          <Plus className="h-4 w-4" />
          Create Event
        </Link>
      </div>

      {pendingCount > 0 && (
        <div className="rounded-2xl border mb-6 p-4 flex items-start gap-3"
          style={{ backgroundColor: "rgba(245,158,11,0.06)", borderColor: "rgba(245,158,11,0.2)" }}>
          <Zap className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "#F59E0B" }} />
          <p className="text-sm" style={{ color: "#D97706" }}>
            <strong>{pendingCount} event{pendingCount > 1 ? "s" : ""}</strong> waiting for review. Click <strong>Publish</strong> to make them live on the board.
          </p>
        </div>
      )}

      {rows.length === 0 ? (
        <div className="rounded-2xl border p-16 text-center" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
          <Calendar className="h-10 w-10 mx-auto mb-4" style={{ color: "#1E293B" }} />
          <p className="text-sm mb-1" style={{ color: "#4B5563" }}>No events yet.</p>
          <p className="text-xs mb-5" style={{ color: "#374151" }}>
            Create a Researchvy event or wait for researcher submissions.
          </p>
          <Link href="/admin/events/new" className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white"
            style={{ backgroundColor: "#2563EB" }}>
            <Plus className="h-4 w-4" /> Create First Event
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs font-semibold tracking-wider uppercase"
                  style={{ borderColor: "#1E293B", color: "#4B5563" }}>
                  <th className="text-left px-5 py-3">Event</th>
                  <th className="text-left px-5 py-3">Type</th>
                  <th className="text-left px-5 py-3">Date</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Views</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {rows.map((event) => {
                  const statusCfg = STATUS_CONFIG[event.status] ?? STATUS_CONFIG.pending;
                  const isPending = event.status === "pending";
                  return (
                    <tr
                      key={event.id}
                      className="border-b"
                      style={{
                        borderColor: "#1E293B",
                        backgroundColor: isPending ? "rgba(245,158,11,0.02)" : "transparent",
                      }}
                    >
                      <td className="px-5 py-4 max-w-xs">
                        <p className="text-xs font-semibold leading-snug mb-0.5" style={{ color: "#F9FAFB" }}>
                          {event.title.slice(0, 80)}{event.title.length > 80 ? "…" : ""}
                        </p>
                        <p className="text-[11px]" style={{ color: "#4B5563" }}>
                          {event.organizer_name}
                          {event.organizer_type === "researchvy" && (
                            <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded"
                              style={{ backgroundColor: "rgba(37,99,235,0.1)", color: "#60A5FA" }}>
                              Researchvy
                            </span>
                          )}
                          {!!event.submitted_by && (
                            <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded"
                              style={{ backgroundColor: "rgba(99,102,241,0.1)", color: "#818CF8" }}>
                              Community
                            </span>
                          )}
                        </p>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize"
                          style={{ backgroundColor: `${TYPE_COLORS[event.event_type] ?? "#94A3B8"}18`, color: TYPE_COLORS[event.event_type] ?? "#94A3B8" }}>
                          {event.event_type}
                        </span>
                        <p className="text-[10px] mt-1 capitalize" style={{ color: "#4B5563" }}>{event.format}</p>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {event.start_date ? (
                          <span className="flex items-center gap-1 text-xs" style={{ color: "#9CA3AF" }}>
                            <Calendar className="h-3 w-3" />
                            {new Date(event.start_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        ) : (
                          <span className="text-xs" style={{ color: "#374151" }}>TBD</span>
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: `${statusCfg.color}15`, color: statusCfg.color }}>
                          {statusCfg.label}
                          {event.is_featured && " ★"}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-xs" style={{ color: "#4B5563" }}>
                        {event.views_count}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex flex-col items-end gap-1.5">
                          <EventStatusToggle
                            eventId={event.id}
                            currentStatus={event.status}
                            isFeatured={event.is_featured}
                          />
                          <div className="flex items-center gap-2">
                            <Link href={`/admin/events/${event.id}`}
                              className="inline-flex items-center gap-1 text-[11px]" style={{ color: "#4B5563" }}>
                              Edit
                            </Link>
                            {(event.status === "published" || event.status === "featured") && (
                              <Link href={`/events/${event.slug}`} target="_blank"
                                className="inline-flex items-center gap-1 text-[11px]" style={{ color: "#4B5563" }}>
                                <ExternalLink className="h-3 w-3" /> Preview
                              </Link>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
