import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { OppStatusPanel } from "@/components/admin/opportunities/OppStatusPanel";
import { ArrowLeft, ExternalLink, Calendar, Target, DollarSign, User, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = createSupabaseAdminClient();
  const { data } = await admin.from("research_opportunities").select("title").eq("id", id).maybeSingle();
  return generatePageMetadata({ title: data?.title ?? "Opportunity Review", noIndex: true });
}

// ── Category badge ─────────────────────────────────────────────────────────────

const CAT: Record<string, { label: string; color: string; bg: string }> = {
  grant:          { label: "Grant",                  color: "#10B981", bg: "rgba(16,185,129,0.12)"  },
  fellowship:     { label: "Fellowship",             color: "#8B5CF6", bg: "rgba(139,92,246,0.12)"  },
  conference:     { label: "Call for Papers",        color: "#F59E0B", bg: "rgba(245,158,11,0.12)"  },
  speaking:       { label: "Call for Speakers",      color: "#06B6D4", bg: "rgba(6,182,212,0.12)"   },
  collaboration:  { label: "Collaboration",          color: "#EC4899", bg: "rgba(236,72,153,0.12)"  },
  job:            { label: "Job / Position",         color: "#6366F1", bg: "rgba(99,102,241,0.12)"  },
  award:          { label: "Award",                  color: "#F97316", bg: "rgba(249,115,22,0.12)"  },
  "travel-grant": { label: "Travel Grant / Bursary", color: "#22D3EE", bg: "rgba(34,211,238,0.12)" },
  other:          { label: "Other",                  color: "#6B7280", bg: "rgba(107,114,128,0.1)"  },
};

const STATUS_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: "Pending Review", color: "#F59E0B", bg: "rgba(245,158,11,0.12)"  },
  published: { label: "Live",           color: "#10B981", bg: "rgba(16,185,129,0.12)"  },
  rejected:  { label: "Rejected",       color: "#F87171", bg: "rgba(239,68,68,0.1)"    },
};

