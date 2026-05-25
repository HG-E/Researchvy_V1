import { siteConfig } from "@/config/site";
import type { Insight } from "@/types";

const base = siteConfig.url;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type":    "Organization",
    "@id":      `${base}/#organization`,
    name:       siteConfig.name,
    url:        base,
    logo: {
      "@type":       "ImageObject",
      url:           `${base}/images/brand/logo-icon.png`,
      width:         512,
      height:        512,
    },
    description: siteConfig.description,
    sameAs: [
      siteConfig.social.twitter,
      siteConfig.social.linkedin,
      siteConfig.social.youtube,
    ],
    contactPoint: {
      "@type":       "ContactPoint",
      contactType:   "customer service",
      email:         siteConfig.contact.email,
      availableLanguage: "English",
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type":    "WebSite",
    "@id":      `${base}/#website`,
    name:       siteConfig.name,
    url:        base,
    publisher:  { "@id": `${base}/#organization` },
    potentialAction: {
      "@type":  "SearchAction",
      target: {
        "@type":       "EntryPoint",
        urlTemplate:   `${base}/insights?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function articleSchema(insight: Insight) {
  return {
    "@context":        "https://schema.org",
    "@type":           "Article",
    "@id":             `${base}/insights/${insight.slug}`,
    headline:          insight.title,
    description:       insight.excerpt,
    url:               `${base}/insights/${insight.slug}`,
    datePublished:     insight.published_at,
    dateModified:      insight.updated_at ?? insight.published_at,
    image:             insight.featured_image ?? `${base}/images/brand/og-default.png`,
    author: {
      "@type": "Organization",
      name:    insight.author?.name ?? siteConfig.name,
      url:     base,
    },
    publisher:         { "@id": `${base}/#organization` },
    mainEntityOfPage:  { "@type": "WebPage", "@id": `${base}/insights/${insight.slug}` },
    keywords:          insight.tags.join(", "),
    articleSection:    insight.category.replace(/-/g, " "),
    inLanguage:        "en-US",
  };
}

export function courseSchema() {
  return {
    "@context":   "https://schema.org",
    "@type":      "Course",
    name:         "Digital Visibility Clinic",
    description:  "A structured, practical transformation experience for researchers who want to move from invisible to strategically visible across all major scholarly discovery systems.",
    url:          `${base}/clinics/digital-visibility-clinic`,
    provider: {
      "@type": "Organization",
      name:    siteConfig.name,
      url:     base,
    },
    hasCourseInstance: {
      "@type":              "CourseInstance",
      courseMode:           ["online"],
      courseWorkload:       "PT6H",
      instructor: {
        "@type": "Organization",
        name:    "Researchvy Clinics",
      },
    },
    educationalLevel:     "professional",
    teaches: [
      "Scholarly visibility systems",
      "Digital scholarly identity",
      "Citation intelligence",
      "Research discoverability",
      "Scholarly communication",
    ],
    inLanguage: "en-US",
  };
}

export function faqSchema(faqs: readonly { readonly question: string; readonly answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type":    "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name:    question,
      acceptedAnswer: {
        "@type": "Answer",
        text:    answer,
      },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context":        "https://schema.org",
    "@type":           "BreadcrumbList",
    itemListElement:   items.map((item, index) => ({
      "@type":    "ListItem",
      position:   index + 1,
      name:       item.name,
      item:       item.url,
    })),
  };
}
