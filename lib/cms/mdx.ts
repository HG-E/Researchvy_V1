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
}): Promise<InsightListItem[]> {
  const { category, tag, limit = 12, offset = 0 } = params ?? {};

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
          author:        data.author as InsightListItem["author"],
        } satisfies InsightListItem)
    )
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

  if (category) items = items.filter((i) => i.category === category);
  if (tag)      items = items.filter((i) => i.tags.includes(tag));

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
