export type InsightCategory =
  | "scholarly-visibility"
  | "research-intelligence"
  | "scholarly-communication"
  | "modern-scholarly-systems"
  | "institutional-positioning";

export interface InsightAuthor {
  id: string;
  name: string;
  bio: string | null;
  avatar_url: string | null;
  expertise: string[];
  linkedin?: string;
  orcid?: string;
}

export interface Insight {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author_id: string;
  featured_image: string | null;
  category: InsightCategory;
  tags: string[];
  reading_time: number;
  published: boolean;
  published_at: string;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  created_at: string;
  updated_at: string;
  author?: InsightAuthor;
}

export interface InsightListItem
  extends Pick<
    Insight,
    "id" | "title" | "slug" | "excerpt" | "featured_image" | "category" | "tags" | "reading_time" | "published_at" | "updated_at"
  > {
  author?: Pick<InsightAuthor, "name" | "avatar_url">;
}
