/**
 * Digital Visibility Clinic — programme data.
 * July 2026 Cohort: 3 core modules + 2 bonus masterclasses.
 *
 * ⚠  Do NOT change nextCohort.sessionTime, timezone, or track dates.
 */

export const digitalVisibilityClinic = {
  id:      "digital-visibility-clinic",
  slug:    "digital-visibility-clinic",
  name:    "Digital Visibility Clinic",
  tagline: "Three tools. One complete digital presence. ORCID · LinkedIn · WordPress.",
  description:
    "A hands-on clinic that takes researchers from digitally invisible to fully present across the three platforms that matter most: ORCID, LinkedIn, and WordPress. Three focused live sessions, each dedicated to one tool, one skill, one permanent transformation.",
  duration: "5 core sessions",
  format:   "Live online + recorded access",
  capacity: 20,

  // ── Opening keynote (delivered before Module 1) ──────────────────────────
  opening: {
    title:       "Opening Keynote — Why Digital Visibility Matters",
    description:
      "A 30-minute framing session that opens the clinic: why most researchers remain invisible despite good work, how digital visibility compounds over time, and exactly what you will build across the three core modules.",
    duration: "30 minutes",
  },

  // ── Modules (session_number in DB aligns with module number) ─────────────
  sessions: [
    {
      number:   1,
      id:       "orcid",
      name:     "ORCID",
      title:    "ORCID — Your Research Passport",
      subtitle: "Set up and master the universal researcher identifier",
      description:
        "ORCID connects your research identity across every major database, funder system, and publisher on the planet. In this session you create or reclaim your ORCID iD, import all your publications correctly, and link it to Scopus, Google Scholar, and your institution — so your research follows you everywhere.",
      topics: [
        "What ORCID is and why it is the most important ID a researcher can have right now",
        "Creating or reclaiming your ORCID iD — and resolving duplicates permanently",
        "Importing publications from Scopus, Crossref, PubMed, and manual entry",
        "Connecting ORCID to your institutional email and employer record",
        "Linking ORCID to Google Scholar, Scopus Author ID, and ResearchGate",
        "Making your ORCID profile fully public and shareable across all platforms",
      ] as const,
      isBonus: false,
      soloPrice: {
        usd: { regular: 65, earlyBird: 45 },
        ngn: { regular: 35000, earlyBird: 24000 },
      },
    },
    {
      number:   2,
      id:       "linkedin",
      name:     "LinkedIn",
      title:    "LinkedIn — Your Global Academic Presence",
      subtitle: "Turn LinkedIn into your most powerful professional research tool",
      description:
        "LinkedIn has over a billion members — including funders, collaborators, policymakers, and journal editors. This session converts your incomplete profile into a strategic academic presence optimised for discoverability, not just connections.",
      topics: [
        "Why LinkedIn matters for academics and how its algorithm treats research content",
        "Headline, About section, and Experience: writing for discoverability, not your CV",
        "Featured section strategy: pinning your papers, conference talks, and key work",
        "Skills, endorsements, and search keywords that get researchers found",
        "Building your academic network: the right 100 connections beat the wrong 1,000",
        "Content strategy for researchers: what to share, how often, and why it compounds",
      ] as const,
      isBonus: false,
      soloPrice: {
        usd: { regular: 65, earlyBird: 45 },
        ngn: { regular: 35000, earlyBird: 24000 },
      },
    },
    {
      number:   3,
      id:       "wordpress",
      name:     "WordPress",
      title:    "WordPress — Your Permanent Academic Home",
      subtitle: "Build an academic website you own and control permanently",
      description:
        "Your institution's staff page disappears the moment you move. Your WordPress academic website is the one digital presence you own permanently. This session covers domain setup, WordPress fundamentals, and the five essential pages every researcher's site must have.",
      topics: [
        "Why every researcher needs a website they own — not just an institutional profile",
        "Domain selection and hosting: the right setup for academics at every budget",
        "WordPress themes and page builders: what actually works for researcher websites",
        "The five essential pages: About, Research, Publications, CV, and Contact",
        "Embedding your ORCID iD and linking your Google Scholar and LinkedIn profiles",
        "SEO basics for academic websites: being findable on Google without paid ads",
      ] as const,
      isBonus: false,
      soloPrice: {
        usd: { regular: 79, earlyBird: 55 },
        ngn: { regular: 42000, earlyBird: 30000 },
      },
    },
    {
      number:   4,
      id:       "indexing",
      name:     "Indexing",
      title:    "Indexing — Google Scholar, Scopus & Web of Science",
      subtitle: "Master citation databases and the metrics that committees actually look at",
      description:
        "A deep-dive masterclass into how the three major scholarly databases index content, how to optimise your presence in each, and how to understand and ethically improve the citation metrics that institutions, collaborators, and grant committees examine.",
      topics: [
        "How Google Scholar, Scopus, and Web of Science index content differently",
        "Google Scholar profile optimisation: keywords, citation alerts, and profile accuracy",
        "Scopus Author ID: claiming your profile, merging duplicates, and optimising metrics",
        "Web of Science Researcher Profile and ResearcherID / Publons integration",
        "h-index, i10-index, and CiteScore: what they mean and what they genuinely don't",
        "Open access strategy for maximum indexing reach and citation counts",
      ] as const,
      isBonus: true,
      soloPrice: {
        usd: { regular: 55, earlyBird: 38 },
        ngn: { regular: 28000, earlyBird: 20000 },
      },
    },
    {
      number:   5,
      id:       "publishing-strategy",
      name:     "Publishing Strategy",
      title:    "Publishing Strategy — For Nigerian & African Researchers",
      subtitle: "Navigate the global publishing system from an African researcher's position",
      description:
        "A frank, practical masterclass built specifically for researchers working in Nigeria and across Africa — covering journal selection, open access routes, predatory journal avoidance, African scholarly infrastructure, and building a publication pipeline that produces indexed, citable work.",
      topics: [
        "Understanding the global publishing landscape as a Nigerian and African researcher",
        "Journal selection using SJR, CiteScore, and Scimago rankings — and what they really mean",
        "Open access routes: APC waivers, green OA, and African repository options",
        "Predatory journals: how to identify them and avoid them definitively",
        "AfricArXiv and African scholarly infrastructure you should already be using",
        "Building a 12-month publication pipeline with realistic, achievable targets",
      ] as const,
      isBonus: true,
      soloPrice: {
        usd: { regular: 55, earlyBird: 38 },
        ngn: { regular: 28000, earlyBird: 20000 },
      },
    },
  ],

  // ── Programme outcomes ─────────────────────────────────────────────────────
  outcomes: [
    "Set up a complete, verified ORCID profile with all your publications correctly linked",
    "Build a strategic LinkedIn presence optimised for academic and professional discoverability",
    "Launch a WordPress academic website that you own and control permanently",
    "Understand how major indexing databases work and how to maximise your presence in them",
    "Navigate the global publishing landscape strategically as a Nigerian and African researcher",
    "Leave with a coherent, connected digital scholarly identity across all key platforms",
  ],

  // ── Pricing ────────────────────────────────────────────────────────────────
  pricing: {
    earlyBirdDeadline: "2026-06-20",
    groupDiscounts: [
      { min: 3,  max: 10, off: 0.15 },
      { min: 11, max: 20, off: 0.25 },
    ],

    // Ecommerce bundles — replaces legacy tiers
    bundles: [
      {
        id:          "solo",
        name:        "Single Module",
        shortName:   "Per Module",
        tagline:     "One tool. One session.",
        description:
          "Enrol in any individual module as a standalone 2-hour live workshop. Ideal if you need just one specific platform, or want to experience the quality before committing to a full bundle.",
        recommended: false,
        isSolo:      true,
        savingsLabel: "",
        usd: { regular: 79, earlyBird: 45 },
        ngn: { regular: 42000, earlyBird: 24000 },
        whatsappContext: "Single module enrollment, July 2026",
        cta: "Pick a Module",
        includes: [
          "1 live session + recording (30-day access)",
          "Session workbook",
          "WhatsApp community access",
          "Digital certificate of attendance",
        ] as const,
      },
      {
        id:          "core",
        name:        "DVC Core Bundle",
        shortName:   "Core Bundle",
        tagline:     "ORCID · LinkedIn · WordPress",
        description:
          "The complete three-module Digital Visibility Clinic. Three tools, three sessions, one complete and connected digital academic presence. The most popular way to attend the clinic.",
        recommended: true,
        isSolo:      false,
        savingsLabel: "Save 30%",
        usd: { regular: 149, earlyBird: 99 },
        ngn: { regular: 85000, earlyBird: 60000 },
        whatsappContext: "DVC Core Bundle enrollment, July 2026",
        cta: "Secure Core Bundle",
        includes: [
          "3 live sessions + recordings (60-day access)",
          "Session workbook for each module",
          "WhatsApp community access throughout the cohort",
          "Pre-session profile audit before Module 1",
          "Priority Q&A during all sessions",
          "Personalised action plan after each module",
          "Physical + digital Certificate of Scholarly Visibility Practice",
        ] as const,
      },
      {
        id:          "pro",
        name:        "DVC Pro Bundle",
        shortName:   "Pro Bundle",
        tagline:     "Core + Indexing + Publishing Strategy",
        description:
          "Everything in the Core Bundle, plus two bonus masterclasses: a deep-dive into citation databases (Google Scholar, Scopus, WoS) and a publishing strategy session built for Nigerian and African researchers.",
        recommended: false,
        isSolo:      false,
        savingsLabel: "Save 42%",
        usd: { regular: 239, earlyBird: 149 },
        ngn: { regular: 130000, earlyBird: 85000 },
        whatsappContext: "DVC Pro Bundle enrollment, July 2026",
        cta: "Unlock Pro Bundle",
        includes: [
          "5 live sessions + recordings (90-day access)",
          "Session workbook for each module",
          "WhatsApp community (during cohort + 90 days post-clinic)",
          "Pre-session profile audit + Full Scholarly Intelligence Report",
          "Priority Q&A during all sessions",
          "Personalised 90-day visibility roadmap",
          "1 × 45-min private strategy call with the facilitator",
          "Physical premium certificate, mailed to your address",
          "90-day post-clinic WhatsApp mentorship",
        ] as const,
      },
    ],
  },

  // ── Testimonials ───────────────────────────────────────────────────────────
  testimonials: [
    {
      name:        "Barnabas Folami-A",
      institution: "Nigeria",
      quote:       "I feel ready to launch out and position myself for global relevance now as a 21st century researcher.",
      cohort:      "ASM Cohort",
    },
    {
      name:        "Chiemeziem Onyeka",
      institution: "Independent Researcher, Nigeria",
      quote:       "I can now present my research and profile to connect with the right audience and opportunities.",
      cohort:      "ASM Cohort",
    },
    {
      name:        "Dr Olabowale Omolade",
      institution: "Nigeria",
      quote:       "It is already impacting both my academic and professional work.",
      cohort:      "ASM Cohort",
    },
    {
      name:        "Olamide Adeboye",
      institution: "Kwara State Polytechnic, Nigeria",
      quote:       "The clinic gave me a platform to start strong with my career as a microbiologist.",
      cohort:      "ASM Cohort",
    },
    {
      name:        "Perpetua Nwachukwu",
      institution: "Federal University of Technology, Owerri",
      quote:       "Opened my eyes to tools that will help me right now and in the future.",
      cohort:      "FUTO EHS Cohort",
    },
    {
      name:        "Temitope Adebayo",
      institution: "University of Ibadan, Nigeria",
      quote:       "Helping young and vibrant scientists to be more visible, exactly what we needed.",
      cohort:      "ASM Cohort",
    },
    {
      name:        "Christiana Uzoagba",
      institution: "Chukwuemeka Odumegwu Ojukwu University",
      quote:       "Insightful and practical, offering valuable tips on personal branding and digital presence.",
      cohort:      "ASM Cohort",
    },
  ],

  // ── Certificate ────────────────────────────────────────────────────────────
  certificate: {
    name:        "Certificate of Scholarly Visibility Practice",
    issuer:      "Researchvy Clinics",
    description: "Awarded upon successful completion of the Digital Visibility Clinic (Core Bundle or Pro Bundle)",
    features: [
      "Unique certificate number",
      "QR verification code",
      "Public verification URL",
      "Institutional Researchvy branding",
    ],
  },

  // ── Post-clinic benefits ────────────────────────────────────────────────────
  postClinicBenefits: [
    "Access to all session recordings (Core: 60 days · Pro: 90 days)",
    "Researchvy Alumni Network membership",
    "Exclusive post-clinic resource library and template pack",
    "Verified certificate shareable directly on LinkedIn",
    "Priority access to future cohorts and new clinic modules",
  ],

  // ── FAQ ─────────────────────────────────────────────────────────────────────
  faq: [
    {
      question: "Who is the Digital Visibility Clinic designed for?",
      answer:
        "The clinic is designed for postgraduate researchers, early-career academics, established scholars, and institutional research staff in Nigeria and across Africa who want to improve how their research is found, cited, and engaged with. It is relevant across all disciplines — sciences, social sciences, and humanities alike.",
    },
    {
      question: "What is the difference between a module and a bundle?",
      answer:
        "A module is a single 2-hour live workshop focused on one specific tool — ORCID, LinkedIn, or WordPress. A bundle is a package of multiple modules sold together at a significant discount. The Core Bundle includes all three core modules (ORCID + LinkedIn + WordPress). The Pro Bundle adds two bonus masterclasses on top.",
    },
    {
      question: "Can I buy just one module?",
      answer:
        "Yes. Every module is available as a standalone purchase. If you already have a strong LinkedIn presence but need to fix your ORCID, you can buy the ORCID module only. If you want to start with one and upgrade to a bundle later, contact us via WhatsApp and we will apply your solo payment toward the bundle price.",
    },
    {
      question: "What is in the Core Bundle and why is it the most popular?",
      answer:
        "The Core Bundle includes all three core modules: ORCID, LinkedIn, and WordPress. Together these three platforms form the complete foundation of a researcher's digital presence — your identity layer (ORCID), your network layer (LinkedIn), and your permanent home (WordPress). Most participants find that completing all three in sequence produces the biggest transformation.",
    },
    {
      question: "What does the Pro Bundle add on top of the Core?",
      answer:
        "The Pro Bundle adds two bonus masterclasses: Indexing (a deep-dive into Google Scholar, Scopus, and Web of Science optimisation) and Publishing Strategy (a frank session on navigating the global publishing system as a Nigerian and African researcher). It also adds a Full Scholarly Intelligence Report, a private strategy call, 90-day post-clinic WhatsApp mentorship, and a premium mailed certificate.",
    },
    {
      question: "Is this relevant to my field of research?",
      answer:
        "Yes. The three core platforms — ORCID, LinkedIn, and WordPress — are used by researchers across all disciplines. Our previous cohorts included microbiologists, environmental scientists, social scientists, and humanities researchers. The tools and strategies in this clinic are field-agnostic.",
    },
    {
      question: "Do I have to attend sessions live?",
      answer:
        "Live attendance is strongly encouraged. The small cohort size means real interaction and personalised feedback. However, all sessions are recorded and provided to enrolled participants — Core Bundle for 60 days, Pro Bundle for 90 days.",
    },
    {
      question: "I already have a LinkedIn and ORCID. Is this still for me?",
      answer:
        "Almost certainly yes. In our experience, most researchers who believe their profiles are set up correctly have at least one significant gap — an unclaimed Scopus ID, a LinkedIn headline written like a CV, or an ORCID with missing publications. The clinic goes well beyond setup: it covers strategy, discoverability, and connection between platforms.",
    },
    {
      question: "How is this different from watching YouTube videos?",
      answer:
        "Passive content gives you information. The clinic gives you implementation. Every session ends with specific tasks you execute on your own profiles, with live feedback from the facilitator and your cohort peers. You leave with a completed, connected visibility system — not just notes.",
    },
    {
      question: "What is the total time commitment?",
      answer:
        "Core Bundle: 3 live sessions over 3 weeks (July 2026), each 2 hours, plus platform activities of roughly 1–2 hours per week. Pro Bundle: 5 live sessions over 5 weeks with the same weekly activity rhythm. Total: approximately 10–14 hours for Core, 16–20 hours for Pro.",
    },
    {
      question: "What will I have when I complete the clinic?",
      answer:
        "You will have a complete, verified ORCID profile, an optimised LinkedIn academic presence, and a live WordPress academic website — all connected to each other. Core and Pro Bundle participants also receive a physical and digital Certificate of Scholarly Visibility Practice.",
    },
    {
      question: "How much does the clinic cost?",
      answer:
        "Individual modules start from $79 USD (₦42,000 NGN) per module. The Core Bundle (ORCID + LinkedIn + WordPress — 3 sessions) is $149 USD (₦85,000 NGN). The Pro Bundle (all 5 core sessions) is $239 USD (₦130,000 NGN). Group discounts apply for 3 or more researchers from the same institution.",
    },
    {
      question: "Can my institution or department fund my place?",
      answer:
        "Yes. Many participants attend under institutional professional development budgets. We provide a formal institutional letter you can present to your department head or finance officer. This programme has been delivered in partnership with the American Society for Microbiology (ASM), Nigeria Chapter, and the Department of Environmental Health Science, Federal University of Technology, Owerri (FUTO). Contact us via WhatsApp to request a tailored institutional letter.",
    },
    {
      question: "How many participants are in each cohort?",
      answer:
        "Each cohort is limited to a maximum of 20 researchers to ensure every participant receives personal attention, peer interaction, and a high-quality experience.",
    },
    {
      question: "What do I need to participate?",
      answer:
        "A stable internet connection, an active research profile (or the intention to build one), and a commitment to completing the inter-session platform activities. No special software is required beyond a web browser.",
    },
  ],

  // ── Next cohort ─────────────────────────────────────────────────────────────
  // ⚠  Do NOT modify sessionTime, timezone, or track dates.
  nextCohort: {
    id:                   "cohort-2026-july",
    registrationDeadline: "2026-06-28",
    earlyBirdDeadline:    "2026-06-20",
    sessionTime:          "5:00–7:00 PM EST / 10:00 PM–12:00 AM WAT",
    timezone:             "EST (UTC−5) / WAT (UTC+1)",
    sessionDuration:      "2 hours",
    weeklyTaskHours:      1,
    totalCommitment:      "3 core sessions over 3 weeks (5 sessions for Pro Bundle)",
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
