import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Calendar } from "lucide-react";
import { format } from "date-fns";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { getInsightBySlug, getInsightSlugs, getInsights, getArticleMetaSingle } from "@/lib/cms/mdx";
import { getServerUser } from "@/lib/auth/supabase";
import { MdxContent } from "@/components/insights/MdxContent";
import { ReadingProgressBar } from "@/components/insights/ReadingProgressBar";
import { TableOfContents, type TocHeading } from "@/components/insights/TableOfContents";
import { ShareButtons } from "@/components/insights/ShareButtons";
import { InsightCard } from "@/components/insights/InsightCard";
import { ArticleViewTracker } from "@/components/insights/ArticleViewTracker";
import { ScrollTriggerLeadCapture } from "@/components/insights/ScrollTriggerLeadCapture";
import { siteConfig } from "@/config/site";
import { articleSchema, breadcrumbSchema } from "@/lib/seo/schemas";
import { safeJsonLd } from "@/lib/seo/safeJsonLd";
import type { InsightCategory } from "@/types";

// Revalidate every hour; admin saves also trigger on-demand revalidation
export const revalidate = 3600;

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

  const [base, meta, user] = await Promise.all([
    getInsightBySlug(slug),
    getArticleMetaSingle(slug),
    getServerUser(),
  ]);

  if (!base) notFound();
  if (meta?.is_published === false) notFound();

  // Merge: Supabase overrides win over MDX defaults
  const insight = meta
    ? {
        ...base,
        title:          meta.title          ?? base.title,
        excerpt:        meta.excerpt         ?? base.excerpt,
        featured_image: meta.featured_image  ?? base.featured_image,
        category:       (meta.category as InsightCategory) ?? base.category,
        tags:           meta.tags            ?? base.tags,
        reading_time:   meta.reading_time    ?? base.reading_time,
        published_at:   meta.published_at    ?? base.published_at,
        content:        meta.body_md         ?? base.content,
      }
    : base;

  const toc         = extractToc(insight.content);
  const colors      = CATEGORY_COLORS[insight.category];
  const articleUrl  = `${siteConfig.url}/insights/${slug}`;

  const related = (await getInsights({ category: insight.category, limit: 4 }))
    .filter((i) => i.slug !== slug)
    .slice(0, 3);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleSchema(insight)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema([
          { name: "Home",     url: siteConfig.url },
          { name: "Insights", url: `${siteConfig.url}/insights` },
          { name: insight.title, url: `${siteConfig.url}/insights/${slug}` },
        ])) }}
      />
      <ReadingProgressBar />
      <ArticleViewTracker slug={slug} />

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
            style={{ fontFamily: "var(--font-serif)", color: "#111827", letterSpacing: "-0.02em" }}
          >
            {insight.title}
          </h1>

          <p className="text-lg leading-relaxed mb-6" style={{ color: "#4B5563" }}>
            {insight.excerpt}
          </p>

          <address className="not-italic flex items-center gap-3 pt-5 border-t" style={{ borderColor: "#E2E8F0" }}>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: "#F1F5F9", color: "#60A5FA" }}
              aria-hidden="true"
            >
              {(insight.author?.name ?? "R")[0]}
            </div>
            <div>
              <p className="text-sm font-semibold" rel="author" style={{ color: "#111827" }}>
                {insight.author?.name ?? "Researchvy Editorial"}
              </p>
              <p className="text-xs" style={{ color: "#4B5563" }}>Researchvy</p>
            </div>
          </address>
        </header>

        {/* Featured image hero */}
        {insight.featured_image && (
          <div
            className="relative max-w-3xl mb-10 rounded-2xl overflow-hidden"
            style={{ aspectRatio: "16/9" }}
          >
            <Image
              src={insight.featured_image}
              alt={insight.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 768px"
            />
          </div>
        )}

        {/* Content + TOC */}
        <div className="flex gap-16 items-start">

          {/* Article body */}
          <article className="flex-1 min-w-0">
            <MdxContent source={insight.content} />

            {/* Tags */}
            {insight.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mt-10 pt-8 border-t" style={{ borderColor: "#E2E8F0" }}>
                {insight.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full px-3 py-1 text-xs font-medium"
                    style={{ backgroundColor: "#F1F5F9", color: "#4B5563" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share */}
            <div className="mt-8">
              <ShareButtons title={insight.title} url={articleUrl} slug={slug} />
            </div>

            {/* Lead capture — non-logged-in readers only.
                Appears when user reaches 60% of page (Item 67); shows at article end position. */}
            {!user && (
              <div className="mt-12">
                <ScrollTriggerLeadCapture articleTitle={insight.title} threshold={0.6} />
              </div>
            )}

            {/* Logged-in readers: clinic-first CTA (Item 68) */}
            {user && (
              <div
                className="mt-12 rounded-2xl overflow-hidden border"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
              >
                <div className="h-0.5" style={{ background: "linear-gradient(90deg, #2563EB, #10B981)" }} />
                <div className="p-6 sm:p-8">
                  <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#2563EB" }}>
                    Ready to Act?
                  </p>
                  <p
                    className="text-xl font-bold mb-2"
                    style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
                  >
                    Turn this insight into measurable visibility.
                  </p>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: "#4B5563" }}>
                    The Digital Visibility Clinic works through your actual profile — your ORCID, Google Scholar, Scopus —
                    across 5 live sessions. You leave with a strategy, a certificate, and results you can track.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/clinics"
                      className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5"
                      style={{ backgroundColor: "#2563EB" }}
                    >
                      View the Clinic
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/resources/visibility-scorecard"
                      className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-colors"
                      style={{ borderColor: "#E2E8F0", color: "#4B5563" }}
                    >
                      Check My Visibility Score First
                    </Link>
                  </div>
                  <p className="text-xs mt-3" style={{ color: "#4B5563" }}>
                    Need 1-on-1 support?{" "}
                    <Link href="/clinics/private-consulting" className="font-semibold hover:underline" style={{ color: "#A78BFA" }}>
                      Private Consulting — from $209 →
                    </Link>
                  </p>
                </div>
              </div>
            )}
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
          <section className="mt-20 pt-12 border-t" style={{ borderColor: "#E2E8F0" }}>
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#2563EB" }}>
              Continue Reading
            </p>
            <h2
              className="text-2xl font-bold mb-8"
              style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
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
