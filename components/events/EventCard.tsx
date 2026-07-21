import Link from "next/link";
import { Calendar, MapPin, Users, ExternalLink, Star, Plane, Lock } from "lucide-react";
import { EventTypeBadge, EventFormatBadge } from "./EventTypeBadge";
import type { AcademicEvent } from "@/types/event";

function formatEventDate(start: string, end?: string | null) {
  const s = new Date(start);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
  if (!end) return s.toLocaleDateString("en-GB", opts);
  const e = new Date(end);
  if (s.toDateString() === e.toDateString()) return s.toLocaleDateString("en-GB", opts);
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${s.getDate()}–${e.toLocaleDateString("en-GB", opts)}`;
  }
  return `${s.toLocaleDateString("en-GB", opts)} – ${e.toLocaleDateString("en-GB", opts)}`;
}

function isUpcoming(date: string) { return new Date(date) > new Date(); }
function isPast(date: string)     { return new Date(date) < new Date(); }

export function EventCard({ event }: { event: AcademicEvent }) {
  const upcoming    = isUpcoming(event.start_date);
  const past        = isPast(event.end_date ?? event.start_date);
  const hasDeadline = event.registration_deadline && isUpcoming(event.registration_deadline);
  const hasCFP      = event.call_for_papers_deadline && isUpcoming(event.call_for_papers_deadline);

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group block rounded-2xl border transition-all duration-200 overflow-hidden hover:-translate-y-0.5 hover:shadow-lg"
      style={{
        backgroundColor: "#FFFFFF",
        borderColor:     event.is_featured ? "rgba(139,92,246,0.4)" : "#1E293B",
        boxShadow:       event.is_featured ? "0 0 0 1px rgba(139,92,246,0.15)" : "none",
      }}
    >
      {/* Featured accent bar */}
      {event.is_featured && (
        <div className="h-0.5" style={{ background: "linear-gradient(90deg, #8B5CF6, #EC4899)" }} />
      )}

      <div className="p-5">
        {/* Top row — badges + featured star */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <EventTypeBadge type={event.event_type} />
            <EventFormatBadge format={event.format} />
            {past && (
              <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold"
                style={{ backgroundColor: "rgba(100,116,139,0.12)", color: "#64748B" }}>
                Past
              </span>
            )}
            {/* Funding badge — new in migration 027 */}
            {event.has_travel_funding && (
              <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                style={{ backgroundColor: "rgba(34,211,238,0.08)", color: "#22D3EE" }}>
                <Plane className="h-3 w-3" /> Funded
              </span>
            )}
            {event.is_competitive_admission && (
              <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                style={{ backgroundColor: "rgba(245,158,11,0.08)", color: "#F59E0B" }}>
                <Lock className="h-3 w-3" /> Apply to attend
              </span>
            )}
          </div>
          {event.is_featured && (
            <Star className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" style={{ color: "#8B5CF6" }} />
          )}
        </div>

        {/* Title */}
        <h3
          className="text-base font-bold mb-2 leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors"
          style={{ color: "#111827" }}
        >
          {event.title}
        </h3>

        {/* Short description */}
        {event.short_description && (
          <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: "#4B5563" }}>
            {event.short_description}
          </p>
        )}

        {/* Meta info */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "#4B5563" }}>
            <Calendar className="h-3 w-3 flex-shrink-0" />
            <span>{formatEventDate(event.start_date, event.end_date)}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-1.5 text-xs" style={{ color: "#4B5563" }}>
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "#4B5563" }}>
            <Users className="h-3 w-3 flex-shrink-0" />
            <span>{event.organizer_name}</span>
          </div>
        </div>

        {/* Urgency strips */}
        <div className="space-y-1.5">
          {hasCFP && (
            <div className="rounded-lg px-3 py-2 text-[11px] font-semibold"
              style={{ backgroundColor: "rgba(245,158,11,0.08)", color: "#F59E0B" }}>
              CFP deadline: {new Date(event.call_for_papers_deadline!).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
            </div>
          )}
          {hasDeadline && !hasCFP && !event.is_competitive_admission && (
            <div className="rounded-lg px-3 py-2 text-[11px] font-semibold"
              style={{ backgroundColor: "rgba(239,68,68,0.08)", color: "#F87171" }}>
              Registration closes {new Date(event.registration_deadline!).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
            </div>
          )}
          {hasDeadline && event.is_competitive_admission && (
            <div className="rounded-lg px-3 py-2 text-[11px] font-semibold"
              style={{ backgroundColor: "rgba(245,158,11,0.08)", color: "#F59E0B" }}>
              Application closes {new Date(event.registration_deadline!).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
            </div>
          )}
        </div>

        {/* Bottom row — fee + CTA hint */}
        <div className="mt-4 pt-3 border-t flex items-center justify-between" style={{ borderColor: "#E2E8F0" }}>
          <span className="text-xs font-semibold" style={{ color: event.is_free ? "#10B981" : "#F9FAFB" }}>
            {event.is_free ? "Free" : `${event.fee_currency} ${event.fee_amount?.toLocaleString()}`}
          </span>
          <span className="flex items-center gap-1 text-[11px]" style={{ color: "#2563EB" }}>
            {event.registration_type === "external" ? (
              <><ExternalLink className="h-3 w-3" /> Register</>
            ) : event.is_competitive_admission ? (
              "Apply →"
            ) : upcoming ? (
              "RSVP →"
            ) : (
              "View →"
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}
