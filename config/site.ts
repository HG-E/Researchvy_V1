export const siteConfig = {
  name: "Researchvy",
  tagline: "Research Beyond Publication",
  description:
    "Millions of researchers publish every year. Most are never found. Researchvy exists to change that — transforming scholars into globally visible, citable, and discoverable researchers through intelligence, training, and strategic visibility.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://researchvy.com",
  domain: "researchvy.com",
  ogImage: "/images/brand/og-default.png",
  twitterHandle: "@researchvy",

  contact: {
    email:   "info@researchvy.com",
    gmail:   "researchvy@gmail.com",
    support: "info@researchvy.com",
  },

  social: {
    twitter:  "https://twitter.com/researchvy",
    linkedin: "https://linkedin.com/company/researchvy",
    youtube:  "https://youtube.com/@researchvy",
  },

  /**
   * WhatsApp enquiry — used for clinic pricing and programme inquiries.
   * Number is in international format without the '+' prefix.
   * Message is dynamically generated per-context.
   */
  whatsapp: {
    number: "2347030515183",
    get baseUrl() {
      return `https://wa.me/${this.number}`;
    },
    defaultMessage:
      "Hello, I'm interested in Researchvy programmes. Could you share more details about pricing and availability?",
  },

  /**
   * Cloudinary — all dynamic media (clinic images, avatars, article images).
   * Static brand assets (logos) live in /public/images/ and are served by Next.js.
   */
  cloudinary: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "",
    uploadPreset: "researchvy_uploads",
    folders: {
      clinics:   "researchvy/clinics",
      avatars:   "researchvy/avatars",
      insights:  "researchvy/insights",
      resources: "researchvy/resources",
    },
  },

  divisions: [
    {
      id: "intelligence",
      name: "Researchvy Intelligence",
      slug: "intelligence",
      tagline: "Visibility audits · Citation intelligence · Institutional benchmarking",
      description:
        "You can't fix what you can't measure. We give researchers and institutions a complete, honest picture of where they stand — and a prioritised plan to close every gap.",
      icon: "BarChart2",
    },
    {
      id: "academy",
      name: "Researchvy Academy",
      slug: "academy",
      tagline: "5-level curriculum · Certifications · Structured learning",
      description:
        "Publishing was one skill. Being found is another. Academy teaches the visibility skills that academia never did — five structured levels from foundation to advanced strategy.",
      icon: "GraduationCap",
    },
    {
      id: "media",
      name: "Researchvy Media",
      slug: "media",
      tagline: "Research storytelling · Visual abstracts · Policy translation",
      description:
        "Your findings are locked in formats most people will never open. We translate your research into content that reaches policymakers, practitioners, and the public who need it.",
      icon: "FileImage",
    },
    {
      id: "clinics",
      name: "Researchvy Clinics",
      slug: "clinics",
      tagline: "Live training · ≤20 per cohort · Verified certificate",
      description:
        "6 sessions. One complete transformation. You leave with a fully optimised scholarly identity, a personal visibility strategy, and a verified certificate — not just notes.",
      icon: "Stethoscope",
    },
    {
      id: "network",
      name: "Researchvy Network",
      slug: "network",
      tagline: "Peer community · Fellows programme · Global reach",
      description:
        "The researchers gaining ground fastest aren't doing it alone. The Network connects you with peers who are building visibility seriously — and holding each other accountable.",
      icon: "Network",
    },
  ],

  framework: [
    "Research",
    "Visibility",
    "Discoverability",
    "Connection",
    "Communication",
    "Application",
    "Impact",
  ],

  transformationSequence: [
    { step: 1, label: "Clarity",                description: "I finally understand scholarly visibility properly" },
    { step: 2, label: "Confidence",             description: "I know how this actually works strategically" },
    { step: 3, label: "Professional Elevation", description: "I'm becoming globally relevant and advanced" },
    { step: 4, label: "Scholarly Belonging",    description: "I'm part of the future of research visibility" },
    { step: 5, label: "Impact Possibility",     description: "My research can reach people and create real impact" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;

/** Generate a WhatsApp enquiry URL with a contextual message. */
export function buildWhatsAppUrl(context?: string): string {
  const message = context
    ? `Hello, I'm interested in the ${context} programme at Researchvy. Could you share more details about pricing and availability?`
    : siteConfig.whatsapp.defaultMessage;
  return `${siteConfig.whatsapp.baseUrl}?text=${encodeURIComponent(message)}`;
}
