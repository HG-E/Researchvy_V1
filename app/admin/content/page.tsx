import Link from "next/link";
import { ExternalLink, Clock, Tag, Eye, Share2, Pencil } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { getInsights, getArticleMeta } from "@/lib/cms/mdx";
import { format } from "date-fns";
import type { InsightCategory } from "@/types";

export const dynamic  = "force-dynamic";
export const metadata = generatePageMetadata({ title: "Manage Content" });

const CATEGORY_COLORS: Record<InsightCategory, { bg: string; text: string }> = {
  "scholarly-visibility":     { bg: "rgba(37,99,235,0.12)",  text: "#60A5FA" },
  "research-intelligence":    { bg: "rgba(124,58,237,0.12)", text: "#A78BFA" },
  "scholarly-communication":  { bg: "rgba(5,150,105,0.12)",  text: "#34D399" },
  "modern-scholarly-systems": { bg: "rgba(217,119,6,0.12)",  text: "#FCD34D" },
  "institutional-positioning":{ bg: "rgba(219,39,119,0.12)", text: "#F472B6" },
};

export default async function ManageContentPage() {
  const insights = await getInsights({ limit: 100 });
  const slugs    = insights.map((i) => i.slug);
  const metas    = await getArticleMeta(slugs);
  const metaMap  = Object.fromEntries(metas.map((m) => [m.slug, m]));

  const totalViews  = metas.reduce((sum, m) => sum + (m.view_count ?? 0), 0);
  const totalShares = metas.reduce((sum, m) => sum + (m.share_count ?? 0), 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>
            Admin › Content
          </p>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
            Insights
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#6B7280" }}>
            {insights.length} article{insights.length !== 1 ? "s" : ""} &middot; {totalViews.toLocaleString()} total views &middot; {totalShares.toLocaleString()} shares
          </p>
        </div>
      </div>

      {/* Articles table */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "#1E293B" }}>
        {/* Table head */}
        <div
          className="grid gap-4 px-6 py-3 text-xs font-semibold tracking-wider uppercase border-b"
          style={{
            gridTemplateColumns: "1fr 170px 80px 100px 60px",
            backgroundColor:     "#0F172A",
            borderColor:         "#1E293B",
            color:               "#4B5563",
          }}
        >
          <span>Title</span>
          <span className="hidden md:block">Category</span>
          <span className="hidden lg:flex items-center gap-1">
            <Eye className="h-3 w-3" /> Stats
          </span>
          <span>Date</span>
          <span />
        </div>

        {insights.length === 0 ? (
          <div className="px-6 py-12 text-center" style={{ backgroundColor: "#0F172A" }}>
            <p className="text-sm" style={{ color: "#4B5563" }}>No insights found.</p>
          </div>
        ) : (
          <div style={{ backgroundColor: "#0F172A" }}>
            {insights.map((insight, i) => {
              const colors = CATEGORY_COLORS[insight.category];
              const meta   = metaMap[insight.slug];
              const views  = meta?.view_count  ?? 0;
              const shares = meta?.share_count ?? 0;
              const edited = meta?.updated_at;

              return (
                <div
                  key={insight.slug}
                  className="grid gap-4 items-center px-6 py-4 border-b last:border-0"
                  style={{
                    gridTemplateColumns: "1fr 170px 80px 100px 60px",
                    borderColor:         "#1E293B",
                    backgroundColor:     i % 2 === 0 ? "#0F172A" : "#0A1120",
                  }}
                >
                  {/* Title + tags */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate" style={{ color: "#F9FAFB" }}>
                        {meta?.title ?? insight.title}
                      </p>
                      <Link
                        href={`/insights/${insight.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 transition-colors hover:text-[#60A5FA]"
                        style={{ color: "#4B5563" }}
                        aria-label="View live"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {insight.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="flex items-center gap-1 text-[10px]" style={{ color: "#4B5563" }}>
                          <Tag className="h-2.5 w-2.5" />
                          {tag}
                        </span>
                      ))}
                      {edited && (
                        <span className="text-[10px]" style={{ color: "#1E3A5F" }}>
                          edited {format(new Date(edited), "MMM d")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Category badge */}
                  <span
                    className="hidden md:inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap"
                    style={{ backgroundColor: colors.bg, color: colors.text }}
                  >
                    {insight.category.replace(/-/g, " ")}
                  </span>

                  {/* Stats: views + shares + read time */}
                  <div className="hidden lg:flex flex-col items-end gap-0.5">
                    <span className="flex items-center gap-1 text-xs whitespace-nowrap" style={{ color: "#4B5563" }}>
                      <Eye className="h-3 w-3" />
                      {views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] whitespace-nowrap" style={{ color: "#1E3A5F" }}>
                      <Share2 className="h-2.5 w-2.5" />
                      {shares.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] whitespace-nowrap" style={{ color: "#1E3A5F" }}>
                      <Clock className="h-2.5 w-2.5" />
                      {insight.reading_time} min
                    </span>
                  </div>

                  {/* Date */}
                  <span className="text-xs whitespace-nowrap" style={{ color: "#6B7280" }}>
                    {format(new Date(insight.published_at), "MMM d, yyyy")}
                  </span>

                  {/* Edit button */}
                  <Link
                    href={`/admin/content/${insight.slug}`}
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-[#1E293B] whitespace-nowrap"
                    style={{ color: "#60A5FA" }}
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
