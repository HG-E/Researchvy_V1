import { notFound } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";
import { getInsightBySlug, getArticleMetaSingle } from "@/lib/cms/mdx";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import type { ArticleEditorDefaults, ArticleEditorSaved } from "@/components/admin/ArticleEditor";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return generatePageMetadata({ title: `Edit: ${slug}` });
}

export default async function EditArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [insight, meta] = await Promise.all([
    getInsightBySlug(slug),
    getArticleMetaSingle(slug),
  ]);

  if (!insight) notFound();

  const mdxDefaults: ArticleEditorDefaults = {
    title:          insight.title,
    excerpt:        insight.excerpt,
    featured_image: insight.featured_image,
    body_md:        insight.content,
    category:       insight.category,
    tags:           insight.tags,
    reading_time:   insight.reading_time,
    published_at:   insight.published_at,
  };

  const savedMeta: ArticleEditorSaved = meta
    ? {
        title:          meta.title,
        excerpt:        meta.excerpt,
        featured_image: meta.featured_image,
        body_md:        meta.body_md,
        category:       meta.category,
        tags:           meta.tags,
        reading_time:   meta.reading_time,
        published_at:   meta.published_at,
        is_published:   meta.is_published,
        view_count:     meta.view_count,
        share_count:    meta.share_count,
        updated_at:     meta.updated_at,
      }
    : null;

  return (
    <ArticleEditor
      slug={slug}
      mdxDefaults={mdxDefaults}
      savedMeta={savedMeta}
    />
  );
}
