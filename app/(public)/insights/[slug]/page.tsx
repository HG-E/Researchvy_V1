import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { format } from "date-fns";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { getInsightBySlug, getInsightSlugs, getInsights } from "@/lib/cms/mdx";
import { MdxContent } from "@/components/insights/MdxContent";
import { ReadingProgressBar } from "@/components/insights/ReadingProgressBar";
import { TableOfContents, type TocHeading } from "@/components/insights/TableOfContents";
import { ShareButtons } from "@/components/insights/ShareButtons";
import { InsightCard } from "@/components/insights/InsightCard";
import { siteConfig } from "@/config/site";
import { articleSchema, breadcrumbSchema } from "@/lib/seo/schemas";
import type { InsightCategory } from "@/types";

const CATEGORY_LABELS: Record<InsightCategory, string> = {
  "scholarly-visibility":     "Scholarly Visibility",
  "research-intelligence":    "Research Intelligence",
  "scholarly-communication":  "Scholarly Communication",
  "modern-scholarly-systems": "Modern Scholarly Systems",
  "institutional-positioning":"Institutional Positioning",
};

const CATEGORY_COLORS: Record<InsightCategory, { bg: string; text: string }> = {
  "scholarly-visibility":     { bg: "rgba(37,99,235,0.1)",  text: "#60A5FA" },
  "research-intelligence":    { bg: "rgba(124,58,237,0.1)", text: "#A78BFA" },
  "scholarly-communication":  { bg: "rgba(5,150,105,0.1)",  text: "#34D399" },
  "modern-scholarly-systems": { bg: "rgba(217,119,6,0.1)",  text: "#FCD34D" },
  "institutional-positioning":{ bg: "rgba(219,39,119,0.1)", text: "#F472B6" },
};

function extractToc(content: string): TocHeading[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: TocHeading[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text  = match[2].trim().replace(/[*_`]/g, "");
    const id    = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    headings.push({ id, text, level });
  }
  return headings;
}

export async function generateStaticParams() {
  return getInsightSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const insight = await getInsightBySlug(slug);
  if (!insight) return {};
  return generatePageMetadata({
    title:       insight.seo_title ?? insight.title,
    description: insight.seo_description ?? insight.excerpt,
    path:        `/insights/${slug}`,
    article: {
      publishedAt: insight.published_at,
      author:      insight.author?.name ?? "Researchvy Editorial",
      tags:        insight.tags,
    },
  });
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const insight = await getInsightBySlug(slug);
  if (!insight) notFound();

  const toc         = extractToc(insight.content);
  const colors      = CATEGORY_COLORS[insight.category];
  const articleUrl  = `${siteConfig.url}/insights/${slug}`;

  const related = (await getInsights({ category: insight.category, limit: 4 }))
    .filter((i) => i.slug !== slug)
    .slice(0, 3);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080E1A" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema(insight)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
          { name: "Home",     url: siteConfig.url },
          { name: "Insights", url: `${siteConfig.url}/insights` },
          { name: insight.title, url: `${siteConfig.url}/insights/${slug}` },
        ])) }}
      />
      <ReadingProgressBar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">

        {/* Back link */}
        <Link
          href="/insights"
          className="inline-flex items-center gap-1.5 text-sm mb-10 transition-colors text-[#4B5563] hover:text-[#9CA3AF]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All Insights
        </Link>

        {/* Article header */}
        <header className="max-w-3xl mb-10">
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
              style={{ backgroundColor: colors.bg, color: colors.text }}
            >
              {CATEGORY_LABELS[insight.category]}
            </span>
            <span className="flex items-center gap-1 text-xs" style={{ color: "#4B5563" }}>
              <Clock className="h-3 w-3" />
              {insight.reading_time} min read
            </span>
            <span className="flex items-center gap-1 text-xs" style={{ color: "#4B5563" }}>
              <Calendar className="h-3 w-3" />
              <time dateTime={insight.published_at}>
                {format(new Date(insight.published_at), "MMMM d, yyyy")}
              </time>
            </span>
          </div>

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB", letterSpacing: "-0.02em" }}
          >
            {insight.title}
          </h1>

          <p className="text-lg leading-relaxed mb-6" style={{ color: "#6B7280" }}>
            {insight.excerpt}
          </p>

          <address className="not-italic flex items-center gap-3 pt-5 border-t" style={{ borderColor: "#1E293B" }}>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: "#1E293B", color: "#60A5FA" }}
              aria-hidden="true"
            >
              {(insight.author?.name ?? "R")[0]}
            </div>
            <div>
              <p className="text-sm font-semibold" rel="author" style={{ color: "#F9FAFB" }}>
                {insight.author?.name ?? "Researchvy Editorial"}
              </p>
              <p className="text-xs" style={{ color: "#4B5563" }}>Researchvy</p>
            </div>
          </address>
        </header>

        {/* Content + TOC */}
        <div className="flex gap-16 items-start">

          {/* Article body */}
          <article className="flex-1 min-w-0">
            <MdxContent source={insight.content} />

            {/* Tags */}
            {insight.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mt-10 pt-8 border-t" style={{ borderColor: "#1E293B" }}>
                {insight.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full px-3 py-1 text-xs font-medium"
                    style={{ backgroundColor: "#1E293B", color: "#6B7280" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share */}
            <div className="mt-8">
              <ShareButtons title={insight.title} url={articleUrl} />
            </div>
          </article>

          {/* TOC sidebar — desktop only */}
          {toc.length > 0 && (
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <div className="sticky top-24">
                <TableOfContents headings={toc} />
              </div>
            </aside>
          )}
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <section className="mt-20 pt-12 border-t" style={{ borderColor: "#1E293B" }}>
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#2563EB" }}>
              Continue Reading
            </p>
            <h2
              className="text-2xl font-bold mb-8"
              style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
            >
              More Insights
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((r) => (
                <InsightCard key={r.id} insight={r} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
