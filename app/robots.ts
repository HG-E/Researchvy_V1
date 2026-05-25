import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  const privateRoutes = ["/dashboard/", "/admin/", "/api/"];

  return {
    rules: [
      // All crawlers — allow public content, block private routes
      {
        userAgent: "*",
        allow:    "/",
        disallow: privateRoutes,
      },
      // OpenAI (ChatGPT, SearchGPT)
      { userAgent: "GPTBot",          allow: "/" },
      { userAgent: "OAI-SearchBot",   allow: "/" },
      { userAgent: "ChatGPT-User",    allow: "/" },
      // Anthropic (Claude)
      { userAgent: "ClaudeBot",       allow: "/" },
      { userAgent: "anthropic-ai",    allow: "/" },
      // Google AI (AI Overviews, Gemini)
      { userAgent: "GoogleExtended",  allow: "/" },
      // Perplexity
      { userAgent: "PerplexityBot",   allow: "/" },
      // Cohere
      { userAgent: "cohere-ai",       allow: "/" },
      // Meta
      { userAgent: "Meta-ExternalAgent", allow: "/" },
    ],
    sitemap: [
      `${siteConfig.url}/sitemap.xml`,
      `${siteConfig.url}/llms.txt`,
    ],
    host: siteConfig.url,
  };
}
