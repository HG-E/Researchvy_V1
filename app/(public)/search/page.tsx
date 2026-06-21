import { generatePageMetadata } from "@/lib/seo/metadata";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { getInsights } from "@/lib/cms/mdx";
import { getCourses } from "@/lib/academy/courses";
import { SearchResultsClient } from "./SearchResultsClient";

export const dynamic = "force-dynamic";

export const metadata = generatePageMetadata({
  title: "Search",
  description: "Search across all Researchvy content — events, opportunities, courses, and insights.",
  path: "/search",
});

export interface SearchHit {
  type: "event" | "opportunity" | "researcher" | "course" | "insight";
  id:   string;
  href: string;
  title: string;
  excerpt: string;
  badge?: string;
  badgeColor?: string;
  meta?: string;
}

function escapeQ(q: string) {
  return q.replace(/[%_\\]/g, "\\$&");
}

const ROLE_LABEL: Record<string, string> = {
  researcher: "Researcher",
  partner:    "Partner",
  admin:      "Team",
  user:       "Community",
};

async function searchAll(q: string): Promise<SearchHit[]> {
  const safe = escapeQ(q);
  const admin = createSupabaseAdminClient();

  const [eventsRes, oppsRes, researchersRes, courses, insights] = await Promise.all([
    admin
      .from("events")
      .select("id,slug,title,short_description,event_type,start_date")
      .in("status", ["published", "featured"])
      .or(`title.ilike.%${safe}%,short_description.ilike.%${safe}%,description.ilike.%${safe}%`)
      .order("start_date", { ascending: false })
      .limit(10),

    admin
      .from("research_opportunities")
      .select("id,title,body,category,funder,deadline")
      .eq("is_published", true)
      .or(`title.ilike.%${safe}%,body.ilike.%${safe}%,funder.ilike.%${safe}%`)
      .order("created_at", { ascending: false })
      .limit(10),

    admin
      .from("users")
      .select("username,full_name,bio,institutional_affiliation,role")
      .eq("profile_public", true)
      .not("username", "is", null)
      .or(`full_name.ilike.%${safe}%,institutional_affiliation.ilike.%${safe}%,bio.ilike.%${safe}%`)
      .limit(5),

    getCourses(),
    getInsights({ limit: 200 }),
  ]);

  const eventHits: SearchHit[] = (eventsRes.data ?? []).map((e) => ({
    type:       "event",
    id:         e.id,
    href:       `/events/${e.slug}`,
    title:      e.title,
    excerpt:    e.short_description ?? "",
    badge:      (e.event_type as string).charAt(0).toUpperCase() + (e.event_type as string).slice(1),
    badgeColor: "#2563EB",
    meta:       e.start_date ? new Date(e.start_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : undefined,
  }));

  const oppHits: SearchHit[] = (oppsRes.data ?? []).map((o) => ({
    type:       "opportunity",
    id:         o.id,
    href:       `/opportunities/${o.id}`,
    title:      o.title,
    excerpt:    (o.body ?? "").replace(/[#*_`[\]]/g, "").slice(0, 180),
    badge:      o.funder ?? undefined,
    badgeColor: "#10B981",
    meta:       o.deadline ? `Deadline: ${new Date(o.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}` : undefined,
  }));

  const researcherHits: SearchHit[] = (researchersRes.data ?? []).map((u) => ({
    type:       "researcher",
    id:         u.username as string,
    href:       `/profile/${u.username as string}`,
    title:      (u.full_name as string | null) ?? (u.username as string),
    excerpt:    (u.bio as string | null)?.slice(0, 180) ?? (u.institutional_affiliation as string | null) ?? "",
    badge:      ROLE_LABEL[(u.role as string | null) ?? "user"] ?? "Researcher",
    badgeColor: "#EC4899",
    meta:       (u.institutional_affiliation as string | null) ?? undefined,
  }));

  const lq = q.toLowerCase();
  const courseHits: SearchHit[] = courses
    .filter((c) =>
      c.title.toLowerCase().includes(lq) ||
      (c.description ?? "").toLowerCase().includes(lq)
    )
    .slice(0, 5)
    .map((c) => ({
      type:       "course",
      id:         c.id,
      href:       `/academy/courses/${c.slug}`,
      title:      c.title,
      excerpt:    c.description ?? "",
      badge:      `Level ${c.level}`,
      badgeColor: "#8B5CF6",
      meta:       "Academy",
    }));

  const insightHits: SearchHit[] = insights
    .filter((i) =>
      i.title.toLowerCase().includes(lq) ||
      i.excerpt.toLowerCase().includes(lq) ||
      i.tags.some((t) => t.toLowerCase().includes(lq))
    )
    .slice(0, 5)
    .map((i) => ({
      type:       "insight",
      id:         i.id,
      href:       `/insights/${i.slug}`,
      title:      i.title,
      excerpt:    i.excerpt,
      badge:      i.category.replace(/-/g, " "),
      badgeColor: "#F59E0B",
      meta:       i.reading_time ? `${i.reading_time} min read` : undefined,
    }));

  return [...eventHits, ...oppHits, ...researcherHits, ...courseHits, ...insightHits];
}

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const trimmed    = q.trim();
  const results    = trimmed.length >= 2 ? await searchAll(trimmed) : [];

  return <SearchResultsClient q={trimmed} results={results} />;
}
