/**
 * Digital Visibility Clinic — static programme data.
 * July 2026 Cohort — 4 live sessions, Wed or Sunday track.
 */

export const digitalVisibilityClinic = {
  id:      "digital-visibility-clinic",
  slug:    "digital-visibility-clinic",
  name:    "Digital Visibility Clinic",
  tagline: "A scholarly visibility and discoverability transformation experience",
  description:
    "A structured, practical transformation experience for researchers who want to move from invisible to strategically visible — across all major scholarly discovery systems.",
  duration: "4 live sessions",
  format:   "Live online + recorded access",
  capacity: 20,

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
      title:  "Visibility Foundations & Digital Identity",
      description:
        "Understanding modern scholarly visibility systems, digital academic identity, and setting up your presence across all major scholarly platforms.",
      topics: [
        "What scholarly visibility actually means — and why it compounds",
        "The research discoverability landscape",
        "Google Scholar, ORCID, and Scopus Author ID — full optimisation",
        "Research profile consistency across platforms",
      ],
    },
    {
      number: 2,
      title:  "Discoverability & Citation Intelligence",
      description:
        "How indexing systems work, how to position your research to be found, and how to understand and improve the metrics that matter.",
      topics: [
        "How Scopus, Web of Science, and Google Scholar index content",
        "Keyword strategy for research metadata and journal selection",
        "h-index and citation counts — what they mean and how to improve them ethically",
        "Bibliometric tools: VOSviewer, OpenAlex, and your citation gap audit",
      ],
    },
    {
      number: 3,
      title:  "Research Communication & Public Engagement",
      description:
        "Translating your research for broader audiences — from policymakers to the public — using modern science communication tools.",
      topics: [
        "Making complex research understandable to non-specialists",
        "Visual abstracts and knowledge translation techniques",
        "Social media strategy for researchers",
        "Science communication for media, policy, and public audiences",
      ],
    },
    {
      number: 4,
      title:  "Strategic Positioning & Your 12-Month Visibility Plan",
      description:
        "Building a long-term, sustainable scholarly visibility strategy — and leaving with a personalised roadmap you can execute from Day 1.",
      topics: [
        "Creating your personal 12-month visibility roadmap",
        "Institutional positioning, collaboration, and amplification",
        "Amplifying research impact beyond publication",
        "Measuring and tracking your visibility progress",
      ],
    },
  ],

  pricing: {
    earlyBirdDeadline: "2026-06-20",
    groupDiscounts: [
      { min: 5,  max: 10, off: 0.20 },
      { min: 11, max: 20, off: 0.30 },
    ],
    tiers: [
      {
        id:          "pro",
        name:        "Visibility Pro",
        tagline:     "Publishing steadily — go strategic",
        recommended: false,
        usd: { regular: 249, earlyBird: 179 },
        ngn: { regular: 130000, earlyBird: 99000 },
        whatsappContext: "Visibility Pro cohort enrollment — July 2026",
        cta: "Join as Pro",
        includes: [
          "4 live sessions + all recordings (60-day access)",
          "Session workbook + WhatsApp community",
          "Pre-session profile audit",
          "Priority Q&A + personalised action plan",
          "Physical + digital certificate",
          "1 × 45-min private strategy call",
          "Full Intelligence Report on your scholarly profile",
          "90-day personalised visibility roadmap",
          "90-day WhatsApp follow-up support",
          "Mailed premium certificate",
        ],
      },
      {
        id:          "builder",
        name:        "Visibility Builder",
        tagline:     "Profiles exist — gaps remain",
        recommended: true,
        usd: { regular: 149, earlyBird: 99 },
        ngn: { regular: 85000, earlyBird: 65000 },
        whatsappContext: "Visibility Builder cohort enrollment — July 2026",
        cta: "Secure My Spot",
        includes: [
          "4 live sessions + all recordings (60-day access)",
          "Session workbook + WhatsApp community",
          "Pre-session profile audit before Session 1",
          "Priority Q&A during sessions",
          "Personalised action plan",
          "Physical + digital certificate",
        ],
      },
      {
        id:          "starter",
        name:        "Visibility Starter",
        tagline:     "No digital presence yet",
        recommended: false,
        usd: { regular: 79, earlyBird: 59 },
        ngn: { regular: 50000, earlyBird: 38000 },
        whatsappContext: "Visibility Starter cohort enrollment — July 2026",
        cta: "Join as Starter",
        includes: [
          "4 live sessions + all recordings (60-day access)",
          "Session workbook",
          "WhatsApp community access",
          "Digital certificate",
        ],
      },
    ],
  },

  testimonials: [
    {
      name:        "Barnabas Folami-A",
      institution: "Bingham University, Nigeria",
      quote:       "I feel ready to launch out and position myself for global relevance now as a 21st century researcher.",
      cohort:      "ASM Nigeria Cohort",
    },
    {
      name:        "Chiemeziem Onyeka",
      institution: "Independent Researcher, Nigeria",
      quote:       "I can now present my research and profile to connect with the right audience and opportunities.",
      cohort:      "ASM Nigeria Cohort",
    },
    {
      name:        "Dr Olabowale Omolade",
      institution: "Olabisi Onabanjo University, Nigeria",
      quote:       "It is already impacting both my academic and professional work.",
      cohort:      "ASM Nigeria Cohort",
    },
    {
      name:        "Olamide Adeboye",
      institution: "Kwara State Polytechnic, Nigeria",
      quote:       "The clinic gave me a platform to start strong with my career as a microbiologist.",
      cohort:      "ASM Nigeria Cohort",
    },
    {
      name:        "Perpetua Nwachukwu",
      institution: "Federal University of Technology, Owerri",
      quote:       "Opened my eyes to tools that will help me right now and in the future.",
      cohort:      "ASM Nigeria Cohort",
    },
    {
      name:        "Temitope Adebayo",
      institution: "University of Ibadan, Nigeria",
      quote:       "Helping young and vibrant scientists to be more visible — exactly what we needed.",
      cohort:      "ASM Nigeria Cohort",
    },
    {
      name:        "Christiana Uzoagba",
      institution: "Chukwuemeka Odumegwu Ojukwu University",
      quote:       "Insightful and practical, offering valuable tips on personal branding and digital presence.",
      cohort:      "ASM Nigeria Cohort",
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
      answer:
        "The clinic is designed for postgraduate researchers, early-career academics, established scholars, and institutional research staff who want to improve how their research is found, cited, and applied. It is relevant across all disciplines — from sciences and social sciences to humanities.",
    },
    {
      question: "Is this relevant to my field of research?",
      answer:
        "Yes. Scholarly visibility operates the same way across all academic disciplines — the platforms, metrics, and discovery systems are field-agnostic. Our previous cohort included microbiologists, social scientists, and humanities researchers. Every researcher with publications benefits from the clinic.",
    },
    {
      question: "Do I have to attend sessions live?",
      answer:
        "Live attendance is strongly encouraged — the small cohort size means real interaction and personalised feedback. However, all sessions are recorded and provided to enrolled participants, so you can review them within 60 days if you miss a live session.",
    },
    {
      question: "I already have a Google Scholar profile and ORCID. Is this still for me?",
      answer:
        "Almost certainly yes. 89% of researchers we audit have at least one broken, incomplete, or duplicate profile — even those who think they are set up correctly. The clinic goes far beyond profile creation: it covers citation intelligence, strategic positioning, and research communication that most researchers never receive training on.",
    },
    {
      question: "How is this different from watching YouTube videos or reading about visibility online?",
      answer:
        "Passive content gives you information. The clinic gives you implementation. Every session ends with a specific action that you execute on your own profile — with feedback from the facilitator and your cohort peers. You leave with a completed, audited visibility system, not just notes.",
    },
    {
      question: "What is the total time commitment?",
      answer:
        "4 live sessions over 4 weeks (July 1–28, 2026), each 2 hours long. Between sessions, platform-based activities take approximately 2–3 hours per week at your own pace. Total: roughly 16–20 hours over the cohort period.",
    },
    {
      question: "What will I have when I complete the clinic?",
      answer:
        "You will leave with a fully optimised digital scholarly identity, a personal research visibility strategy tailored to your discipline, and a verified Certificate of Scholarly Visibility Practice — downloadable and shareable on LinkedIn.",
    },
    {
      question: "How much does the clinic cost?",
      answer:
        "Pricing is published transparently on this page. The Visibility Starter tier begins at $59 USD (₦38,000 NGN) early bird. The Visibility Builder — the most popular tier — is $99 USD (₦65,000 NGN) early bird. The Visibility Pro tier is $179 USD (₦99,000 NGN) early bird. Early bird pricing closes June 20, 2026.",
    },
    {
      question: "Can my institution or department fund my place?",
      answer:
        "Yes. Many participants attend under institutional professional development budgets. We provide a formal institutional letter you can present to your department head or finance officer. Download it from our resources page or contact us via WhatsApp to request a tailored version.",
    },
    {
      question: "How many participants are in each cohort?",
      answer:
        "Each cohort is deliberately limited to a maximum of 20 researchers to ensure every participant receives personal attention, peer interaction, and a high-quality learning experience.",
    },
    {
      question: "What do I need to participate?",
      answer:
        "A stable internet connection, an active research profile (or the desire to build one), and a commitment to completing the inter-session platform activities. No special software is required.",
    },
  ],

  nextCohort: {
    id:                   "cohort-2026-july",
    registrationDeadline: "2026-06-28",
    earlyBirdDeadline:    "2026-06-20",
    sessionTime:          "5:00–7:00 PM EST / 10:00 PM–12:00 AM WAT",
    timezone:             "EST (UTC−5) / WAT (UTC+1)",
    sessionDuration:      "2 hours",
    weeklyTaskHours:      2,
    totalCommitment:      "4 live sessions over 4 weeks",
    spotsAlreadyFilled:   8,
    status:               "open" as "open" | "closing-soon" | "full" | "tba",
    tracks: {
      wednesday: {
        label:     "Mid-week",
        day:       "Wednesday",
        startDate: "2026-07-01",
      },
      sunday: {
        label:     "Weekend",
        day:       "Sunday",
        startDate: "2026-07-05",
      },
    },
  },
} as const;

export type DigitalVisibilityClinic = typeof digitalVisibilityClinic;
