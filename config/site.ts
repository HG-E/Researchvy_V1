export const siteConfig = {
  name: "Researchvy",
  tagline: "Research Beyond Publication",
  description:
    "A modern scholarly visibility and research intelligence ecosystem helping researchers and institutions navigate discoverability, communication, strategic visibility, and meaningful research impact.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://researchvy.com",
  domain: "researchvy.com",
  ogImage: "/images/og-default.jpg",
  twitterHandle: "@researchvy",

  contact: {
    email: "hello@researchvy.com",
    support: "support@researchvy.com",
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
      name: "Researchvy Intelligence™",
      slug: "intelligence",
      tagline: "Research intelligence, bibliometrics, visibility analytics",
      description:
        "Data-driven research visibility analytics, institutional audits, and citation intelligence systems.",
      icon: "BarChart2",
    },
    {
      id: "academy",
      name: "Researchvy Academy™",
      slug: "academy",
      tagline: "Structured learning, clinics, certifications",
      description:
        "Five-level professional development pathways covering every dimension of scholarly visibility.",
      icon: "GraduationCap",
    },
    {
      id: "media",
      name: "Researchvy Media™",
      slug: "media",
      tagline: "Educational visuals, scholarly communication",
      description:
        "Knowledge translation, visual abstracts, and scholarly communication resources.",
      icon: "FileImage",
    },
    {
      id: "clinics",
      name: "Researchvy Clinics™",
      slug: "clinics",
      tagline: "Practical transformation experiences",
      description:
        "Immersive scholarly visibility transformation clinics led by research intelligence experts.",
      icon: "Stethoscope",
    },
    {
      id: "network",
      name: "Researchvy Network™",
      slug: "network",
      tagline: "Community, fellows, ambassadors, partnerships",
      description:
        "A global community of researchers, institutions, and visibility champions. Coming soon.",
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
