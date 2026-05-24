/**
 * Institutional copy — canonical Researchvy language.
 * Always use these strings; never paraphrase them inline.
 */
export const copy = {
  hero: {
    headline:   "Research Beyond Publication",
    subheadline:"From Invisible to Globally Discovered",
    body: "You've done the work. Most of the world still can't find it. Researchvy transforms researchers into globally visible, citable, and discoverable scholars — through intelligence, training, and strategic visibility.",
    cta: {
      primary:   "Get My Research Found",
      secondary: "See How It Works",
    },
    rotatingMessages: [
      "Visibility",
      "Discoverability",
      "Communication",
      "Intelligence",
      "Impact",
    ],
  },

  visibilityGap: {
    title:    "Your Research Is Better Than Your Visibility Suggests",
    subtitle: "It's not the quality of your work holding you back. It's visibility — and almost no one in academia ever taught you this.",
    problems: [
      "Your papers are published — but your citation count doesn't reflect your output",
      "You're invisible outside your institution, even in your own field",
      "Policymakers and practitioners who need your findings can't find them",
      "Your h-index is lower than your publication record deserves",
      "You're building a career on research the world hasn't discovered yet",
    ],
  },

  framework: {
    title: "The Researchvy Framework",
    subtitle: "A complete system — from research creation to measurable global impact.",
    steps: [
      { label: "Research",        description: "The scholarly work begins" },
      { label: "Visibility",      description: "Making research findable" },
      { label: "Discoverability", description: "Optimizing for discovery systems" },
      { label: "Connection",      description: "Linking research to communities" },
      { label: "Communication",   description: "Translating for broad audiences" },
      { label: "Application",     description: "Research applied to real problems" },
      { label: "Impact",          description: "Measurable societal change" },
    ],
  },

  clinic: {
    name:     "Digital Visibility Clinic",
    tagline:  "6 sessions. One complete transformation. You leave visible, optimised, and ready to be found — globally.",
    outcomes: [
      "Walk away with a fully optimised digital scholarly identity",
      "Get your research ranking across Scopus, Google Scholar, and ORCID",
      "Understand exactly what's holding back your h-index and citation count",
      "Leave with a personal visibility strategy — not just knowledge",
      "Communicate your research to audiences who can actually use it",
      "Position yourself for global relevance, not just institutional recognition",
    ],
    cta: "Secure My Spot",
  },

  cta: {
    ecosystem: "Your Research Deserves to Be Found",
    body: "Right now, somewhere in the world, a researcher who needed your work just couldn't find it. Every month that changes nothing is a month your impact shrinks. That stops here.",
  },
} as const;
