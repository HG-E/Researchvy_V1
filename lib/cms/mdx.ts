import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Insight, InsightListItem, InsightCategory } from "@/types";

const CONTENT_DIR = path.join(process.cwd(), "content", "insights");

function getContentDir(sub: string) {
  return path.join(process.cwd(), "content", sub);
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/** Read all MDX files from a content directory. */
function readMdxFiles(dir: string): { slug: string; content: string; data: Record<string, unknown> }[] {
  ensureDir(dir);
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((filename) => {
      const filePath = path.join(dir, filename);
      const raw      = fs.readFileSync(filePath, "utf8");
      const { content, data } = matter(raw);
      return { slug: filename.replace(/\.mdx$/, ""), content, data };
    });
}

/** Fetch paginated insight list from MDX files. */
export async function getInsights(params?: {
  category?: string;
  tag?: string;
  limit?: number;
  offset?: number;
  search?: string;
}): Promise<InsightListItem[]> {
  const { category, tag, limit = 12, offset = 0, search } = params ?? {};

  let items = readMdxFiles(CONTENT_DIR)
    .filter((f) => f.data.published === true)
    .map(
      ({ slug, data }) =>
        ({
          id:            data.id as string ?? slug,
          title:         data.title as string ?? "",
          slug,
          excerpt:       data.excerpt as string ?? "",
          featured_image:data.featured_image as string ?? null,
          category:      (data.category as InsightCategory) ?? "scholarly-visibility",
          tags:          (data.tags as string[]) ?? [],
          reading_time:  (data.reading_time as number) ?? 5,
          published_at:  (data.published_at as string) ?? new Date().toISOString(),
          updated_at:    (data.updated_at as string) ?? (data.published_at as string) ?? new Date().toISOString(),
          author:        data.author as InsightListItem["author"],
        } satisfies InsightListItem)
    )
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

  if (category) items = items.filter((i) => i.category === category);
  if (tag)      items = items.filter((i) => i.tags.includes(tag));
  if (search) {
    const lq = search.toLowerCase();
    items = items.filter(
      (i) =>
        i.title.toLowerCase().includes(lq) ||
        i.excerpt.toLowerCase().includes(lq) ||
        i.tags.some((t) => t.toLowerCase().includes(lq))
    );
  }

  return items.slice(offset, offset + limit);
}

/** Fetch a single insight by slug from MDX file. */
export async function getInsightBySlug(slug: string): Promise<Insight | null> {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(raw);

  if (!data.published) return null;

  return {
    id:              data.id as string ?? slug,
    title:           data.title as string ?? "",
    slug,
    content,
    excerpt:         data.excerpt as string ?? "",
    author_id:       data.author_id as string ?? "",
    featured_image:  data.featured_image as string ?? null,
    category:        (data.category as InsightCategory) ?? "scholarly-visibility",
    tags:            (data.tags as string[]) ?? [],
    reading_time:    (data.reading_time as number) ?? 5,
    published:       true,
    published_at:    (data.published_at as string) ?? new Date().toISOString(),
    seo_title:       (data.seo_title as string) ?? null,
    seo_description: (data.seo_description as string) ?? null,
    seo_keywords:    (data.seo_keywords as string) ?? null,
    created_at:      (data.created_at as string) ?? new Date().toISOString(),
    updated_at:      (data.updated_at as string) ?? new Date().toISOString(),
    author:          data.author as Insight["author"],
  };
}

/** Get all insight slugs (for static generation). */
export function getInsightSlugs(): string[] {
  ensureDir(CONTENT_DIR);
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export { getContentDir };

// ── Supabase article_meta helpers ─────────────────────────────────────────────

export type ArticleMeta = {
  slug:           string;
  title:          string | null;
  excerpt:        string | null;
  featured_image: string | null;
  body_md:        string | null;
  category:       string | null;
  tags:           string[] | null;
  reading_time:   number | null;
  published_at:   string | null;
  is_published:   boolean;
  view_count:     number;
  share_count:    number;
  updated_at:     string;
};

/** Fetch article_meta rows for the given slugs. Returns [] on error. */
export async function getArticleMeta(slugs: string[]): Promise<ArticleMeta[]> {
  if (slugs.length === 0) return [];
  try {
    const { createSupabaseAdminClient } = await import("../auth/supabase");
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("article_meta")
      .select("slug,title,excerpt,featured_image,body_md,category,tags,reading_time,published_at,is_published,view_count,share_count,updated_at")
      .in("slug", slugs);
    return (data ?? []) as ArticleMeta[];
  } catch {
    return [];
  }
}

/** Fetch a single article_meta row by slug. Returns null on error or not found. */
export async function getArticleMetaSingle(slug: string): Promise<ArticleMeta | null> {
  try {
    const { createSupabaseAdminClient } = await import("../auth/supabase");
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("article_meta")
      .select("slug,title,excerpt,featured_image,body_md,category,tags,reading_time,published_at,is_published,view_count,share_count,updated_at")
      .eq("slug", slug)
      .maybeSingle();
    return (data as ArticleMeta | null);
  } catch {
    return null;
  }
}
