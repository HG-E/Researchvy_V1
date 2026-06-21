import Link from "next/link";
import { ArrowRight, GraduationCap, Building2, BarChart2, CheckCircle2 } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";

export const metadata = generatePageMetadata({
  title: "For Researchers — Researchvy",
  description:
    "Whether you're a PhD student, postdoc, junior faculty, or research office — Researchvy has a structured path to scholarly visibility, citation growth, and global discoverability.",
  path: "/researchers",
});

const PATHS = [
  {
    href:        "/researchers/early-career",
    icon:        GraduationCap,
    color:       "#2563EB",
    bgColor:     "rgba(37,99,235,0.08)",
    borderColor: "rgba(37,99,235,0.2)",
    label:       "Early-Career Researchers",
    subtitle:    "PhD students, postdocs & junior faculty",
    description:
      "You're publishing but not being found. Scopus is splitting your citations. Your h-index isn't reflecting your output. We built a direct path from invisible to discoverable — starting with your next paper.",
    bullets: [
      "ORCID disambiguation & identity verification",
      "Google Scholar + Scopus profile audit",
      "12-month visibility strategy before your tenure review",
    ],
    cta: "See the early-career path",
  },
  {
    href:        "/researchers/institutional",
    icon:        Building2,
    color:       "#7C3AED",
    bgColor:     "rgba(124,58,237,0.08)",
    borderColor: "rgba(124,58,237,0.2)",
    label:       "Institutions & Research Offices",
    subtitle:    "Universities, research councils & VP offices",
    description:
      "Your researchers are publishing. Is the institution showing up in rankings, grant panels, and collaboration networks? We build the visibility infrastructure that makes your research count — at scale.",
    bullets: [
      "Institution-wide bibliometric audit",
      "Disambiguation & profile normalisation across departments",
      "Researcher visibility training programmes",
    ],
    cta: "See the institutional path",
  },
];

const FREE_TOOLS = [
  {
    href:   "/resources/visibility-scorecard",
    icon:   BarChart2,
    color:  "#10B981",
    label:  "Visibility Scorecard",
    detail: "12-checkpoint audit. Score out of 100. Free, no email required.",
  },
  {
    href:   "/consultation",
    icon:   CheckCircle2,
    color:  "#2563EB",
    label:  "Free Strategy Call",
    detail: "20 minutes. Walk through your gaps. Get a written action plan.",
  },
];

export default function ResearchersHubPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080E1A" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Hero */}
        <div className="max-w-3xl mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
            For Researchers
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold mb-5 leading-tight"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB", letterSpacing: "-0.02em" }}
          >
            Your research deserves to be found.
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "#94A3B8" }}>
            Millions of researchers publish every year. Most are never found, rarely cited,
            and invisible in the databases and networks that shape careers.
            Researchvy exists to fix that — for researchers at every stage and every institution.
          </p>
        </div>

        {/* Path cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          {PATHS.map((path) => {
            const Icon = path.icon;
            return (
              <Link
                key={path.href}
                href={path.href}
                className="rounded-2xl border p-7 flex flex-col group transition-all duration-200 hover:border-[#334155]"
                style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: path.bgColor, border: `1px solid ${path.borderColor}` }}
                >
                  <Icon className="h-5 w-5" style={{ color: path.color }} />
                </div>

                <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: path.color }}>
                  {path.subtitle}
                </p>
                <h2
                  className="text-xl font-bold mb-3"
                  style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
                >
                  {path.label}
                </h2>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "#6B7280" }}>
                  {path.description}
                </p>

                <ul className="space-y-2 mb-6 flex-1">
                  {path.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" style={{ color: path.color }} />
                      <span className="text-sm" style={{ color: "#94A3B8" }}>{b}</span>
                    </li>
                  ))}
                </ul>

                <div
                  className="flex items-center gap-1.5 text-sm font-semibold transition-colors group-hover:gap-2.5"
                  style={{ color: path.color }}
                >
                  {path.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Free tools section */}
        <div
          className="rounded-2xl border p-7 mb-16"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#4B5563" }}>
            Start here — both free
          </p>
          <h2
            className="text-xl font-bold mb-6"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
          >
            Not sure where to begin?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FREE_TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="flex items-start gap-4 rounded-xl border p-5 transition-all duration-200 hover:border-[#334155] group"
                  style={{ borderColor: "#1E293B", backgroundColor: "#080E1A" }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: tool.color + "15" }}
                  >
                    <Icon className="h-4 w-4" style={{ color: tool.color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold mb-1 group-hover:text-white transition-colors" style={{ color: "#F9FAFB" }}>
                      {tool.label}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>{tool.detail}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 flex-shrink-0 mt-0.5 ml-auto transition-transform group-hover:translate-x-0.5" style={{ color: "#4B5563" }} />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Clinic CTA */}
        <div
          className="rounded-2xl border p-7 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          style={{ backgroundColor: "rgba(37,99,235,0.06)", borderColor: "rgba(37,99,235,0.2)" }}
        >
          <div className="max-w-xl">
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#60A5FA" }}>
              Flagship programme
            </p>
            <h2
              className="text-xl font-bold mb-2"
              style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
            >
              Digital Visibility Clinic
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
              3 core sessions + 2 bonus masterclasses. Up to 20 researchers per cohort. Leave with a fully optimised scholarly identity,
              a personal visibility strategy, and a verified Researchvy certificate.
            </p>
          </div>
          <Link
            href="/clinics/digital-visibility-clinic"
            className="flex-shrink-0 flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#1D4ED8]"
            style={{ backgroundColor: "#2563EB" }}
          >
            View the Clinic
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
