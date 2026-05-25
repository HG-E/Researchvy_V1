/**
 * Digital Visibility Clinic — static programme data.
 *
 * PRICING POLICY:
 * Price is not displayed publicly. All pricing enquiries are handled via
 * WhatsApp (+234 7030515183). Each registration page shows an "Enquire via
 * WhatsApp" button that generates a message specific to the clinic.
 */

export const digitalVisibilityClinic = {
  id:      "digital-visibility-clinic",
  slug:    "digital-visibility-clinic",
  name:    "Digital Visibility Clinic",
  tagline: "A scholarly visibility and discoverability transformation experience",
  description:
    "A structured, practical transformation experience for researchers who want to move from invisible to strategically visible — across all major scholarly discovery systems.",
  duration: "6 sessions",
  format:   "Live online + recorded access",
  capacity: 30,
  /** No public price — WhatsApp enquiry only */
  priceDisplay: null,

  outcomes: [
    "Develop a complete and coherent digital scholarly identity",
    "Optimise your research for major discovery systems (Scopus, Google Scholar, ORCID)",
    "Understand citation intelligence and h-index strategy",
    "Build a strategic research visibility plan for your discipline",
    "Communicate your research to diverse academic and public audiences",
    "Position yourself for global scholarly relevance and institutional recognition",
  ],

  sessions: [
    {
      number: 1,
      title:  "Visibility Foundations",
      description:
        "Understanding modern scholarly visibility systems, digital academic identity, and why discoverability matters for research impact.",
      topics: [
        "What scholarly visibility actually means",
        "The research discoverability landscape",
        "Why many high-quality researchers remain invisible",
        "The Researchvy Framework: Research → Impact",
      ],
    },
    {
      number: 2,
      title:  "Digital Identity Systems",
      description:
        "Setting up and optimising your presence across all major scholarly identity platforms.",
      topics: [
        "Google Scholar — complete profile optimisation",
        "ORCID — connecting your entire research history",
        "Scopus Author ID — managing your indexed record",
        "Research profile consistency across platforms",
      ],
    },
    {
      number: 3,
      title:  "Discoverability Optimisation",
      description:
        "Understanding how indexing systems work and how to position your research to be found.",
      topics: [
        "How Scopus, Web of Science, and Google Scholar index content",
        "Keyword strategy for research metadata",
        "Open Access and discoverability",
        "Journal selection for visibility",
      ],
    },
    {
      number: 4,
      title:  "Citation Intelligence",
      description:
        "Understanding the metrics that matter, how they work, and how to improve them ethically.",
      topics: [
        "h-index and citation counts — what they mean",
        "Citation systems and how citations accumulate",
        "Ethical strategies to improve research impact metrics",
        "Bibliometric tools: VOSviewer, OpenAlex",
      ],
    },
    {
      number: 5,
      title:  "Research Communication",
      description:
        "Translating your research for broader audiences — from policymakers to the public.",
      topics: [
        "Making complex research understandable",
        "Visual abstracts and knowledge translation",
        "Social media for researchers",
        "Science communication for non-specialist audiences",
      ],
    },
    {
      number: 6,
      title:  "Strategic Positioning & Impact",
      description:
        "Building a long-term, sustainable scholarly visibility strategy for global relevance.",
      topics: [
        "Creating your personal visibility roadmap",
        "Institutional positioning and collaboration",
        "Amplifying research impact beyond publication",
        "Measuring and tracking your visibility progress",
      ],
    },
  ],

  certificate: {
    name:        "Certificate of Scholarly Visibility Practice",
    issuer:      "Researchvy Clinics",
    description: "Awarded upon successful completion of the Digital Visibility Clinic",
    features: [
      "Unique certificate number",
      "QR verification code",
      "Public verification URL",
      "Institutional Researchvy branding",
    ],
  },

  postClinicBenefits: [
    "Access to all session recordings",
    "Researchvy Alumni Network membership",
    "Exclusive post-clinic resource library",
    "Certificate shareable on LinkedIn",
    "Continued learning pathway recommendations",
  ],

  faq: [
    {
      question: "Who is the Digital Visibility Clinic designed for?",
      answer:   "The clinic is designed for postgraduate researchers, early-career academics, established scholars, and institutional research staff who want to improve how their research is found, cited, and applied. It is relevant across all disciplines.",
    },
    {
      question: "Do I have to attend sessions live?",
      answer:   "Sessions are held live online in small cohorts of up to 30 researchers. All sessions are recorded and provided to enrolled participants, so you can review them at your own pace after each live session.",
    },
    {
      question: "What is the total time commitment?",
      answer:   "The clinic runs over 6 weeks: 3 hours of live session per week plus approximately 2 hours of practical tasks between sessions — around 30 hours total commitment.",
    },
    {
      question: "What will I have when I complete the clinic?",
      answer:   "You will leave with a fully optimised digital scholarly identity, a personal research visibility strategy tailored to your discipline, and a verified Certificate of Scholarly Visibility Practice — downloadable and shareable on LinkedIn.",
    },
    {
      question: "How much does the clinic cost?",
      answer:   "Researchvy does not publish fixed pricing. Fees are contextual — based on your institution, registration type (individual or institutional), and cohort. Contact us via WhatsApp or email info@researchvy.com for a tailored proposal within 24 hours.",
    },
    {
      question: "How many participants are in each cohort?",
      answer:   "Each cohort is deliberately limited to a maximum of 30 researchers to ensure every participant receives personal attention, peer interaction, and a high-quality learning experience.",
    },
    {
      question: "What do I need to participate?",
      answer:   "A stable internet connection, an active research profile (or the desire to build one), and a commitment to completing the inter-session tasks. No special software is required.",
    },
  ],

  nextCohort: {
    id:                   "cohort-2026-july",
    registrationDeadline: "2026-06-25",
    sessionTime:          "6:00–9:00 PM WAT",
    timezone:             "West Africa Time (UTC+1)",
    sessionDuration:      "3 hours",
    weeklyTaskHours:      2,
    totalCommitment:      "30 hours over 6 weeks",
    // "open" | "closing-soon" | "full" | "tba"
    // Set to "tba" to hide the urgency banner until dates are confirmed
    status:               "open" as "open" | "closing-soon" | "full" | "tba",
    tracks: {
      wednesday: {
        label:     "Mid-week",
        day:       "Wednesday",
        startDate: "2026-07-02",
      },
      saturday: {
        label:     "Weekend",
        day:       "Saturday",
        startDate: "2026-07-05",
      },
    },
  },
} as const;

export type DigitalVisibilityClinic = typeof digitalVisibilityClinic;
