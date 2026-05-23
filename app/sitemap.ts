import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getInsights } from "@/lib/cms/mdx";
import { digitalVisibilityClinic } from "@/constants/clinics";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now  = new Date().toISOString();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base,                  lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/about`,       lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/insights`,    lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/clinics`,     lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/resources`,   lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/ecosystem`,   lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`,     lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/intelligence`,lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/academy`,     lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/media`,       lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/network`,     lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/partnerships`,lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const insights = await getInsights({ limit: 100 });
  const insightRoutes: MetadataRoute.Sitemap = insights.map((insight) => ({
    url:             `${base}/insights/${insight.slug}`,
    lastModified:    insight.published_at,
    changeFrequency: "monthly",
    priority:        0.8,
  }));

  const clinicRoutes: MetadataRoute.Sitemap = [
    {
      url:             `${base}/clinics/${digitalVisibilityClinic.slug}`,
      lastModified:    now,
      changeFrequency: "monthly",
      priority:        0.9,
    },
  ];

  return [...staticRoutes, ...insightRoutes, ...clinicRoutes];
}
