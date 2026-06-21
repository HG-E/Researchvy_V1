import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getInsights } from "@/lib/cms/mdx";
import { digitalVisibilityClinic } from "@/constants/clinics";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";

// Stable deploy date — update this when a page's content meaningfully changes.
// Never use `new Date()` here: telling Google every page changed today on every
// deploy causes crawlers to stop trusting the lastModified signal entirely.
const SITE_LAUNCH    = "2025-11-01";
const COHORT_UPDATED = "2026-05-01"; // July 2026 cohort info added

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const insights = await getInsights({ limit: 100 });
  // Use the most recent insight date to signal freshness on the listing page
  const latestInsight = insights[0]?.updated_at ?? insights[0]?.published_at ?? SITE_LAUNCH;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base,                                       lastModified: COHORT_UPDATED, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/clinics`,                          lastModified: COHORT_UPDATED, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/insights`,                         lastModified: latestInsight,  changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/about`,                            lastModified: SITE_LAUNCH,    changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/resources`,                        lastModified: SITE_LAUNCH,    changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/researchers`,                        lastModified: SITE_LAUNCH,    changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/researchers/early-career`,         lastModified: SITE_LAUNCH,    changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/researchers/institutional`,        lastModified: SITE_LAUNCH,    changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/resources/visibility-scorecard`,   lastModified: SITE_LAUNCH,    changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/consultation`,                     lastModified: SITE_LAUNCH,    changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/events`,                            lastModified: SITE_LAUNCH,    changeFrequency: "daily",   priority: 0.8 },
    { url: `${base}/opportunities`,                    lastModified: SITE_LAUNCH,    changeFrequency: "daily",   priority: 0.8 },
    { url: `${base}/ecosystem`,                        lastModified: SITE_LAUNCH,    changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/academy`,                          lastModified: SITE_LAUNCH,    changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/academy/courses`,                  lastModified: SITE_LAUNCH,    changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/intelligence`,                     lastModified: SITE_LAUNCH,    changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`,                          lastModified: SITE_LAUNCH,    changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/media`,                            lastModified: SITE_LAUNCH,    changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/network`,                          lastModified: SITE_LAUNCH,    changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/partnerships`,                     lastModified: SITE_LAUNCH,    changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/privacy`,                          lastModified: "2025-06-01",   changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/terms`,                            lastModified: "2025-06-01",   changeFrequency: "yearly",  priority: 0.3 },
  ];

  const insightRoutes: MetadataRoute.Sitemap = insights.map((insight) => ({
    url:             `${base}/insights/${insight.slug}`,
    lastModified:    insight.updated_at ?? insight.published_at,
    changeFrequency: "monthly" as const,
    priority:        0.8,
  }));

  const clinicRoutes: MetadataRoute.Sitemap = [
    {
      url:             `${base}/clinics/${digitalVisibilityClinic.slug}`,
      lastModified:    COHORT_UPDATED,
      changeFrequency: "monthly" as const,
      priority:        0.9,
    },
    {
      url:             `${base}/clinics/private-consulting`,
      lastModified:    "2026-06-22",
      changeFrequency: "monthly" as const,
      priority:        0.9,
    },
  ];

  // Published events
  let eventRoutes: MetadataRoute.Sitemap = [];
  try {
    const admin = createSupabaseAdminClient();
    const { data: events } = await admin
      .from("events")
      .select("slug, updated_at")
      .in("status", ["published", "featured"]);
    eventRoutes = (events ?? []).map((e) => ({
      url:             `${base}/events/${e.slug}`,
      lastModified:    e.updated_at ?? SITE_LAUNCH,
      changeFrequency: "weekly" as const,
      priority:        0.7,
    }));
  } catch { /* non-fatal */ }

  // Published opportunities
  let opportunityRoutes: MetadataRoute.Sitemap = [];
  try {
    const admin = createSupabaseAdminClient();
    const { data: opps } = await admin
      .from("research_opportunities")
      .select("id, created_at")
      .eq("is_published", true);
    opportunityRoutes = (opps ?? []).map((o) => ({
      url:             `${base}/opportunities/${o.id}`,
      lastModified:    o.created_at ?? SITE_LAUNCH,
      changeFrequency: "monthly" as const,
      priority:        0.6,
    }));
  } catch { /* non-fatal */ }

  // Published academy courses
  let courseRoutes: MetadataRoute.Sitemap = [];
  try {
    const admin = createSupabaseAdminClient();
    const { data: courses } = await admin
      .from("courses")
      .select("slug, updated_at")
      .eq("is_published", true);
    courseRoutes = (courses ?? []).map((c) => ({
      url:             `${base}/academy/courses/${c.slug}`,
      lastModified:    c.updated_at ?? SITE_LAUNCH,
      changeFrequency: "monthly" as const,
      priority:        0.7,
    }));
  } catch { /* non-fatal */ }

  // Public researcher profiles
  let profileRoutes: MetadataRoute.Sitemap = [];
  try {
    const admin = createSupabaseAdminClient();
    const { data: profiles } = await admin
      .from("users")
      .select("username, updated_at")
      .eq("profile_public", true)
      .not("username", "is", null);

    profileRoutes = (profiles ?? []).map((p) => ({
      url:             `${base}/profile/${p.username}`,
      lastModified:    p.updated_at ?? SITE_LAUNCH,
      changeFrequency: "weekly" as const,
      priority:        0.6,
    }));
  } catch { /* non-fatal */ }

  return [...staticRoutes, ...insightRoutes, ...clinicRoutes, ...eventRoutes, ...opportunityRoutes, ...courseRoutes, ...profileRoutes];
}
