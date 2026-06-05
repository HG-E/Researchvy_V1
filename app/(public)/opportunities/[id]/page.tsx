import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { opportunitySchema } from "@/lib/seo/schemas";
import { Calendar, ExternalLink, Banknote, ArrowLeft, Plane, Globe, Users } from "lucide-react";
import type { ResearchOpportunity, OpportunityCategory } from "@/types/opportunity";

function renderBody(raw: string): { __html: string } {
  const escaped = raw
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const html = escaped
    .replace(/^#{1,6}\s+(.+)$/gm, (_m, t) => `<strong>${t}</strong>`)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#60A5FA;text-decoration:underline;">$1</a>')
    .replace(/^[-*+]\s+(.+)$/gm, "• $1")
    .replace(/^(\d+)\.\s+(.+)$/gm, "$1. $2")
    .replace(/\n\n+/g, "</p><p>")
    .replace(/\n/g, "<br/>");

  return { __html: `<p>${html}</p>` };
}

export const revalidate = 120;

const CAT_META: Record<OpportunityCategory, { label: string; color: string; bg: string }> = {
  grant:          { label: "Grant",                   color: "#10B981", bg: "rgba(16,185,129,0.1)"  },
  fellowship:     { label: "Fellowship",              color: "#8B5CF6", bg: "rgba(139,92,246,0.1)"  },
  conference:     { label: "Call for Papers",         color: "#F59E0B", bg: "rgba(245,158,11,0.1)"  },
  speaking:       { label: "Call for Speakers",       color: "#06B6D4", bg: "rgba(6,182,212,0.1)"   },
  collaboration:  { label: "Collaboration",           color: "#EC4899", bg: "rgba(236,72,153,0.1)"  },
  job:            { label: "Job / Position",          color: "#6366F1", bg: "rgba(99,102,241,0.1)"  },
  award:          { label: "Award / Prize",           color: "#F97316", bg: "rgba(249,115,22,0.1)"  },
  "travel-grant": { label: "Travel Grant / Bursary", color: "#22D3EE", bg: "rgba(34,211,238,0.1)"  },
  other:          { label: "Other",                   color: "#6B7280", bg: "rgba(107,114,128,0.1)" },
};

const LEVEL_LABEL: Record<string, string> = {
  early_career: "Early-Career Researchers",
  mid:          "Mid-Career Researchers",
  senior:       "Senior Researchers",
  all:          "Open to All Levels",
};

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("research_opportunities")
    .select("title,body")
    .eq("id", id)
    .eq("is_published", true)
    .single();
  if (!data) return generatePageMetadata({ title: "Opportunity Not Found" });
  return generatePageMetadata({
    title: data.title,
    description: data.body?.slice(0, 160),
  });
}