const LEVEL_LABEL: Record<string, string> = {
  early_career: "Early Career",
  mid:          "Mid-Career",
  senior:       "Senior",
  all:          "All Levels",
};

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function OpportunityReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admin = createSupabaseAdminClient();

  // Fetch opportunity + submitter info in parallel
  const { data: opp } = await admin
    .from("research_opportunities")
    .select("id, title, body, category, funder, value, deadline, apply_url, target_level, is_published, is_featured, submission_status, submitted_by, review_note, created_at, updated_at, linked_event_id, auto_fetched")
    .eq("id", id)
    .maybeSingle();

  if (!opp) notFound();

  // Fetch submitter details if community-submitted
  let submitter: { full_name: string; email: string } | null = null;
  if (opp.submitted_by) {
    const { data: sub } = await admin
      .from("users")
      .select("full_name, email")
      .eq("id", opp.submitted_by)
      .maybeSingle();
    submitter = sub ?? null;
  }

  // Fetch linked event title if applicable
  let linkedEventTitle: string | null = null;
  if (opp.linked_event_id) {
    const { data: evt } = await admin
      .from("events")
      .select("title, slug")
      .eq("id", opp.linked_event_id)
      .maybeSingle();
    linkedEventTitle = evt?.title ?? null;
  }

  const cat    = CAT[opp.category as string]    ?? CAT.other;
  const status = STATUS_BADGE[opp.submission_status as string] ?? STATUS_BADGE.published;
  const isFeatured = opp.is_featured as boolean ?? false;

  return (
    <div>
      {/* Back link */}
      <Link
        href="/admin/opportunities"
        className="inline-flex items-center gap-1.5 text-sm mb-6 transition-opacity hover:opacity-70"
        style={{ color: "#6B7280" }}
      >
        <ArrowLeft className="h-4 w-4" />
        All opportunities
      </Link>

      {/* Page header */}
      <div className="flex flex-wrap items-start gap-3 mb-8">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-2 mb-2">
            <span
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: cat.bg, color: cat.color }}
            >
              {cat.label}
            </span>
            <span
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: status.bg, color: status.color }}
            >
              {isFeatured ? "★ Featured" : status.label}
            </span>
            {opp.auto_fetched && (
              <span
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: "rgba(37,99,235,0.1)", color: "#60A5FA" }}
              >
                Auto-fetched
              </span>
            )}
          </div>
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
          >
            {opp.title as string}
          </h1>
        </div>
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left: full detail (2/3) ─────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Key facts */}
          <div
            className="rounded-2xl border p-6"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            <h2 className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#6B7280" }}>
              Key Facts
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {opp.funder && (
                <div className="flex items-start gap-2.5">
                  <User className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: "#4B5563" }} />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#4B5563" }}>Funder / Organiser</p>
                    <p className="text-sm mt-0.5" style={{ color: "#F9FAFB" }}>{opp.funder as string}</p>
                  </div>
                </div>
              )}
              {opp.value && (
                <div className="flex items-start gap-2.5">
                  <DollarSign className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: "#4B5563" }} />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#4B5563" }}>Value / Stipend</p>
                    <p className="text-sm mt-0.5" style={{ color: "#10B981" }}>{opp.value as string}</p>
                  </div>
                </div>
              )}
              {opp.deadline && (
                <div className="flex items-start gap-2.5">
                  <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: "#4B5563" }} />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#4B5563" }}>Deadline</p>
                    <p className="text-sm mt-0.5" style={{ color: "#F9FAFB" }}>
                      {new Date(opp.deadline as string).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>
              )}
              {opp.target_level && (
                <div className="flex items-start gap-2.5">
                  <Target className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: "#4B5563" }} />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#4B5563" }}>Target Level</p>
                    <p className="text-sm mt-0.5" style={{ color: "#F9FAFB" }}>
                      {LEVEL_LABEL[opp.target_level as string] ?? opp.target_level as string}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-2.5 sm:col-span-2">
                <ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: "#4B5563" }} />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#4B5563" }}>Apply / Learn More</p>
                  <a
                    href={opp.apply_url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm mt-0.5 break-all hover:underline"
                    style={{ color: "#60A5FA" }}
                  >
                    {opp.apply_url as string}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Full description */}
          <div
            className="rounded-2xl border p-6"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            <h2 className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#6B7280" }}>
              Description
            </h2>
            <p
              className="text-sm leading-relaxed whitespace-pre-wrap"
              style={{ color: "#9CA3AF" }}
            >
              {opp.body as string}
            </p>
          </div>

          {/* Linked event */}
          {linkedEventTitle && (
            <div
              className="rounded-2xl border p-5 flex items-center gap-3"
              style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
            >
              <Calendar className="h-4 w-4 flex-shrink-0" style={{ color: "#60A5FA" }} />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: "#4B5563" }}>
                  Linked Event
                </p>
                <Link
                  href={`/admin/events/${opp.linked_event_id as string}`}
                  className="text-sm font-medium hover:underline truncate"
                  style={{ color: "#60A5FA" }}
                >
                  {linkedEventTitle}
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: actions + meta (1/3) ─────────────────────────── */}
        <div className="space-y-4">

          {/* Status actions */}
          <div
            className="rounded-2xl border p-5"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            <h2 className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#6B7280" }}>
              Review Actions
            </h2>
            <OppStatusPanel
              oppId={id}
              isPublished={opp.is_published as boolean}
              isFeatured={isFeatured}
              submissionStatus={opp.submission_status as string ?? "published"}
            />
            {opp.is_published && (
              <a
                href={`/opportunities/${id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-70"
                style={{ color: "#6B7280" }}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                View live opportunity
              </a>
            )}
          </div>

          {/* Submission info */}
          <div
            className="rounded-2xl border p-5 space-y-3"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            <h2 className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#6B7280" }}>
              Submission Info
            </h2>

            <div className="flex items-start gap-2.5">
              <Clock className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" style={{ color: "#4B5563" }} />
              <div>
                <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "#4B5563" }}>Submitted</p>
                <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>
                  {new Date(opp.created_at as string).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            </div>

            {submitter ? (
              <div className="flex items-start gap-2.5">
                <User className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" style={{ color: "#4B5563" }} />
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "#4B5563" }}>Submitter</p>
                  <p className="text-xs mt-0.5" style={{ color: "#F9FAFB" }}>{submitter.full_name}</p>
                  <p className="text-xs" style={{ color: "#6B7280" }}>{submitter.email}</p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-[10px] uppercase tracking-widest font-semibold mb-0.5" style={{ color: "#4B5563" }}>Source</p>
                <p className="text-xs" style={{ color: "#6B7280" }}>Admin / Auto-fetched</p>
              </div>
            )}

            {opp.review_note && (
              <div className="rounded-xl border p-3" style={{ borderColor: "rgba(239,68,68,0.2)", backgroundColor: "rgba(239,68,68,0.05)" }}>
                <p className="text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: "#F87171" }}>Review Note</p>
                <p className="text-xs leading-relaxed" style={{ color: "#9CA3AF" }}>{opp.review_note as string}</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
