import { siteConfig } from "@/config/site";
import type { Insight } from "@/types";

const base = siteConfig.url;

function stripMd(text: string): string {
  return text
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\(.*?\)/g, "$1")
    .replace(/#{1,6}\s+/g, "")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/^[-*>]\s+/gm, "")
    .replace(/\n{2,}/g, " ")
    .trim();
}

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
        urlTemplate:   `${base}/search?q={search_term_string}`,
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
    keywords:          [
      ...(insight.seo_keywords ? insight.seo_keywords.split(",").map((k: string) => k.trim()) : []),
      ...insight.tags,
    ].filter((v, i, arr) => v && arr.indexOf(v) === i).join(", "),
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
      "@type":        "CourseInstance",
      courseMode:     ["online"],
      courseWorkload: "PT6H",
      instructor: {
        "@type": "Organization",
        name:    "Researchvy Clinics",
      },
    },
    educationalLevel: "professional",
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

export function academyCourseSchema(opts: {
  title:       string;
  description: string | null;
  slug:        string;
  level:       number;
  durationMinutes: number;
  lessonCount: number;
  isFree:      boolean;
}) {
  const LEVEL_LABELS = [
    "Beginner", "Elementary", "Intermediate", "Advanced", "Expert",
  ];
  return {
    "@context": "https://schema.org",
    "@type":    "Course",
    name:       opts.title,
    description: opts.description ?? `Level ${opts.level} course on scholarly visibility — Researchvy Academy`,
    url:        `${base}/academy/courses/${opts.slug}`,
    provider: {
      "@type": "Organization",
      name:    siteConfig.name,
      url:     base,
    },
    hasCourseInstance: {
      "@type":        "CourseInstance",
      courseMode:     ["online", "asynchronous"],
      courseWorkload: opts.durationMinutes > 0 ? `PT${opts.durationMinutes}M` : undefined,
      instructor: {
        "@type": "Organization",
        name:    siteConfig.name,
      },
      offers: opts.isFree
        ? { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" }
        : { "@type": "Offer", availability: "https://schema.org/InStock" },
    },
    numberOfCredits: opts.lessonCount,
    educationalLevel: LEVEL_LABELS[Math.min(opts.level - 1, 4)],
    teaches:    ["Research visibility", "Scholarly identity", "Academic discoverability"],
    inLanguage: "en-US",
  };
}

export function eventSchema(opts: {
  title:       string;
  description: string;
  slug:        string;
  startDate:   string;
  endDate:     string | null;
  format:      "in-person" | "virtual" | "hybrid";
  location:    string | null;
  venue:       string | null;
  organizerName: string | null;
  registrationUrl: string | null;
  isFree:      boolean;
  status:      string;
}) {
  const url  = `${base}/events/${opts.slug}`;
  const mode = opts.format === "virtual"
    ? "https://schema.org/OnlineEventAttendanceMode"
    : opts.format === "hybrid"
    ? "https://schema.org/MixedEventAttendanceMode"
    : "https://schema.org/OfflineEventAttendanceMode";

  const locationBlock = opts.format === "virtual"
    ? { "@type": "VirtualLocation", url }
    : opts.location
    ? {
        "@type":   "Place",
        name:      opts.venue ?? opts.location,
        address:   { "@type": "PostalAddress", addressLocality: opts.location },
      }
    : undefined;

  const schemaStatus = opts.status === "cancelled"
    ? "https://schema.org/EventCancelled"
    : opts.status === "postponed"
    ? "https://schema.org/EventPostponed"
    : "https://schema.org/EventScheduled";

  return {
    "@context":           "https://schema.org",
    "@type":              "Event",
    "@id":                url,
    name:                 opts.title,
    description:          opts.description.slice(0, 500),
    image:                `${base}/events/${opts.slug}/opengraph-image`,
    url,
    startDate:            opts.startDate,
    ...(opts.endDate ? { endDate: opts.endDate } : {}),
    eventStatus:          schemaStatus,
    eventAttendanceMode:  mode,
    ...(locationBlock ? { location: locationBlock } : {}),
    organizer:            opts.organizerName
      ? { "@type": "Organization", name: opts.organizerName }
      : { "@id": `${base}/#organization` },
    offers: {
      "@type":       "Offer",
      price:         opts.isFree ? "0" : undefined,
      priceCurrency: "USD",
      url:           opts.registrationUrl ?? url,
      availability:  "https://schema.org/InStock",
    },
    publisher: { "@id": `${base}/#organization` },
    inLanguage: "en-US",
  };
}

export function opportunitySchema(opts: {
  id:          string;
  title:       string;
  description: string;
  category:    string;
  funder:      string | null;
  value:       string | null;
  deadline:    string | null;
  applyUrl:    string;
  targetLevel: string;
}) {
  const url = `${base}/opportunities/${opts.id}`;

  const cleanDesc = stripMd(opts.description).slice(0, 500);

  if (opts.category === "job") {
    return {
      "@context":        "https://schema.org",
      "@type":           "JobPosting",
      "@id":             url,
      title:             opts.title,
      description:       cleanDesc,
      url,
      hiringOrganization: opts.funder
        ? { "@type": "Organization", name: opts.funder }
        : { "@id": `${base}/#organization` },
      ...(opts.deadline ? { validThrough: opts.deadline } : {}),
      jobLocationType:   "TELECOMMUTE",
      applicantLocationRequirements: { "@type": "Country", name: "Worldwide" },
      employmentType:    "CONTRACTOR",
      directApply:       false,
      ...(opts.value ? { salaryCurrency: "USD" } : {}),
      inLanguage:        "en-US",
    };
  }

  return {
    "@context":   "https://schema.org",
    "@type":      "EducationalOccupationalProgram",
    "@id":        url,
    name:         opts.title,
    description:  cleanDesc,
    url,
    provider:     opts.funder
      ? { "@type": "Organization", name: opts.funder }
      : { "@id": `${base}/#organization` },
    offers: {
      "@type":        "Offer",
      price:          "0",
      priceCurrency:  "USD",
      url:            opts.applyUrl,
      availability:   "https://schema.org/InStock",
      ...(opts.deadline ? { validThrough: opts.deadline } : {}),
    },
    ...(opts.deadline ? { applicationDeadline: opts.deadline } : {}),
    ...(opts.category === "fellowship"
      ? { educationalCredentialAwarded: "Fellowship Certificate" }
      : opts.category === "award"
      ? { educationalCredentialAwarded: "Research Award" }
      : {}),
    inLanguage:     "en-US",
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
