import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { OppPublishButton } from "./OppPublishButton";
import { OppDeleteButton }  from "./OppDeleteButton";
import { OppRejectButton }  from "./OppRejectButton";
import { Calendar, ExternalLink, Zap, Plus, Clock } from "lucide-react";

export const dynamic  = "force-dynamic";
export const metadata = generatePageMetadata({ title: "Opportunities" });

type Opp = {
  id: string; title: string; category: string; funder: string | null;
  value: string | null; deadline: string | null; apply_url: string;
  target_level: string; is_published: boolean; is_featured: boolean;
  auto_fetched: boolean; created_at: string;
  submitted_by: string | null; submission_status: string | null;
};

const CAT_META: Record<string, { label: string; color: string }> = {
  grant:          { label: "Grant",                   color: "#10B981" },
  fellowship:     { label: "Fellowship",              color: "#8B5CF6" },
  conference:     { label: "Call for Papers",         color: "#F59E0B" },
  speaking:       { label: "Call for Speakers",       color: "#06B6D4" },
  collaboration:  { label: "Collaboration",           color: "#EC4899" },
  job:            { label: "Job / Position",          color: "#6366F1" },
  award:          { label: "Award / Prize",           color: "#F97316" },
  "travel-grant": { label: "Travel Grant / Bursary", color: "#22D3EE" },
  other:          { label: "Other",                   color: "#6B7280" },
};

export default async function AdminOpportunitiesPage() {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("research_opportunities")
    .select("id,title,category,funder,value,deadline,apply_url,target_level,is_published,is_featured,auto_fetched,created_at,submitted_by,submission_status")
    .order("created_at", { ascending: false })
    .limit(200);

  const rows = (data ?? []) as Opp[];

  // Separate community submissions pending review
  const communityPending = rows.filter((r) => r.submitted_by && r.submission_status === "pending");
  // Main table excludes pending community items (they appear in the dedicated pending section)
  const mainRows         = rows.filter((r) => !(r.submitted_by && r.submission_status === "pending"));
  const published        = mainRows.filter((r) => r.is_published);
  const adminDrafts      = mainRows.filter((r) => !r.is_published && !r.submitted_by);

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>Admin › Opportunities</p>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>Research Opportunities</h1>
          <p className="mt-1 text-sm" style={{ color: "#6B7280" }}>
            {rows.length} total &middot; <span style={{ color: "#10B981" }}>{published.length} live</span>
            {communityPending.length > 0 && (
              <> &middot; <span style={{ color: "#F59E0B" }}>{communityPending.length} pending review</span></>
            )}
          </p>
        </div>
        <Link href="/admin/opportunities/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold flex-shrink-0 transition-colors hover:bg-blue-700"
          style={{ backgroundColor: "#2563EB", color: "#fff" }}>
          <Plus className="h-4 w-4" /> New Opportunity
        </Link>
      </div>

      {/* Community submissions pending review */}
      {communityPending.length > 0 && (
        <div className="mb-8">
          <div className="rounded-2xl border mb-4 p-4 flex items-start gap-3"
            style={{ backgroundColor: "rgba(245,158,11,0.06)", borderColor: "rgba(245,158,11,0.2)" }}>
            <Clock className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "#F59E0B" }} />
            <p className="text-sm" style={{ color: "#D97706" }}>
              <strong>{communityPending.length} community-submitted {communityPending.length === 1 ? "opportunity" : "opportunities"}</strong> awaiting review.
              <strong> Publish</strong> to approve and notify the submitter, or <strong>Reject</strong> with an optional note.
            </p>
          </div>

          <div className="rounded-2xl border overflow-hidden mb-6" style={{ backgroundColor: "#0F172A", borderColor: "rgba(245,158,11,0.25)" }}>
            <div className="px-5 py-3 border-b flex items-center gap-2" style={{ borderColor: "#1E293B", backgroundColor: "rgba(245,158,11,0.03)" }}>
              <Clock className="h-4 w-4" style={{ color: "#F59E0B" }} />
              <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#D97706" }}>Community Submissions — Pending Review</p>
            </div>
            <OppTable rows={communityPending} showReject />
          </div>
        </div>
      )}

      {/* Auto-fetched drafts callout */}
      {adminDrafts.length > 0 && (
        <div className="rounded-2xl border mb-6 p-4 flex items-start gap-3"
          style={{ backgroundColor: "rgba(245,158,11,0.06)", borderColor: "rgba(245,158,11,0.2)" }}>
          <Zap className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "#F59E0B" }} />
          <p className="text-sm" style={{ color: "#D97706" }}>
            <strong>{adminDrafts.length} auto-fetched {adminDrafts.length === 1 ? "draft" : "drafts"}</strong> waiting for review. Use <strong>Publish</strong> to make each one live on the board.
          </p>
        </div>
      )}

      {/* All rows (excluding pending community submissions — already shown above) */}
      {mainRows.length === 0 && communityPending.length === 0 ? (
        <div className="rounded-2xl border p-12 text-center" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
          <p className="text-sm mb-1" style={{ color: "#4B5563" }}>No opportunities yet.</p>
          <p className="text-xs mb-4" style={{ color: "#374151" }}>The weekly cron runs every Sunday at 6am WAT to auto-fetch from RSS feeds.</p>
          <Link href="/admin/opportunities/new" className="text-sm font-semibold" style={{ color: "#2563EB" }}>
            Create one manually →
          </Link>
        </div>
      ) : mainRows.length > 0 ? (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
          <OppTable rows={mainRows} />
        </div>
      ) : null}
    </div>
  );
}

