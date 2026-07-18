import Link from "next/link";
import { ArrowRight, BarChart2, Building2, Users, TrendingUp, CheckCircle2 } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildWhatsAppUrl } from "@/config/site";
import { HoverCard } from "@/components/ui/HoverCard";

export const metadata = generatePageMetadata({
  title: "Institutional Research Visibility: For Universities & Research Offices",
  description: "Your institution's research is being published. Is it being found, cited, and converting into reputation, funding, and international collaboration? Researchvy builds the infrastructure for institutional visibility at scale.",
  path: "/researchers/institutional",
});

const PROBLEMS = [
  {
    stat:   "1 in 3",
    label:  "researchers have disambiguated author profiles",
    detail: "Scopus and Web of Science split citations across duplicate profiles, deflating your institution's bibliometric standing in every ranking that uses these databases.",
    color:  "#EF4444",
  },
  {
    stat:   "47%",
    label:  "of institutional publications are below citation benchmark",
    detail: "Not because the research isn't valuable, but because it isn't discoverable. Most institutions have no systematic approach to publication-level discoverability.",
    color:  "#F59E0B",
  },
  {
    stat:   "3x",
    label:  "funding application success rate for highly-cited researchers",
    detail: "H-index and citation metrics directly influence grant panel decisions. Institutions with strong visibility systems produce more fundable researchers.",
    color:  "#10B981",
  },
];

const AUDIT_DIMENSIONS = [
  "ORCID verification rate across all academic staff",
  "Author disambiguation status (Scopus, WoS, Google Scholar)",
  "Publication coverage across major indexing databases",
  "Citation attribution accuracy by department",
  "h-index distribution vs. peer institutions",
  "Open access compliance and discoverability gap",
  "Research communication reach (media, policy, public engagement)",
];

const PARTNERSHIP_TYPES = [
  {
    title:   "Institutional Visibility Audit",
    desc:    "A comprehensive baseline assessment of your institution's research visibility infrastructure, by department, by discipline, benchmarked against comparable institutions.",
    icon:    BarChart2,
    color:   "#60A5FA",
    cta:     "Discuss an Audit",
  },
  {
    title:   "Staff Development Programme",
    desc:    "Researchvy Academy delivered to cohorts of academic staff, from early-career to senior faculty. Customised content, institutional branding, and dedicated expert facilitation.",
    icon:    Users,
    color:   "#A78BFA",
    cta:     "Discuss a Programme",
  },
  {
    title:   "Discounted Clinic Access",
    desc:    "Preferred-rate Digital Visibility Clinic places for postgraduate students, postdocs, and junior faculty, with cohort scheduling coordinated around your academic calendar.",
    icon:    TrendingUp,
    color:   "#34D399",
    cta:     "Discuss Clinic Access",
  },
  {
    title:   "Strategic Partnership",
    desc:    "An ongoing research visibility partnership covering audit, training, intelligence, and impact tracking, with quarterly reporting to your research office.",
    icon:    Building2,
    color:   "#FCD34D",
    cta:     "Discuss a Partnership",
  },
];

