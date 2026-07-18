/**
 * Institutional copy — canonical Researchvy language.
 * Always use these strings; never paraphrase them inline.
 */
export const copy = {
  hero: {
    headline:   "Research Beyond Publication",
    subheadline:"From Invisible to Globally Discovered",
    body: "You've done the work. Most of the world still can't find it. Researchvy transforms researchers into globally visible, citable, and discoverable scholars, through intelligence, training, and strategic visibility.",
    cta: {
      primary:   "Join the Clinic",
      secondary: "Check My Score Free",
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
    subtitle: "You didn't spend years producing this work to be invisible. The gap between what you've done and what the world sees is a solvable problem — and it's costing you right now.",
    problems: [
      "You've published papers — and still can't explain why your citation count doesn't reflect the work you've done",
      "Colleagues with less output are getting invited to speak and collaborate. You're unknown outside your institution.",
      "Policymakers who needed your exact research just funded a project that ignored your findings — because they never found you",
      "Every grant panel sees your h-index before they read your work. Yours is lower than your record deserves.",
      "You're watching your career stall while researchers with worse output but better visibility get the recognition you've earned",
    ],
  },

  framework: {
    title: "The Researchvy Framework",
    subtitle: "A complete system, from research creation to measurable global impact.",
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
    tagline:  "5 core sessions. One complete transformation. You leave visible, optimised, and ready to be found globally.",
    outcomes: [
      "Walk away with a fully optimised digital scholarly identity",
      "Get your research ranking across Scopus, Google Scholar, and ORCID",
      "Understand exactly what's holding back your h-index and citation count",
      "Leave with a personal visibility strategy, not just knowledge",
      "Communicate your research to audiences who can actually use it",
      "Position yourself for global relevance, not just institutional recognition",
    ],
    cta: "Join the Next Cohort",
  },

  cta: {
    ecosystem: "Your Research Deserves to Be Found",
    body: "Right now, somewhere in the world, a researcher who needed your work just couldn't find it. Every month that changes nothing is a month your impact shrinks. That stops here.",
  },
} as const;