function OppTable({ rows, showReject = false }: { rows: Opp[]; showReject?: boolean }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-xs font-semibold tracking-wider uppercase" style={{ borderColor: "#1E293B", color: "#4B5563" }}>
            <th className="text-left px-5 py-3">Opportunity</th>
            <th className="text-left px-5 py-3">Category</th>
            <th className="text-left px-5 py-3">Deadline</th>
            <th className="text-left px-5 py-3">Status</th>
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map((opp) => {
            const catInfo = CAT_META[opp.category] ?? { label: opp.category, color: "#6B7280" };
            const isCommunityPending = opp.submitted_by && opp.submission_status === "pending";
            return (
              <tr key={opp.id} className="border-b" style={{
                borderColor: "#1E293B",
                backgroundColor: isCommunityPending ? "rgba(245,158,11,0.02)" : !opp.is_published ? "rgba(99,102,241,0.02)" : "transparent",
              }}>
                <td className="px-5 py-4 max-w-xs">
                  <p className="text-xs font-semibold leading-snug mb-0.5" style={{ color: "#F9FAFB" }}>
                    {opp.title.slice(0, 90)}{opp.title.length > 90 ? "…" : ""}
                  </p>
                  {opp.funder && <p className="text-[11px]" style={{ color: "#4B5563" }}>{opp.funder}</p>}
                  {opp.value  && <p className="text-[11px] font-semibold" style={{ color: "#10B981" }}>{opp.value}</p>}
                  {isCommunityPending && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded mt-1 inline-block" style={{ backgroundColor: "rgba(245,158,11,0.1)", color: "#F59E0B" }}>
                      community submission
                    </span>
                  )}
                  {opp.auto_fetched && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded mt-1 inline-block" style={{ backgroundColor: "rgba(99,102,241,0.1)", color: "#818CF8" }}>
                      auto-fetched
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: `${catInfo.color}18`, color: catInfo.color }}>
                    {catInfo.label}
                  </span>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  {opp.deadline ? (
                    <span className="flex items-center gap-1 text-xs" style={{ color: "#9CA3AF" }}>
                      <Calendar className="h-3 w-3" />
                      {new Date(opp.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  ) : (
                    <span className="text-xs" style={{ color: "#374151" }}>Rolling</span>
                  )}
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: isCommunityPending ? "rgba(245,158,11,0.1)" : opp.is_published ? "rgba(16,185,129,0.1)" : "rgba(99,102,241,0.1)",
                      color:           isCommunityPending ? "#F59E0B" : opp.is_published ? "#10B981" : "#818CF8",
                    }}>
                    {isCommunityPending ? "Pending Review" : opp.is_published ? "Live" : "Draft"}
                    {opp.is_published && opp.is_featured && " ★"}
                  </span>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <OppPublishButton oppId={opp.id} isPublished={opp.is_published} />
                      {showReject && isCommunityPending && <OppRejectButton oppId={opp.id} />}
                    </div>
                    <div className="flex items-center gap-2">
                      {opp.is_published && (
                        <Link href={`/opportunities/${opp.id}`} target="_blank"
                          className="inline-flex items-center gap-1 text-[11px]" style={{ color: "#4B5563" }}>
                          <ExternalLink className="h-3 w-3" /> View
                        </Link>
                      )}
                      <a href={opp.apply_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px]" style={{ color: "#4B5563" }}>
                        <ExternalLink className="h-3 w-3" /> Source
                      </a>
                      <OppDeleteButton oppId={opp.id} />
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