export default function InstitutionalPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Header */}
        <div className="max-w-3xl mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#60A5FA" }}>
            For Universities &amp; Research Institutions
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold mb-5 leading-tight"
            style={{ fontFamily: "var(--font-serif)", color: "#111827", letterSpacing: "-0.02em" }}
          >
            Your Researchers Are Publishing.<br />
            <span style={{ color: "#60A5FA" }}>Is Anyone Finding Their Work?</span>
          </h1>
          <p className="text-lg leading-relaxed mb-8" style={{ color: "#6B7280" }}>
            Publication output has never been higher. Discovery rates haven&apos;t kept pace.
            If your institution&apos;s research isn&apos;t visible in the systems that funding bodies,
            ranking agencies, and international collaborators rely on, it isn&apos;t driving the
            reputation, impact, or competitive position you need.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={buildWhatsAppUrl("Researchvy institutional research visibility")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
              style={{ backgroundColor: "#25D366" }}
            >
              Discuss Your Institution
            </a>
            <Link
              href="/partnerships"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold border"
              style={{ borderColor: "#E2E8F0", color: "#6B7280" }}
            >
              View Partnership Options <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* The scale problem */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {PROBLEMS.map(({ stat, label, detail, color }) => (
            <HoverCard key={label} accentColor={color} className="p-6">
              <p className="text-4xl font-bold mb-2" style={{ color }}>{stat}</p>
              <p className="text-sm font-semibold mb-3" style={{ color: "#111827" }}>{label}</p>
              <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>{detail}</p>
            </HoverCard>
          ))}
        </div>

        {/* Audit scope */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16 items-start">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#6B7280" }}>
              What a visibility audit covers
            </p>
            <h2
              className="text-3xl font-bold mb-6"
              style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
            >
              You can&apos;t fix what<br />you haven&apos;t measured.
            </h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#6B7280" }}>
              The Researchvy Institutional Visibility Audit produces a full baseline across every
              dimension of your research discovery infrastructure, benchmarked against comparable
              institutions and broken down by department, career stage, and discipline.
            </p>
            <ul className="space-y-2.5">
              {AUDIT_DIMENSIONS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm" style={{ color: "#6B7280" }}>
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "#60A5FA" }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="rounded-2xl border p-8"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
          >
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#60A5FA" }}>
              Audit outcomes
            </p>
            <div className="space-y-4">
              {[
                ["Baseline visibility score", "A department-by-department visibility rating across all 7 audit dimensions"],
                ["Peer benchmarking", "Where your institution stands relative to comparable universities in your region and globally"],
                ["Priority fix list", "The 10 highest-leverage interventions ranked by expected bibliometric impact"],
                ["Staff development roadmap", "A phased training plan mapped to your existing PD calendar"],
                ["Executive summary", "Board and research committee-ready report with headline findings"],
              ].map(([title, desc]) => (
                <div key={String(title)} className="border-b pb-4 last:border-0 last:pb-0" style={{ borderColor: "#E2E8F0" }}>
                  <p className="text-sm font-semibold mb-1" style={{ color: "#111827" }}>{title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Partnership types */}
        <div className="mb-16">
          <h2
            className="text-3xl font-bold mb-8"
            style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
          >
            How we work with institutions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PARTNERSHIP_TYPES.map(({ title, desc, icon: Icon, color, cta }) => (
              <HoverCard key={title} accentColor={color} className="p-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${color}18` }}
                >
                  <Icon className="h-5 w-5" style={{ color }} />
                </div>
                <h3 className="text-base font-bold mb-2" style={{ color: "#111827" }}>{title}</h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "#6B7280" }}>{desc}</p>
                <a
                  href={buildWhatsAppUrl(title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-80"
                  style={{ color }}
                >
                  {cta} <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </HoverCard>
            ))}
          </div>
        </div>

        {/* The ROI argument */}
        <div
          className="rounded-3xl border p-10 mb-16"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
        >
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#F59E0B" }}>
              The return on visibility investment
            </p>
            <h2
              className="text-2xl font-bold mb-4"
              style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
            >
              Every citation your researchers lose to poor visibility<br />
              is a ranking point, a funding argument, or a collaboration that never happened.
            </h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "#6B7280" }}>
              QS, Times Higher Education, and ARWU all use citation-based metrics that depend
              directly on the quality of your researchers&apos; visibility infrastructure. An institution
              with 200 academics each recovering an average of 15 lost citations produces 3,000
              additional attributed citations, enough to move measurably in most ranking bands.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
              This is infrastructure investment, not training spend. The effect compounds
              every year as newly attributed publications continue to accrue citations.
            </p>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            className="rounded-2xl border p-8"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
          >
            <h3 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>
              Start with a conversation
            </h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#6B7280" }}>
              Tell us about your institution: researcher count, current challenges, and where
              you&apos;d like to be in 18 months. We&apos;ll tell you exactly what a partnership would deliver.
            </p>
            <a
              href={buildWhatsAppUrl("Researchvy institutional partnership enquiry")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white"
              style={{ backgroundColor: "#25D366" }}
            >
              Chat on WhatsApp
            </a>
          </div>
          <div
            className="rounded-2xl border p-8"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
          >
            <h3 className="text-xl font-bold mb-3" style={{ color: "#111827" }}>
              See the intelligence layer first
            </h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#6B7280" }}>
              Researchvy Intelligence provides institutional bibliometric audits, researcher
              profile assessments, and department-level visibility benchmarking, as a
              standalone service or as the first phase of a full partnership.
            </p>
            <Link
              href="/intelligence"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white"
              style={{ backgroundColor: "#2563EB" }}
            >
              View Intelligence Services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
