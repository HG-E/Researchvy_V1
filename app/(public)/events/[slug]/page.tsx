import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin, Users, ExternalLink, Globe, Mail, Clock, Tag, BookOpen, ChevronLeft, Plane, Lock } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { createSupabaseAdminClient, getServerUser } from "@/lib/auth/supabase";
import { EventTypeBadge, EventFormatBadge } from "@/components/events/EventTypeBadge";
import { SaveEventButton } from "@/components/events/SaveEventButton";
import { RSVPButton } from "@/components/events/RSVPButton";
import type { AcademicEvent } from "@/types/event";

export const revalidate = 60;

async function getEvent(slug: string): Promise<AcademicEvent | null> {
  try {
    const admin = createSupabaseAdminClient();
    const { data } = await admin.from("events").select("*").eq("slug", slug).in("status", ["published", "featured"]).single();
    if (data) {
      admin.from("events").update({ views_count: (data.views_count ?? 0) + 1 }).eq("id", data.id).then(() => {});
    }
    return data as AcademicEvent | null;
  } catch { return null; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return {};
  return generatePageMetadata({
    title: event.title,
    description: event.short_description ?? event.description.slice(0, 160),
    path: `/events/${slug}`,
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function isUpcoming(date: string) { return new Date(date) > new Date(); }
function isPast(date: string)     { return new Date(date) < new Date(); }

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event    = await getEvent(slug);
  if (!event) notFound();

  const user  = await getServerUser();
  const admin = createSupabaseAdminClient();

  let isSaved        = false;
  let userRegStatus: "registered" | "waitlisted" | "cancelled" | "attended" | null = null;
  let registrationCount = 0;

  if (user) {
    const [saveRes, regRes] = await Promise.all([
      admin.from("event_saves").select("saved_at").eq("event_id", event.id).eq("user_id", user.id).single(),
      admin.from("event_registrations").select("status").eq("event_id", event.id).eq("user_id", user.id).single(),
    ]);
    isSaved       = !!saveRes.data;
    userRegStatus = (regRes.data?.status as typeof userRegStatus) ?? null;
  }

  if (event.registration_type === "internal" && event.capacity) {
    const { count } = await admin
      .from("event_registrations")
      .select("id", { count: "exact", head: true })
      .eq("event_id", event.id)
      .in("status", ["registered", "waitlisted"]);
    registrationCount = count ?? 0;
  }

  // Fetch linked opportunity if cross-linked
  let linkedOpportunity: { id: string; title: string; category: string } | null = null;
  if (event.linked_opportunity_id) {
    const { data: opp } = await admin
      .from("research_opportunities")
      .select("id,title,category")
      .eq("id", event.linked_opportunity_id)
      .single();
    linkedOpportunity = opp ?? null;
  }

  const upcoming         = isUpcoming(event.start_date);
  const past             = isPast(event.end_date ?? event.start_date);
  const isFull           = !!(event.capacity && registrationCount >= event.capacity && userRegStatus !== "registered");
  const hasRegDeadline   = !!(event.registration_deadline && isUpcoming(event.registration_deadline));
  const hasCFP           = !!(event.call_for_papers_deadline && isUpcoming(event.call_for_papers_deadline));
  const registrationOpen = upcoming && (!event.registration_deadline || hasRegDeadline);
  const isCompetitive    = event.is_competitive_admission ?? false;
  const hasFunding       = event.has_travel_funding ?? false;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080E1A" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/events" className="flex items-center gap-1.5 text-xs font-semibold hover:text-white transition-colors"
            style={{ color: "#4B5563" }}>
            <ChevronLeft className="h-3.5 w-3.5" />
            Back to Events
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

          {/* Left — main content */}
          <div className="lg:col-span-2">

            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <EventTypeBadge type={event.event_type} />
                <EventFormatBadge format={event.format} />
                {event.is_featured && (
                  <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    style={{ backgroundColor: "rgba(139,92,246,0.12)", color: "#A78BFA" }}>
                    ★ Featured
                  </span>
                )}
                {past && (
                  <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    style={{ backgroundColor: "rgba(100,116,139,0.1)", color: "#64748B" }}>
                    Past Event
                  </span>
                )}
                {hasFunding && (
                  <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    style={{ backgroundColor: "rgba(34,211,238,0.08)", color: "#22D3EE" }}>
                    <Plane className="h-3 w-3" /> Travel Funding Available
                  </span>
                )}
                {isCompetitive && (
                  <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    style={{ backgroundColor: "rgba(245,158,11,0.08)", color: "#F59E0B" }}>
                    <Lock className="h-3 w-3" /> Competitive Admission
                  </span>
                )}
                {event.organizer_type === "researchvy" && (
                  <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    style={{ backgroundColor: "rgba(37,99,235,0.12)", color: "#60A5FA" }}>
                    Researchvy Event
                  </span>
                )}
              </div>

              <h1
                className="text-3xl sm:text-4xl font-bold mb-4 leading-tight"
                style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB", letterSpacing: "-0.02em" }}
              >
                {event.title}
              </h1>

              {event.short_description && (
                <p className="text-base leading-relaxed mb-6" style={{ color: "#6B7280" }}>
                  {event.short_description}
                </p>
              )}

              <SaveEventButton slug={event.slug} initialSaved={isSaved} isAuthenticated={!!user} />
            </div>

            {/* Meta cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="rounded-xl border p-4" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
                <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: "#4B5563" }}>Date &amp; Time</p>
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: "#2563EB" }} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#F9FAFB" }}>{formatDate(event.start_date)}</p>
                    {event.end_date && (
                      <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>Ends {formatDate(event.end_date)}</p>
                    )}
                    {event.timezone && <p className="text-[11px] mt-1" style={{ color: "#4B5563" }}>{event.timezone}</p>}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border p-4" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
                <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: "#4B5563" }}>
                  {event.format === "virtual" ? "Platform" : "Location"}
                </p>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: "#10B981" }} />
                  <div>
                    {event.venue    && <p className="text-sm font-semibold" style={{ color: "#F9FAFB" }}>{event.venue}</p>}
                    {event.location && <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{event.location}</p>}
                    {!event.venue && !event.location && <p className="text-sm" style={{ color: "#4B5563" }}>TBA</p>}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border p-4" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
                <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: "#4B5563" }}>Organiser</p>
                <div className="flex items-start gap-2">
                  <Users className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: "#F59E0B" }} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#F9FAFB" }}>{event.organizer_name}</p>
                    {event.organizer_email && (
                      <a href={`mailto:${event.organizer_email}`} className="text-xs mt-0.5 flex items-center gap-1 hover:underline"
                        style={{ color: "#6B7280" }}>
                        <Mail className="h-3 w-3" /> {event.organizer_email}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border p-4" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
                <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: "#4B5563" }}>
                  {isCompetitive ? "Admission" : "Fee"}
                </p>
                {isCompetitive ? (
                  <>
                    <p className="text-sm font-semibold" style={{ color: "#F59E0B" }}>Competitive</p>
                    <p className="text-xs mt-1" style={{ color: "#4B5563" }}>Application required to attend</p>
                  </>
                ) : (
                  <>
                    <p className="text-xl font-bold" style={{ color: event.is_free ? "#10B981" : "#F9FAFB" }}>
                      {event.is_free ? "Free" : `${event.fee_currency} ${event.fee_amount?.toLocaleString()}`}
                    </p>
                    {event.target_audience !== "all" && (
                      <p className="text-xs mt-1 capitalize" style={{ color: "#4B5563" }}>
                        For {event.target_audience.replace("_", "-")} researchers
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Funding panel */}
            {hasFunding && (
              <div className="rounded-xl border p-5 mb-6"
                style={{ backgroundColor: "rgba(34,211,238,0.04)", borderColor: "rgba(34,211,238,0.2)" }}>
                <div className="flex items-start gap-3">
                  <Plane className="h-5 w-5 flex-shrink-0" style={{ color: "#22D3EE" }} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold mb-1" style={{ color: "#F9FAFB" }}>Travel Funding Available</p>
                    {event.funding_description && (
                      <p className="text-xs leading-relaxed mb-2" style={{ color: "#9CA3AF" }}>{event.funding_description}</p>
                    )}
                    {event.funding_url && (
                      <a href={event.funding_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium"
                        style={{ color: "#22D3EE" }}>
                        <ExternalLink className="h-3 w-3" /> Apply for funding
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Urgency banners */}
            {hasCFP && (
              <div className="rounded-xl border px-5 py-4 mb-6 flex items-center gap-3"
                style={{ backgroundColor: "rgba(245,158,11,0.05)", borderColor: "rgba(245,158,11,0.2)" }}>
                <Clock className="h-4 w-4 flex-shrink-0" style={{ color: "#F59E0B" }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#F9FAFB" }}>Call for Papers open</p>
                  <p className="text-xs" style={{ color: "#6B7280" }}>
                    Submission deadline: {formatDateTime(event.call_for_papers_deadline!)}
                  </p>
                </div>
                {event.call_for_papers_url && (
                  <a href={event.call_for_papers_url} target="_blank" rel="noopener noreferrer"
                    className="ml-auto flex items-center gap-1 text-xs font-semibold whitespace-nowrap"
                    style={{ color: "#F59E0B" }}>
                    Submit Paper <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}

            {/* Description */}
            <div className="rounded-2xl border p-6 mb-8" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: "#4B5563" }}>About this event</p>
              <div
                className="text-sm leading-relaxed prose-invert max-w-none"
                style={{ color: "#9CA3AF", whiteSpace: "pre-wrap" }}
              >
                {event.description}
              </div>
            </div>

            {/* Disciplines & Tags */}
            {(event.disciplines?.length > 0 || event.tags?.length > 0) && (
              <div className="mb-8">
                {event.disciplines?.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <BookOpen className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#4B5563" }} />
                    {event.disciplines.map((d) => (
                      <span key={d} className="rounded-full px-2.5 py-1 text-[11px] font-medium"
                        style={{ backgroundColor: "rgba(37,99,235,0.08)", color: "#60A5FA" }}>
                        {d}
                      </span>
                    ))}
                  </div>
                )}
                {event.tags?.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#4B5563" }} />
                    {event.tags.map((t) => (
                      <span key={t} className="rounded-full px-2.5 py-1 text-[11px] font-medium"
                        style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "#6B7280", border: "1px solid #1E293B" }}>
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Cross-link: linked opportunity */}
            {linkedOpportunity && (
              <div className="rounded-2xl border p-5 mb-8" style={{ backgroundColor: "#0F172A", borderColor: "#7C3AED" }}>
                <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#7C3AED" }}>
                  Related Opportunity
                </p>
                <p className="text-sm font-semibold mb-3" style={{ color: "#F9FAFB" }}>{linkedOpportunity.title}</p>
                <Link href={`/opportunities/${linkedOpportunity.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium"
                  style={{ color: "#60A5FA" }}>
                  <ExternalLink className="h-3 w-3" /> View opportunity details
                </Link>
              </div>
            )}
          </div>

          {/* Right — sticky sidebar */}
          <div className="space-y-4">
            <div
              className="rounded-2xl border p-6 sticky top-24"
              style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
            >
              <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color: "#4B5563" }}>
                {past ? "This event has ended" : isCompetitive ? "Apply to attend" : "Register for this event"}
              </p>

              {/* Competitive admission — show application link */}
              {isCompetitive && !past && event.application_url && (
                <a
                  href={event.application_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold text-white mb-4"
                  style={{ backgroundColor: "#F59E0B", color: "#000" }}
                >
                  <ExternalLink className="h-4 w-4" />
                  Apply to Attend
                </a>
              )}

              {/* Competitive — no URL, just instructions */}
              {isCompetitive && !past && !event.application_url && event.registration_url && (
                <a
                  href={event.registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold text-white mb-4"
                  style={{ backgroundColor: "#F59E0B", color: "#000" }}
                >
                  <ExternalLink className="h-4 w-4" />
                  Apply to Attend
                </a>
              )}

              {/* RSVP (internal, non-competitive) */}
              {event.registration_type === "internal" && !past && registrationOpen && !isCompetitive && (
                <div className="mb-4">
                  <RSVPButton
                    slug={event.slug}
                    isAuthenticated={!!user}
                    currentStatus={userRegStatus}
                    isFull={isFull}
                    isPast={past}
                  />
                  {event.capacity && (
                    <p className="text-center text-[11px] mt-2" style={{ color: "#4B5563" }}>
                      {Math.max(0, event.capacity - registrationCount)} of {event.capacity} spots remaining
                    </p>
                  )}
                </div>
              )}

              {/* External registration (non-competitive) */}
              {event.registration_type === "external" && event.registration_url && !past && !isCompetitive && (
                <a
                  href={event.registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold text-white mb-4"
                  style={{ backgroundColor: "#2563EB" }}
                >
                  <ExternalLink className="h-4 w-4" />
                  Register on Organiser Site
                </a>
              )}

              {/* Funding indicator in sidebar */}
              {hasFunding && (
                <div className="rounded-lg px-3 py-2.5 mb-4 flex items-center gap-2"
                  style={{ backgroundColor: "rgba(34,211,238,0.06)", border: "1px solid rgba(34,211,238,0.15)" }}>
                  <Plane className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#22D3EE" }} />
                  <p className="text-[11px] font-semibold" style={{ color: "#22D3EE" }}>Travel funding available</p>
                </div>
              )}

              {/* Application / registration deadline */}
              {event.registration_deadline && (
                <div className="rounded-lg px-3 py-2 mb-4 text-[11px]"
                  style={{
                    backgroundColor: hasRegDeadline ? "rgba(239,68,68,0.06)" : "rgba(100,116,139,0.06)",
                    color: hasRegDeadline ? "#F87171" : "#6B7280",
                  }}>
                  {isCompetitive
                    ? hasRegDeadline
                      ? `Application closes ${formatDateTime(event.registration_deadline)}`
                      : `Applications closed ${formatDateTime(event.registration_deadline)}`
                    : hasRegDeadline
                    ? `Registration closes ${formatDateTime(event.registration_deadline)}`
                    : `Registration closed ${formatDateTime(event.registration_deadline)}`}
                </div>
              )}

              {/* Website link */}
              {event.website_url && (
                <a
                  href={event.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold border mb-4"
                  style={{ borderColor: "#1E293B", color: "#9CA3AF" }}
                >
                  <Globe className="h-4 w-4" />
                  Visit Event Website
                </a>
              )}

              <div className="pt-4 border-t space-y-2" style={{ borderColor: "#1E293B" }}>
                <SaveEventButton slug={event.slug} initialSaved={isSaved} isAuthenticated={!!user} />
                {!user && (
                  <p className="text-[11px] text-center" style={{ color: "#4B5563" }}>
                    <Link href="/signup" style={{ color: "#2563EB" }}>Create an account</Link> to save events and track registrations.
                  </p>
                )}
              </div>
            </div>

            {/* Submit your own event CTA */}
            <div className="rounded-2xl border p-5" style={{ backgroundColor: "#0A0F1A", borderColor: "#1E293B" }}>
              <p className="text-xs font-semibold mb-2" style={{ color: "#F9FAFB" }}>Organising an event?</p>
              <p className="text-xs leading-relaxed mb-3" style={{ color: "#4B5563" }}>
                Reach researchers across the Researchvy community. Free to submit, reviewed within 2 days.
              </p>
              <Link href="/events/submit"
                className="w-full inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-xs font-bold text-white"
                style={{ backgroundColor: "#2563EB" }}>
                Submit Your Event
              </Link>
            </div>

            {/* Cross-link to Opportunities board */}
            <div className="rounded-2xl border p-5" style={{ backgroundColor: "#0A0F1A", borderColor: "#1E293B" }}>
              <p className="text-xs font-semibold mb-2" style={{ color: "#F9FAFB" }}>Looking for funded opportunities?</p>
              <p className="text-xs leading-relaxed mb-3" style={{ color: "#4B5563" }}>
                Browse grants, travel bursaries, fellowships and more on the Opportunities Board.
              </p>
              <Link href="/opportunities"
                className="w-full inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-xs font-semibold border"
                style={{ borderColor: "#1E293B", color: "#9CA3AF" }}>
                Browse Opportunities →
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
