import { getInsights } from "@/lib/cms/mdx";
import { siteConfig } from "@/config/site";

export const revalidate = 3600;

export async function GET() {
  const insights = await getInsights({ limit: 50 });
  const base     = siteConfig.url;

  const items = insights.map((i) => `
    <item>
      <title><![CDATA[${i.title}]]></title>
      <link>${base}/insights/${i.slug}</link>
      <guid isPermaLink="true">${base}/insights/${i.slug}</guid>
      <description><![CDATA[${i.excerpt}]]></description>
      <pubDate>${new Date(i.published_at).toUTCString()}</pubDate>
      <author>editorial@researchvy.com (${i.author?.name ?? "Researchvy Editorial"})</author>
      ${i.tags.map((t) => `<category><![CDATA[${t}]]></category>`).join("\n      ")}
    </item>`).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${siteConfig.name} Insights</title>
    <link>${base}/insights</link>
    <description>Institutional-grade articles on scholarly visibility, bibliometrics, research communication, and the systems that shape academic impact. Free for researchers worldwide.</description>
    <language>en-us</language>
    <copyright>© ${new Date().getFullYear()} ${siteConfig.name}</copyright>
    <managingEditor>${siteConfig.contact.email} (${siteConfig.name})</managingEditor>
    <webMaster>${siteConfig.contact.email} (${siteConfig.name})</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${base}/images/brand/logo-icon.png</url>
      <title>${siteConfig.name} Insights</title>
      <link>${base}/insights</link>
    </image>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type":  "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
