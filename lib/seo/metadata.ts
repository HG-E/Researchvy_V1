import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface PageMetadataOptions {
  title:        string;
  description?: string;
  image?:       string;
  /** Canonical path, e.g. "/insights/my-article" */
  path?:        string;
  noIndex?:     boolean;
  /** Article-specific metadata */
  article?: {
    publishedAt: string;
    author:      string;
    tags?:       string[];
  };
}

/**
 * Generates consistent Metadata for any page.
 * Use this in every `export async function generateMetadata()` call.
 */
export function generatePageMetadata({
  title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  path = "",
  noIndex = false,
  article,
}: PageMetadataOptions): Metadata {
  const fullTitle = `${title} | ${siteConfig.name}`;
  const url       = `${siteConfig.url}${path}`;

  return {
    title:       fullTitle,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates:  { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title:       fullTitle,
      description,
      url,
      siteName:    siteConfig.name,
      locale:      "en_US",
      type:        article ? "article" : "website",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      ...(article && {
        publishedTime: article.publishedAt,
        authors:       [article.author],
        tags:          article.tags,
      }),
    },
    twitter: {
      card:        "summary_large_image",
      title:       fullTitle,
      description,
      images:      [image],
      creator:     siteConfig.twitterHandle,
    },
  };
}
