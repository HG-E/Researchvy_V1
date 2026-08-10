/**
 * Researchvy FREE Pre-Clinic — ORCID workshop.
 * Single source of truth for session data, shared by the registration
 * form (client) and the registration API route (server-side validation).
 *
 * ⚠  Do NOT change session dates/times without updating the confirmation
 *    email copy in lib/email/index.ts (sendPreClinicConfirmation).
 */

export const preClinic = {
  title:    "Researchvy Free Pre-Clinic",
  tagline:  "ORCID: Your Permanent Researcher Identity",
  subtitle: "Your research has an identity. Make sure the world can find it.",
  keyMessage:
    "ORCID provides a persistent digital identifier that helps distinguish you from researchers with similar names and helps connect your work across participating systems. Many journals, publishers, funders and institutions support or request ORCID, although requirements vary.",

  format: "virtual" as const,

  agenda: [
    "What ORCID is and why researchers need it",
    "Creating your free ORCID iD",
    "Setting up your researcher profile correctly",
    "Connecting your ORCID to your publications",
    "Using ORCID with journals, publishers and research platforms",
    "Common mistakes researchers should avoid",
    "How ORCID fits into your wider research visibility strategy",
  ] as const,
} as const;

export const PRE_CLINIC_SESSIONS = [
  {
    id:    "saturday",
    label: "Saturday",
    date:  "15 August 2026",
    time:  "8:00 – 10:00 AM",
  },
  {
    id:    "sunday",
    label: "Sunday",
    date:  "16 August 2026",
    time:  "6:00 – 8:00 PM",
  },
  {
    id:    "both",
    label: "Both sessions",
    date:  "Sat 15 & Sun 16 August 2026",
    time:  "Whichever suits you — attend both",
  },
] as const;

export type PreClinicSessionId = (typeof PRE_CLINIC_SESSIONS)[number]["id"];

export const CAREER_STAGES = [
  { id: "undergraduate", label: "Undergraduate student" },
  { id: "postgraduate",  label: "Postgraduate student (Masters)" },
  { id: "phd",            label: "PhD candidate" },
  { id: "early_career",   label: "Early-career researcher" },
  { id: "established",    label: "Established researcher / faculty" },
  { id: "other",           label: "Other" },
] as const;

export type CareerStageId = (typeof CAREER_STAGES)[number]["id"];