export default async function OpportunityDetailPage({ params }: Props) {
  const { id } = await params;
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("research_opportunities")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .single();

  if (!data) notFound();
  const opp = data as ResearchOpportunity;
  const cat = CAT_META[opp.category] ?? CAT_META.other;

  const isPast      = opp.deadline ? new Date(opp.deadline) < new Date() : false;
  const expiring    = opp.deadline ? (new Date(opp.deadline).getTime() - Date.now()) / 86_400_000 < 7 : false;
  const daysLeft    = opp.deadline ? Math.ceil((new Date(opp.deadline).getTime() - Date.now()) / 86_400_000) : null;

  // Fetch linked event if any
  let linkedEvent: { title: string; slug: string } | null = null;
  if (opp.linked_event_id) {
    const { data: ev } = await admin
      .from("events")
      .select("title,slug")
      .eq("id", opp.linked_event_id)
      .single();
    linkedEvent = ev ?? null;
  }

  const ldSchema = opportunitySchema({
    id:          opp.id,
    title:       opp.title,
    description: opp.body,
    category:    opp.category,
    funder:      opp.funder ?? null,
    value:       opp.value ?? null,
    deadline:    opp.deadline ?? null,
    applyUrl:    opp.apply_url,
    targetLevel: opp.target_level,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldSchema) }}
      />
    <div className="min-h-screen" style={{ backgroundColor: "#080E1A" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Back */}
        <Link href="/opportunities"
          className="inline-flex items-center gap-2 text-xs font-medium mb-8 transition-colors hover:opacity-80"
          style={{ color: "#6B7280" }}>
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Opportunities
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: cat.bg, color: cat.color }}>
                  {cat.label}
                </span>
                {opp.category === "travel-grant" && (
                  <span className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-full"
                    style={{ backgroundColor: "rgba(34,211,238,0.08)", color: "#22D3EE" }}>
                    <Plane className="h-3 w-3" /> Travel funded
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-2"
                style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
                {opp.title}
              </h1>
              {opp.funder && (
                <p className="text-sm" style={{ color: "#9CA3AF" }}>by {opp.funder}</p>
              )}
            </div>

            {/* Deadline urgency */}
            {opp.deadline && !isPast && expiring && (
              <div className="rounded-xl border p-4 flex items-center gap-3"
                style={{ backgroundColor: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.25)" }}>
                <Calendar className="h-4 w-4 flex-shrink-0" style={{ color: "#EF4444" }} />
                <p className="text-sm font-medium" style={{ color: "#FCA5A5" }}>
                  Deadline closing soon — {daysLeft} {daysLeft === 1 ? "day" : "days"} remaining
                </p>
              </div>
            )}
            {isPast && (
              <div className="rounded-xl border p-4" style={{ backgroundColor: "rgba(107,114,128,0.06)", borderColor: "#1E293B" }}>
                <p className="text-sm" style={{ color: "#6B7280" }}>This opportunity has closed. You may still find similar ones below.</p>
              </div>
            )}

            {/* Description */}
            <div>
              <h2 className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#4B5563" }}>
                About this Opportunity
              </h2>
              <div className="rounded-2xl border p-6" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
                <div
                  className="text-sm leading-relaxed opp-body"
                  style={{ color: "#9CA3AF" }}
                  dangerouslySetInnerHTML={renderBody(opp.body)}
                />
              </div>
            </div>

            {/* Linked event */}
            {linkedEvent && (
              <div className="rounded-2xl border p-5" style={{ backgroundColor: "#0F172A", borderColor: "#7C3AED" }}>
                <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#7C3AED" }}>
                  Related Event
                </p>
                <p className="text-sm font-semibold mb-3" style={{ color: "#F9FAFB" }}>{linkedEvent.title}</p>
                <Link href={`/events/${linkedEvent.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium"
                  style={{ color: "#60A5FA" }}>
                  <ExternalLink className="h-3 w-3" /> View event details
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Apply CTA */}
            <div className="rounded-2xl border p-5 sticky top-6" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
              <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#4B5563" }}>
                Quick Info
              </p>

              <dl className="space-y-3 mb-5">
                {opp.funder && (
                  <div>
                    <dt className="text-[11px] font-semibold mb-0.5" style={{ color: "#4B5563" }}>Funder</dt>
                    <dd className="text-sm font-medium flex items-center gap-2" style={{ color: "#F9FAFB" }}>
                      <Globe className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#6B7280" }} />
                      {opp.funder}
                    </dd>
                  </div>
                )}

                {opp.value && (
                  <div>
                    <dt className="text-[11px] font-semibold mb-0.5" style={{ color: "#4B5563" }}>Value</dt>
                    <dd className="text-sm font-semibold flex items-center gap-2" style={{ color: "#10B981" }}>
                      <Banknote className="h-3.5 w-3.5 flex-shrink-0" />
                      {opp.value}
                    </dd>
                  </div>
                )}

                <div>
                  <dt className="text-[11px] font-semibold mb-0.5" style={{ color: "#4B5563" }}>Target Level</dt>
                  <dd className="text-sm flex items-center gap-2" style={{ color: "#9CA3AF" }}>
                    <Users className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#6B7280" }} />
                    {LEVEL_LABEL[opp.target_level] ?? opp.target_level}
                  </dd>
                </div>

                {opp.deadline && (
                  <div>
                    <dt className="text-[11px] font-semibold mb-0.5" style={{ color: "#4B5563" }}>Deadline</dt>
                    <dd className={`text-sm font-medium flex items-center gap-2 ${isPast ? "line-through" : ""}`}
                      style={{ color: expiring ? "#EF4444" : isPast ? "#4B5563" : "#F9FAFB" }}>
                      <Calendar className="h-3.5 w-3.5 flex-shrink-0" style={{ color: expiring ? "#EF4444" : "#6B7280" }} />
                      {new Date(opp.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                      {!isPast && daysLeft !== null && daysLeft <= 30 && (
                        <span className="text-[11px]" style={{ color: expiring ? "#EF4444" : "#6B7280" }}>
                          ({daysLeft}d left)
                        </span>
                      )}
                    </dd>
                  </div>
                )}
              </dl>

              <a
                href={opp.apply_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-colors"
                style={{ backgroundColor: isPast ? "#1E293B" : "#2563EB", color: isPast ? "#4B5563" : "#fff" }}
              >
                <ExternalLink className="h-4 w-4" />
                {isPast ? "Closed — View Details" : "Apply / Learn More"}
              </a>

              {opp.auto_fetched && opp.source_url && (
                <p className="text-[11px] mt-3 text-center" style={{ color: "#374151" }}>
                  <a href={opp.source_url} target="_blank" rel="noopener noreferrer" style={{ color: "#4B5563" }}>
                    Source link
                  </a>
                </p>
              )}
            </div>

            {/* Submit similar */}
            <div className="rounded-2xl border p-5" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "#F9FAFB" }}>Know a similar opportunity?</p>
              <p className="text-[11px] mb-3" style={{ color: "#6B7280" }}>Help the community by sharing it with us.</p>
              <Link href="/opportunities/submit"
                className="text-xs font-semibold" style={{ color: "#2563EB" }}>
                Submit an opportunity →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
