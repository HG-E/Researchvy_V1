import { generatePageMetadata } from "@/lib/seo/metadata";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { OppPublishButton } from "./OppPublishButton";
import { OppDeleteButton }  from "./OppDeleteButton";
import { Calendar, ExternalLink, Zap } from "lucide-react";

export const dynamic  = "force-dynamic";
export const metadata = generatePageMetadata({ title: "Opportunities" });

type Opp = {
  id: string; title: string; category: string; funder: string | null;
  value: string | null; deadline: string | null; apply_url: string;
  target_level: string; is_published: boolean; is_featured: boolean;
  auto_fetched: boolean; created_at: string;
};

const CAT_COLORS: Record<string, string> = {
  grant: "#10B981", fellowship: "#8B5CF6", conference: "#F59E0B",
  speaking: "#06B6D4", collaboration: "#EC4899", job: "#6366F1",
  award: "#F97316", other: "#6B7280",
};

export default async function AdminOpportunitiesPage() {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("research_opportunities")
    .select("id,title,category,funder,value,deadline,apply_url,target_level,is_published,is_featured,auto_fetched,created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const rows         = (data ?? []) as Opp[];
  const pendingCount = rows.filter((r) => !r.is_published).length;
  const liveCount    = rows.filter((r) => r.is_published).length;

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>Admin › Opportunities</p>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>Research Opportunities</h1>
        <p className="mt-1 text-sm" style={{ color: "#6B7280" }}>
          {rows.length} total · <span style={{ color: "#F59E0B" }}>{pendingCount} pending review</span> · <span style={{ color: "#10B981" }}>{liveCount} live</span>
        </p>
      </div>

      {pendingCount > 0 && (
        <div className="rounded-2xl border mb-6 p-4 flex items-start gap-3" style={{ backgroundColor: "rgba(245,158,11,0.06)", borderColor: "rgba(245,158,11,0.2)" }}>
          <Zap className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "#F59E0B" }} />
          <p className="text-sm" style={{ color: "#D97706" }}>
            <strong>{pendingCount} opportunities</strong> waiting for your review. Click <strong>Publish</strong> to make each one live on the board.
          </p>
        </div>
      )}

      {rows.length === 0 ? (
        <div className="rounded-2xl border p-12 text-center" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
          <p className="text-sm mb-1" style={{ color: "#4B5563" }}>No opportunities yet.</p>
          <p className="text-xs" style={{ color: "#374151" }}>The weekly cron runs every Sunday at 6am WAT to auto-fetch from RSS feeds.</p>
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
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
                {rows.map((opp) => (
                  <tr key={opp.id} className="border-b" style={{ borderColor: "#1E293B", backgroundColor: !opp.is_published ? "rgba(245,158,11,0.02)" : "transparent" }}>
                    <td className="px-5 py-4 max-w-xs">
                      <p className="text-xs font-semibold leading-snug mb-0.5" style={{ color: "#F9FAFB" }}>
                        {opp.title.slice(0, 90)}{opp.title.length > 90 ? "…" : ""}
                      </p>
                      {opp.funder && <p className="text-[11px]" style={{ color: "#4B5563" }}>{opp.funder}</p>}
                      {opp.value  && <p className="text-[11px] font-semibold" style={{ color: "#10B981" }}>{opp.value}</p>}
                      {opp.auto_fetched && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(99,102,241,0.1)", color: "#818CF8" }}>auto-fetched</span>
                      )}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize"
                        style={{ backgroundColor: `${CAT_COLORS[opp.category] ?? "#6B7280"}18`, color: CAT_COLORS[opp.category] ?? "#6B7280" }}>
                        {opp.category}
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
                        style={{ backgroundColor: opp.is_published ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)", color: opp.is_published ? "#10B981" : "#F59E0B" }}>
                        {opp.is_published ? "Live" : "Draft"}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex flex-col items-end gap-1.5">
                        <OppPublishButton oppId={opp.id} isPublished={opp.is_published} />
                        <div className="flex items-center gap-2">
                          <a href={opp.apply_url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px]" style={{ color: "#4B5563" }}>
                            <ExternalLink className="h-3 w-3" /> Source
                          </a>
                          <OppDeleteButton oppId={opp.id} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
