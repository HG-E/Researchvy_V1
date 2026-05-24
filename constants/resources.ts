export type ResourceAccess = "free" | "newsletter" | "clinic";
export type ResourceIconName = "FileText" | "CheckSquare" | "Layout" | "BarChart2" | "BookOpen" | "Layers";

export interface StaticResource {
  id:          string;
  title:       string;
  description: string;
  category:    "guide" | "checklist" | "template" | "workbook" | "toolkit" | "report";
  access:      ResourceAccess;
  featured:    boolean;
  tags:        string[];
  icon:        ResourceIconName;
  color:       string;
}

export const RESOURCES: StaticResource[] = [
  {
    id:          "visibility-audit-checklist",
    title:       "Researcher Visibility Audit Checklist",
    description: "A comprehensive 50-point checklist to audit and optimise your entire digital scholarly presence — ORCID, Google Scholar, Scopus, institutional profiles, and more.",
    category:    "checklist",
    access:      "newsletter",
    featured:    true,
    tags:        ["ORCID", "Google Scholar", "Scopus", "audit"],
    icon:        "CheckSquare",
    color:       "#10B981",
  },
  {
    id:          "orcid-optimisation-guide",
    title:       "ORCID Profile Optimisation Guide",
    description: "Step-by-step guide to building, connecting, and maintaining an ORCID profile that maximises your scholarly identity and discoverability.",
    category:    "guide",
    access:      "newsletter",
    featured:    false,
    tags:        ["ORCID", "scholarly identity", "disambiguation"],
    icon:        "BookOpen",
    color:       "#2563EB",
  },
  {
    id:          "google-scholar-framework",
    title:       "Google Scholar Optimisation Framework",
    description: "How to structure your Google Scholar profile for maximum discoverability — author merging, article verification, citation tracking setup.",
    category:    "guide",
    access:      "newsletter",
    featured:    false,
    tags:        ["Google Scholar", "profile", "discoverability"],
    icon:        "FileText",
    color:       "#2563EB",
  },
  {
    id:          "researchvy-framework-overview",
    title:       "The Researchvy 7-Step Framework",
    description: "A visual overview of the Research → Visibility → Discoverability → Connection → Communication → Application → Impact framework.",
    category:    "guide",
    access:      "free",
    featured:    false,
    tags:        ["framework", "visibility", "impact"],
    icon:        "Layers",
    color:       "#8B5CF6",
  },
  {
    id:          "citation-intelligence-workbook",
    title:       "Citation Intelligence Workbook",
    description: "A structured workbook for auditing your citation profile, understanding your h-index, and developing an ethical citation growth strategy.",
    category:    "workbook",
    access:      "clinic",
    featured:    false,
    tags:        ["bibliometrics", "h-index", "citations", "Scopus"],
    icon:        "BarChart2",
    color:       "#F59E0B",
  },
  {
    id:          "visibility-strategy-template",
    title:       "Personal Visibility Strategy Template",
    description: "A 12-month strategic planning template for building and tracking your scholarly visibility across all key dimensions.",
    category:    "template",
    access:      "clinic",
    featured:    false,
    tags:        ["strategy", "planning", "visibility roadmap"],
    icon:        "Layout",
    color:       "#EC4899",
  },
];
