import Link from "next/link";
import { redirect } from "next/navigation";
import { Calendar, Plus, Bookmark, Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import { getServerUser, createSupabaseAdminClient } from "@/lib/auth/supabase";
import { EventTypeBadge } from "@/components/events/EventTypeBadge";
import type { AcademicEvent, EventRegistration, EventSave } from "@/types/event";

export const dynamic = "force-dynamic";

type SubmittedEvent = Pick<AcademicEvent, "id" | "title" | "slug" | "event_type" | "status" | "start_date" | "review_note" | "created_at">;
type SavedEvent = EventSave & { event: Pick<AcademicEvent, "id" | "title" | "slug" | "event_type" | "start_date" | "location"> };
type RegisteredEvent = EventRegistration & { event: Pick<AcademicEvent, "id" | "title" | "slug" | "event_type" | "start_date" | "location"> };

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: "Under Review",  color: "#F59E0B", bg: "rgba(245,158,11,0.1)"  },
  approved:  { label: "Approved",      color: "#60A5FA", bg: "rgba(96,165,250,0.1)"  },
  published: { label: "Live",          color: "#10B981", bg: "rgba(16,185,129,0.1)"  },
  featured:  { label: "Featured",      color: "#A78BFA", bg: "rgba(167,139,250,0.1)" },
  rejected:  { label: "Not Published", color: "#F87171", bg: "rgba(248,113,113,0.1)" },
  archived:  { label: "Archived",      color: "#6B7280", bg: "rgba(107,114,128,0.1)" },
  cancelled: { label: "Cancelled",     color: "#EF4444", bg: "rgba(239,68,68,0.1)"   },
};

