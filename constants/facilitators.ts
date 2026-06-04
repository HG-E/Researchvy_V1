/**
 * Facilitator profiles — update with real details before going live.
 * These are displayed on /about, the clinic detail page, and SEO metadata.
 */

export interface Publication {
  title:   string;
  journal: string;
  year:    number;
  url?:    string;
}

export interface Facilitator {
  id:            string;
  name:          string;
  title:         string;                // e.g. "PhD Candidate | Research Visibility Strategist"
  affiliation:   string;                // e.g. "University of Lagos"
  photo:         string;                // Cloudinary URL or /images/... path
  bio:           string;                // 2-3 sentence bio
  credentials:   string[];              // e.g. ["PhD (in progress), Educational Technology", "MSc Research Methods"]
  specialisms:   string[];              // e.g. ["ORCID Optimisation", "Google Scholar Strategy"]
  linkedin?:     string;                // LinkedIn profile URL
  orcid?:        string;                // ORCID iD URL  e.g. https://orcid.org/0000-0000-0000-0000
  googleScholar?: string;               // Google Scholar profile URL
  publications:  Publication[];
  clinicsLed:    number;                // how many cohorts facilitated
  researchersHelped: number;            // total researchers worked with
}

export const FACILITATORS: Facilitator[] = [
  {
    id:          "hillary-goodness",
    name:        "Hillary Goodness",
    title:       "Research Visibility Strategist & Founder",
    affiliation: "Researchvy",
    photo:       "",                    // ← Add Cloudinary URL or /images/hillary.jpg
    bio:         "Hillary Goodness is a research visibility strategist with hands-on experience helping African researchers build discoverable, citable academic profiles. Through Researchvy, he has guided researchers across Nigeria, Ghana, and Kenya in transforming their online scholarly presence using platforms including ORCID, Google Scholar, Scopus, and LinkedIn.",
    credentials: [
      // ← Add your actual credentials, e.g.:
      // "MSc Information Science, University of Lagos",
      // "Certified Research Skills Trainer",
    ],
    specialisms: [
      "ORCID Profile Optimisation",
      "Google Scholar Strategy",
      "Research Discoverability",
      "Scholarly Identity Architecture",
      "h-index & Citation Growth",
      "LinkedIn for Researchers",
    ],
    linkedin:      "",   // ← Add your LinkedIn URL
    orcid:         "",   // ← Add your ORCID iD URL
    googleScholar: "",   // ← Add your Google Scholar URL
    publications: [
      // ← Add your real publications, e.g.:
      // {
      //   title:   "Building Research Visibility in Sub-Saharan Africa",
      //   journal: "African Journal of Library Sciences",
      //   year:    2024,
      //   url:     "https://doi.org/...",
      // },
    ],
    clinicsLed:         6,
    researchersHelped: 140,
  },
];

/** Partner institutions that have previously hosted or co-delivered Researchvy programmes */
export const PARTNER_INSTITUTIONS = [
  { name: "ASM Nigeria",         logo: "" },
  { name: "FUTO EHS Department", logo: "" },
  { name: "Bingham University",  logo: "" },
  // ← Add more as you get them
];
