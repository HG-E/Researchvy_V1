import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Calendar, MapPin, Users, ExternalLink, Eye } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { EventTypeBadge, EventFormatBadge } from "@/components/events/EventTypeBadge";
import { EventStatusToggle } from "@/components/admin/events/EventStatusToggle";
import type { AcademicEvent } from "@/types/event";

export const dynamic  = "force-dynamic";
export const metadata = generatePageMetadata({ title: "Event Review — Admin" });

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending:   { label: "Pending Review", color: "#F59E0B" },
  approved:  { label: "Approved",       color: "#60A5FA" },
  published: { label: "Live",           color: "#10B981" },
  featured:  { label: "Featured",       color: "#A78BFA" },
  rejected:  { label: "Rejected",       color: "#F87171" },
  archived:  { label: "Archived",       color: "#6B7280" },
  cancelled: { label: "Cancelled",      color: "#EF4444" },
};

export default async function AdminEventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admin  = createSupabaseAdminClient();

  const { data } = await admin.from("events").select("*").eq("id", id).single();
  if (!data) notFound();

  const event = data as AcademicEvent;

  // Fetch submitter info if community-submitted
  let submitterEmail: string | null = null;
  if (event.submitted_by) {
    const { data: submitter } = await admin.from("users").select("email,full_name").eq("id", event.submitted_by).single();
    submitterEmail = submitter?.email ?? null;
  }

  // Registration count
  const { count: regCount } = await admin
    .from("event_registrations")
    .select("id", { count: "exact", head: true })
    .eq("event_id", event.id)
    .in("status", ["registered", "waitlisted"]);

  const statusCfg = STATUS_CONFIG[event.status] ?? STATUS_CONFIG.pending;

  function formatDate(iso: string | null) {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/events" className="flex items-center gap-1.5 text-xs font-semibold mb-4" style={{ color: "#4B5563" }}>
          <ChevronLeft className="h-3.5 w-3.5" />
          Back to Events
        </Link>
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>Admin › Events › Review</p>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold leading-tight" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
            {event.title}
          </h1>
          <span className="shrink-0 text-[11px] font-semibold px-3 py-1.5 rounded-full"
            style={{ backgroundColor: `${statusCfg.color}15`, color: statusCfg.color }}>
            {statusCfg.label}
            {event.is_featured && " ★"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — details */}
        <div className="lg:col-span-2 space-y-6">

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <EventTypeBadge type={event.event_type} />
            <EventFormatBadge format={event.format} />
            {event.organizer_type === "researchvy" && (
              <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                style={{ backgroundColor: "rgba(37,99,235,0.12)", color: "#60A5FA" }}>
                Researchvy Event
              </span>
            )}
            {event.is_featured && (
              <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                style={{ backgroundColor: "rgba(139,92,246,0.12)", color: "#A78BFA" }}>
                ★ Featured
              </span>
            )}
          </div>

          {/* Key facts */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Start date",     icon: Calendar, value: formatDate(event.start_date) },
              { label: "End date",       icon: Calendar, value: formatDate(event.end_date) },
              { label: "Location",       icon: MapPin,   value: event.location ?? "—" },
              { label: "Venue",          icon: MapPin,   value: event.venue ?? "—" },
              { label: "Organizer",      icon: Users,    value: event.organizer_name },
              { label: "Audience",       icon: Users,    value: event.target_audience?.replace("_", "-") ?? "all" },
              { label: "Fee",            icon: null,     value: event.is_free ? "Free" : `${event.fee_currency} ${event.fee_amount?.toLocaleString()}` },
              { label: "Registration",   icon: null,     value: event.registration_type },
            ].map(({ label, icon: Icon, value }) => (
              <div key={label} className="rounded-xl border p-3" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
                <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: "#4B5563" }}>{label}</p>
                <div className="flex items-center gap-1.5">
                  {Icon && <Icon className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#6B7280" }} />}
                  <p className="text-sm capitalize" style={{ color: "#D1D5DB" }}>{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Deadlines */}
          {(event.registration_deadline || event.call_for_papers_deadline) && (
            <div className="rounded-xl border p-4" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: "#4B5563" }}>Deadlines</p>
              <div className="space-y-2">
                {event.registration_deadline && (
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "#6B7280" }}>Registration</span>
                    <span style={{ color: "#D1D5DB" }}>{formatDate(event.registration_deadline)}</span>
                  </div>
                )}
                {event.call_for_papers_deadline && (
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "#6B7280" }}>Call for Papers</span>
                    <span style={{ color: "#D1D5DB" }}>{formatDate(event.call_for_papers_deadline)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="rounded-xl border p-5" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
            <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: "#4B5563" }}>Description</p>
            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#9CA3AF" }}>{event.description}</p>
          </div>

          {/* URLs */}
          <div className="rounded-xl border p-4" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
            <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: "#4B5563" }}>Links</p>
            <div className="space-y-2">
              {event.website_url && (
                <a href={event.website_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs hover:underline" style={{ color: "#60A5FA" }}>
                  <ExternalLink className="h-3 w-3" /> Event website
                </a>
              )}
              {event.registration_url && (
                <a href={event.registration_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs hover:underline" style={{ color: "#10B981" }}>
                  <ExternalLink className="h-3 w-3" /> Registration link
                </a>
              )}
              {event.call_for_papers_url && (
                <a href={event.call_for_papers_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs hover:underline" style={{ color: "#F59E0B" }}>
                  <ExternalLink className="h-3 w-3" /> Call for Papers
                </a>
              )}
              {!event.website_url && !event.registration_url && !event.call_for_papers_url && (
                <p className="text-xs" style={{ color: "#374151" }}>No links provided</p>
              )}
            </div>
          </div>

          {/* Disciplines & Tags */}
          {(event.disciplines?.length > 0 || event.tags?.length > 0) && (
            <div className="rounded-xl border p-4" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: "#4B5563" }}>Disciplines & Tags</p>
              {event.disciplines?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {event.disciplines.map((d) => (
                    <span key={d} className="rounded-full px-2 py-0.5 text-[11px]"
                      style={{ backgroundColor: "rgba(37,99,235,0.08)", color: "#60A5FA" }}>{d}</span>
                  ))}
                </div>
              )}
              {event.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {event.tags.map((t) => (
                    <span key={t} className="rounded-full px-2 py-0.5 text-[11px]"
                      style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "#6B7280", border: "1px solid #1E293B" }}>#{t}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Review note */}
          {event.review_note && (
            <div className="rounded-xl border-l-4 px-4 py-3"
              style={{ borderLeftColor: "#F59E0B", backgroundColor: "rgba(245,158,11,0.04)" }}>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: "#F59E0B" }}>Previous Review Note</p>
              <p className="text-sm" style={{ color: "#D1D5DB" }}>{event.review_note}</p>
            </div>
          )}
        </div>

        {/* Right — action panel */}
        <div className="space-y-4">
          {/* Actions */}
          <div className="rounded-2xl border p-5" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
            <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: "#4B5563" }}>Review Actions</p>
            <EventStatusToggle
              eventId={event.id}
              currentStatus={event.status}
              isFeatured={event.is_featured}
            />
            {(event.status === "published" || event.status === "featured") && (
              <Link href={`/events/${event.slug}`} target="_blank"
                className="mt-3 w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold rounded-lg py-2 border"
                style={{ borderColor: "#1E293B", color: "#6B7280" }}>
                <ExternalLink className="h-3 w-3" /> Preview live event
              </Link>
            )}
          </div>

          {/* Submission metadata */}
          <div className="rounded-2xl border p-5" style={{ backgroundColor: "#0A0F1A", borderColor: "#1E293B" }}>
            <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: "#4B5563" }}>Submission Info</p>
            <dl className="space-y-2.5">
              {[
                ["Submitted",    formatDate(event.created_at)],
                ["Reviewed at", formatDate(event.reviewed_at)],
                ["Submitter",   submitterEmail ?? "Admin / internal"],
                ["Views",       String(event.views_count)],
                ["RSVPs",       String(regCount ?? 0)],
              ].map(([k, v]) => (
                <div key={String(k)} className="flex justify-between gap-2">
                  <dt className="text-[11px]" style={{ color: "#6B7280" }}>{k}</dt>
                  <dd className="text-[11px] text-right" style={{ color: "#D1D5DB" }}>{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Stats */}
          <div className="rounded-2xl border p-5" style={{ backgroundColor: "#0A0F1A", borderColor: "#1E293B" }}>
            <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: "#4B5563" }}>Stats</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Views", value: event.views_count, icon: Eye },
                { label: "RSVPs", value: regCount ?? 0, icon: Users },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-xl p-3 text-center" style={{ backgroundColor: "#0F172A" }}>
                  <Icon className="h-4 w-4 mx-auto mb-1" style={{ color: "#4B5563" }} />
                  <p className="text-xl font-bold" style={{ color: "#F9FAFB" }}>{value}</p>
                  <p className="text-[10px]" style={{ color: "#6B7280" }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