export default async function DashboardEventsPage() {
  const user = await getServerUser();
  if (!user) redirect("/signin?next=/dashboard/events");

  const admin = createSupabaseAdminClient();

  const [submittedRes, savedRes, registeredRes] = await Promise.all([
    admin
      .from("events")
      .select("id,title,slug,event_type,status,start_date,review_note,created_at")
      .eq("submitted_by", user.id)
      .order("created_at", { ascending: false })
      .limit(20),
    admin
      .from("event_saves")
      .select("event_id,saved_at,event:events(id,title,slug,event_type,start_date,location)")
      .eq("user_id", user.id)
      .order("saved_at", { ascending: false })
      .limit(20),
    admin
      .from("event_registrations")
      .select("id,event_id,status,registered_at,event:events(id,title,slug,event_type,start_date,location)")
      .eq("user_id", user.id)
      .neq("status", "cancelled")
      .order("registered_at", { ascending: false })
      .limit(20),
  ]);

  const submitted   = (submittedRes.data   ?? []) as SubmittedEvent[];
  const saved       = (savedRes.data        ?? []) as unknown as SavedEvent[];
  const registered  = (registeredRes.data   ?? []) as unknown as RegisteredEvent[];

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080E1A" }}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>My Account</p>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>My Events</h1>
            <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
              Your submitted events, saved events, and RSVPs.
            </p>
          </div>
          <Link
            href="/events/submit"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white whitespace-nowrap"
            style={{ backgroundColor: "#2563EB" }}
          >
            <Plus className="h-4 w-4" />
            Submit Event
          </Link>
        </div>

        {/* ── Submitted events ──────────────────────────────────────── */}
        <section className="mb-12">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-5 flex items-center gap-2" style={{ color: "#4B5563" }}>
            <Eye className="h-4 w-4" />
            Submitted Events ({submitted.length})
          </h2>

          {submitted.length === 0 ? (
            <div className="rounded-2xl border p-10 text-center" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
              <Calendar className="h-8 w-8 mx-auto mb-3" style={{ color: "#1E293B" }} />
              <p className="text-sm mb-1" style={{ color: "#9CA3AF" }}>You haven't submitted any events yet.</p>
              <p className="text-xs mb-5" style={{ color: "#4B5563" }}>Submit your conference, workshop, or seminar to reach researchers on Researchvy.</p>
              <Link href="/events/submit" className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white"
                style={{ backgroundColor: "#2563EB" }}>
                <Plus className="h-4 w-4" /> Submit Your First Event
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
              {submitted.map((event, i) => {
                const statusCfg = STATUS_LABELS[event.status] ?? STATUS_LABELS.pending;
                return (
                  <div
                    key={event.id}
                    className="flex items-start justify-between gap-4 px-5 py-4"
                    style={{ borderBottom: i < submitted.length - 1 ? "1px solid #1E293B" : "none" }}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <EventTypeBadge type={event.event_type} />
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}>
                          {statusCfg.label}
                        </span>
                      </div>
                      <p className="text-sm font-semibold mb-0.5 truncate" style={{ color: "#F9FAFB" }}>{event.title}</p>
                      <p className="text-xs" style={{ color: "#4B5563" }}>
                        Submitted {formatDate(event.created_at)}
                        {event.start_date && ` · Event: ${formatDate(event.start_date)}`}
                      </p>
                      {event.review_note && event.status === "rejected" && (
                        <p className="text-xs mt-1.5 rounded-lg px-2.5 py-1.5 leading-relaxed"
                          style={{ backgroundColor: "rgba(248,113,113,0.06)", color: "#F87171" }}>
                          Reviewer note: {event.review_note}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {(event.status === "published" || event.status === "featured") && (
                        <Link href={`/events/${event.slug}`}
                          className="text-[11px] font-semibold px-3 py-1.5 rounded-lg"
                          style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#10B981" }}>
                          View Live
                        </Link>
                      )}
                      {event.status === "rejected" && (
                        <Link href="/events/submit"
                          className="text-[11px] font-semibold px-3 py-1.5 rounded-lg"
                          style={{ backgroundColor: "rgba(37,99,235,0.1)", color: "#60A5FA" }}>
                          Resubmit
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Registered events ─────────────────────────────────────── */}
        {registered.length > 0 && (
          <section className="mb-12">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-5 flex items-center gap-2" style={{ color: "#4B5563" }}>
              <CheckCircle className="h-4 w-4" />
              My RSVPs ({registered.length})
            </h2>
            <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
              {registered.map((reg, i) => {
                const e = reg.event as unknown as AcademicEvent;
                return (
                  <div key={reg.id} className="flex items-center justify-between gap-4 px-5 py-4"
                    style={{ borderBottom: i < registered.length - 1 ? "1px solid #1E293B" : "none" }}>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: reg.status === "registered" ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)",
                            color:           reg.status === "registered" ? "#10B981"               : "#F59E0B",
                          }}>
                          {reg.status === "registered" ? "Registered" : "Waitlisted"}
                        </span>
                      </div>
                      <p className="text-sm font-semibold mb-0.5 truncate" style={{ color: "#F9FAFB" }}>{e?.title}</p>
                      <p className="text-xs" style={{ color: "#4B5563" }}>
                        {e?.start_date ? formatDate(e.start_date) : ""}
                        {e?.location ? ` · ${e.location}` : ""}
                      </p>
                    </div>
                    <Link href={`/events/${e?.slug}`}
                      className="text-[11px] font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap"
                      style={{ backgroundColor: "rgba(37,99,235,0.1)", color: "#60A5FA" }}>
                      View Event
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Saved events ──────────────────────────────────────────── */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-5 flex items-center gap-2" style={{ color: "#4B5563" }}>
            <Bookmark className="h-4 w-4" />
            Saved Events ({saved.length})
          </h2>

          {saved.length === 0 ? (
            <div className="rounded-2xl border p-8 text-center" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
              <Bookmark className="h-7 w-7 mx-auto mb-3" style={{ color: "#1E293B" }} />
              <p className="text-sm mb-1" style={{ color: "#9CA3AF" }}>No saved events yet.</p>
              <p className="text-xs mb-5" style={{ color: "#4B5563" }}>Browse the events board and bookmark ones you're interested in.</p>
              <Link href="/events" className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold border"
                style={{ borderColor: "#1E293B", color: "#9CA3AF" }}>
                Browse Events
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {saved.map(({ event_id, saved_at, event }) => {
                const e = event as unknown as AcademicEvent;
                return (
                  <Link key={event_id} href={`/events/${e?.slug}`}
                    className="group rounded-xl border p-4 block transition-all"
                    style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
                    <EventTypeBadge type={e?.event_type} />
                    <p className="text-sm font-semibold mt-2 mb-1 group-hover:text-blue-400 transition-colors line-clamp-2"
                      style={{ color: "#F9FAFB" }}>{e?.title}</p>
                    <p className="text-xs" style={{ color: "#4B5563" }}>
                      {e?.start_date ? formatDate(e.start_date) : ""}
                      {e?.location ? ` · ${e.location}` : ""}
                    </p>
                    <p className="text-[11px] mt-2" style={{ color: "#374151" }}>Saved {formatDate(saved_at)}</p>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
