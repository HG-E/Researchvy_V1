/**
 * Institutional copy — canonical Researchvy language.
 * Always use these strings; never paraphrase them inline.
 */
export const copy = {
  hero: {
    headline:   "Research Beyond Publication",
    subheadline:"From Discovery to Impact",
    body: "Researchvy is a modern scholarly visibility and research intelligence ecosystem helping researchers and institutions navigate discoverability, communication, strategic visibility, and meaningful research impact.",
    cta: {
      primary:   "Explore the Ecosystem",
      secondary: "Join Digital Visibility Clinic™",
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
    title:    "Why Research Visibility Matters",
    subtitle: "Millions of valuable research outputs remain invisible, undiscoverable, and disconnected from the communities they could serve.",
    problems: [
      "Research published but never discovered",
      "Scholars invisible beyond their institution",
      "Valuable insights disconnected from application",
      "Research unable to reach policymakers or public",
      "Societal impact lost to poor communication",
    ],
  },

  framework: {
    title: "The Researchvy Framework™",
    subtitle: "Every step from research creation to societal impact — made visible, connected, and strategic.",
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
    name:     "Digital Visibility Clinic™",
    tagline:  "A scholarly visibility and discoverability transformation experience",
    outcomes: [
      "Develop a complete digital scholarly identity",
      "Optimize your research for major discovery systems",
      "Understand citation intelligence and h-index strategy",
      "Build a strategic research visibility plan",
      "Communicate research to diverse audiences",
      "Position yourself for global scholarly relevance",
    ],
    cta: "Register for Upcoming Clinic",
  },

  cta: {
    ecosystem: "Enter the Researchvy Ecosystem",
    body: "The future of research requires more than publication. It requires visibility, discoverability, communication, strategic positioning, and meaningful impact.",
  },
} as const;
