import Link from "next/link";
import { BarChart2, GraduationCap, FileImage, Stethoscope, Network, ArrowRight, Clock } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";
import { getUsdNgnRate, usdToNgn, formatNgn } from "@/lib/currency/usdNgn";

export const metadata = generatePageMetadata({
  title: "The Researchvy Ecosystem",
  description:
    "Explore Researchvy's five specialised divisions covering every dimension of scholarly visibility and research intelligence.",
  path: "/ecosystem",
});

const DIVISION_ACCENTS: Record<string, string> = {
  intelligence: "#2563EB",
  academy:      "#A78BFA",
  media:        "#FCD34D",
  clinics:      "#34D399",
  network:      "#F472B6",
};

const DIVISION_ICONS: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties; "aria-hidden"?: boolean }>> = {
  intelligence: BarChart2,
  academy:      GraduationCap,
  media:        FileImage,
  clinics:      Stethoscope,
  network:      Network,
};

/** Only these two divisions have live product pages. */
const LIVE_DIVISIONS = new Set(["academy", "clinics"]);

interface DivisionDetail {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  features: string[];
  cardStats: { label: string; value: string }[];
}

const DIVISION_DETAILS: DivisionDetail[] = [
  {
    id: "intelligence",
    name: "Researchvy Intelligence",
    slug: "intelligence",
    tagline: "Visibility audits · Citation intelligence · Institutional benchmarking",
    description:
      "You can't fix what you can't measure. We give researchers and institutions a complete, honest picture of where they stand, and a prioritised plan to close every gap.",
    features: [
      "Full scholarly visibility audit for your profile and publication record",
      "Citation gap analysis and h-index benchmarking against peers",
      "Prioritised action plan with quarterly tracking milestones",
    ],
    cardStats: [
      { label: "Visibility audit scope",      value: "Full profile + citations" },
      { label: "Benchmark comparison",        value: "Institutional + global" },
      { label: "Delivery format",             value: "Report + action plan" },
    ],
  },
  {
    id: "academy",
    name: "Researchvy Academy",
    slug: "academy",
    tagline: "5-level curriculum · Certifications · Structured learning",
    description:
      "Publishing was one skill. Being found is another. Academy teaches the visibility skills that academia never did — five structured levels from foundation to advanced strategy.",
    features: [
      "5-level curriculum from foundation to advanced visibility strategy",
      "Free starter level — no commitment to access the basics",
      "Verifiable certificates upon completing each level",
    ],
    cardStats: [
      { label: "Curriculum levels",     value: "5 (Foundation → Advanced)" },
      { label: "Free access",           value: "Level 1 starter courses" },
      { label: "Certification",         value: "Verifiable on profile" },
    ],
  },
  {
    id: "media",
    name: "Researchvy Media",
    slug: "media",
    tagline: "Research storytelling · Visual abstracts · Policy translation",
    description:
      "Your findings are locked in formats most people will never open. We translate your research into content that reaches policymakers, practitioners, and the public who need it.",
    features: [
      "Research translated into policy-ready briefs and plain-language summaries",
      "Visual abstracts and infographics for social and conference use",
      "Multi-platform distribution to reach your intended audience",
    ],
    cardStats: [
      { label: "Output formats",         value: "Brief · Infographic · Thread" },
      { label: "Target audiences",       value: "Policy · Practice · Public" },
      { label: "Distribution channels",  value: "Multi-platform" },
    ],
  },
  {
    id: "clinics",
    name: "Researchvy Clinics",
    slug: "clinics",
    tagline: "Live training · ≤20 per cohort · Verified certificate",
    description:
      "5 core sessions. One complete transformation. You leave with a fully optimised scholarly identity, a personal visibility strategy, and a verified certificate — not just notes.",
    features: [
      "≤20 researchers per live cohort — intimate, focused, expert-led",
      "5 sessions covering profile, citations, grants, outreach, and strategy",
      "Verified certificate included — recognised on academic CVs",
    ],
    cardStats: [
      { label: "Cohort size",    value: "≤20 researchers" },
      { label: "Sessions",       value: "5 live sessions" },
      { label: "Starting from",  value: "$79 USD" },
    ],
  },
  {
    id: "network",
    name: "Researchvy Network",
    slug: "network",
    tagline: "Peer community · Fellows programme · Global reach",
    description:
      "The researchers gaining ground fastest aren't doing it alone. The Network connects you with peers who are building visibility seriously, and holding each other accountable.",
    features: [
      "Peer accountability groups matched by research discipline and career stage",
      "Researchvy Fellows programme with exclusive resources and recognition",
      "Active community across 38+ countries and growing",
    ],
    cardStats: [
      { label: "Countries represented", value: "38+" },
      { label: "Fellows programme",     value: "Application-based" },
      { label: "Community access",      value: "Invitation on launch" },
    ],
  },
];

export default async function EcosystemPage() {
  const rate = await getUsdNgnRate();
  const divisions = DIVISION_DETAILS.map((d) =>
    d.id === "clinics"
      ? {
          ...d,
          cardStats: d.cardStats.map((s) =>
            s.label === "Starting from"
              ? { ...s, value: `$79 USD · ${formatNgn(usdToNgn(79, rate))} NGN` }
              : s
          ),
        }
      : d
  );
  return (
    <div style={{ backgroundColor: "#FFFFFF", color: "#111827" }}>

      {/* ── Hero ──────────────────────────────────────────── */}
      <section
        className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 text-center overflow-hidden"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 55% at 50% -5%, rgba(37,99,235,0.18) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        {/* Right accent */}
        <div
          className="absolute top-0 right-0 w-72 h-72 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 100% 0%, rgba(124,58,237,0.08) 0%, transparent 60%)",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-4xl">
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#2563EB" }}>
            The Ecosystem
          </p>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
            style={{ fontFamily: "var(--font-serif)", color: "#111827", letterSpacing: "-0.02em" }}
          >
            Every Dimension of Visibility.<br />
            <span style={{ color: "#2563EB" }}>One Ecosystem.</span>
          </h1>
          <p className="text-base sm:text-lg max-w-3xl mx-auto leading-relaxed" style={{ color: "#4B5563" }}>
            Most researchers address one piece of the visibility problem. Researchvy addresses
            all of it, five specialised divisions working together so nothing gets left behind.
          </p>

          {/* Division count badges */}
          <div className="flex flex-wrap gap-2 justify-center mt-8">
            {siteConfig.divisions.map((d) => {
              const accent = DIVISION_ACCENTS[d.id] ?? "#2563EB";
              const isLive = LIVE_DIVISIONS.has(d.id);
              return isLive ? (
                <Link
                  key={d.id}
                  href={`/${d.slug}`}
                  className="text-xs font-medium px-3 py-1.5 rounded-full border transition-colors duration-150"
                  style={{
                    backgroundColor: `${accent}10`,
                    borderColor:     `${accent}30`,
                    color:           accent,
                  }}
                >
                  {d.name}
                </Link>
              ) : (
                <span
                  key={d.id}
                  className="text-xs font-medium px-3 py-1.5 rounded-full border"
                  style={{
                    backgroundColor: "#F8FAFC",
                    borderColor:     "#E2E8F0",
                    color:           "#9CA3AF",
                  }}
                  title="Coming Soon"
                >
                  {d.name}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Divisions — alternating layout ─────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-20 sm:space-y-28">
          {divisions.map((division, i) => {
            const accent = DIVISION_ACCENTS[division.id] ?? "#2563EB";
            const Icon   = DIVISION_ICONS[division.id] ?? BarChart2;
            const isLive = LIVE_DIVISIONS.has(division.id);
            return (
              <div
                key={division.id}
                className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
              >
                {/* Text — swap order for odd items on desktop */}
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="flex items-center gap-2 mb-3">
                    <p
                      className="text-xs font-semibold tracking-widest uppercase"
                      style={{ color: accent }}
                    >
                      Division {i + 1} of {siteConfig.divisions.length}
                    </p>
                    {!isLive && (
                      <span
                        className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: "#FEF3C7", color: "#D97706", border: "1px solid #FCD34D50" }}
                      >
                        <Clock className="h-2.5 w-2.5" aria-hidden="true" />
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <h2
                    className="text-3xl sm:text-4xl font-bold mb-3 leading-tight"
                    style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
                  >
                    {division.name}
                  </h2>
                  <p className="text-sm font-semibold mb-5" style={{ color: isLive ? accent : "#9CA3AF" }}>
                    {division.tagline}
                  </p>
                  <p className="text-base leading-relaxed mb-6" style={{ color: "#4B5563" }}>
                    {division.description}
                  </p>

                  {/* Key features list */}
                  <ul className="space-y-2 mb-8">
                    {division.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2 text-sm" style={{ color: "#374151" }}>
                        <span
                          className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: isLive ? accent : "#9CA3AF" }}
                          aria-hidden="true"
                        />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  {isLive ? (
                    <Link
                      href={`/${division.slug}`}
                      className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 active:scale-[0.97]"
                      style={{ backgroundColor: accent }}
                    >
                      Explore {division.name}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-3 items-start">
                      <Link
                        href={`/contact?inquiry=${division.slug}`}
                        className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold border transition-all duration-150 hover:border-[#D97706] hover:text-[#D97706] active:scale-[0.97]"
                        style={{ borderColor: "#E2E8F0", color: "#4B5563" }}
                      >
                        Register Interest
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <p className="text-xs self-center" style={{ color: "#9CA3AF" }}>
                        Be notified when {division.name.split(" ")[1]} launches
                      </p>
                    </div>
                  )}
                </div>

                {/* Visual card */}
                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <div
                    className="relative rounded-2xl overflow-hidden border p-8"
                    style={{
                      minHeight: 280,
                      background: isLive
                        ? `linear-gradient(135deg, ${accent}12 0%, ${accent}05 100%)`
                        : "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)",
                      borderColor: isLive ? `${accent}30` : "#E2E8F0",
                    }}
                  >
                    {/* Coming Soon overlay ribbon */}
                    {!isLive && (
                      <div
                        className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                        style={{ backgroundColor: "#FEF3C7", color: "#D97706", border: "1px solid #FCD34D80" }}
                      >
                        <Clock className="h-3 w-3" aria-hidden="true" />
                        Coming Soon
                      </div>
                    )}

                    {/* Icon + division name */}
                    <div className="flex items-center gap-4 mb-6">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center border flex-shrink-0"
                        style={{
                          backgroundColor: isLive ? `${accent}18` : "#F1F5F9",
                          borderColor:     isLive ? `${accent}40` : "#E2E8F0",
                        }}
                      >
                        <Icon className="w-7 h-7" style={{ color: isLive ? accent : "#9CA3AF" }} />
                      </div>
                      <div>
                        <p className="text-sm font-bold leading-snug" style={{ color: isLive ? "#111827" : "#6B7280" }}>
                          {division.name}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: isLive ? accent : "#9CA3AF" }}>
                          {isLive ? "Active · Enrolling now" : "In development"}
                        </p>
                      </div>
                    </div>

                    {/* Stat / feature chips */}
                    <div className="space-y-3">
                      {division.cardStats.map(({ label, value }) => (
                        <div
                          key={label}
                          className="flex items-center justify-between rounded-xl px-4 py-3 border"
                          style={{
                            backgroundColor: isLive ? "#FFFFFF" : "#F8FAFC",
                            borderColor:     isLive ? `${accent}20` : "#E2E8F0",
                          }}
                        >
                          <span className="text-xs font-medium" style={{ color: "#4B5563" }}>{label}</span>
                          <span
                            className="text-xs font-bold"
                            style={{ color: isLive ? accent : "#9CA3AF" }}
                          >
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Top-left corner accent for live */}
                    {isLive && (
                      <div
                        className="absolute top-0 left-0 w-24 h-24 pointer-events-none"
                        style={{
                          background: `radial-gradient(circle at 0% 0%, ${accent}15 0%, transparent 70%)`,
                        }}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Framework reminder ─────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#2563EB" }}>
            The Framework
          </p>
          <h2
            className="text-2xl sm:text-3xl font-bold mb-4"
            style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
          >
            Every division serves the journey.
          </h2>
          {/* Scrollable chain — mobile friendly */}
          <div className="relative mt-6">
            <div
              className="absolute left-0 top-0 bottom-0 w-8 pointer-events-none z-10 sm:hidden"
              style={{ background: "linear-gradient(90deg, #FFFFFF, transparent)" }}
              aria-hidden="true"
            />
            <div
              className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none z-10 sm:hidden"
              style={{ background: "linear-gradient(270deg, #FFFFFF, transparent)" }}
              aria-hidden="true"
            />
            <div
              className="flex items-center gap-2 overflow-x-auto sm:flex-wrap sm:justify-center pb-1"
              style={{ scrollbarWidth: "none" } as React.CSSProperties}
            >
              {(siteConfig.framework as readonly string[]).map((step, i) => (
                <span key={i} className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className="text-xs font-medium px-3 py-1.5 rounded-full border whitespace-nowrap"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: i === siteConfig.framework.length - 1 ? "#10B981" : "#E2E8F0",
                      color:       i === siteConfig.framework.length - 1 ? "#10B981" : "#6B7280",
                    }}
                  >
                    {step}
                  </span>
                  {i < siteConfig.framework.length - 1 && (
                    <span className="text-sm flex-shrink-0" style={{ color: "#2563EB" }}>→</span>
                  )}
                </span>
              ))}
            </div>
          </div>
          <p className="text-sm mt-5" style={{ color: "#4B5563" }}>
            Every Researchvy division serves at least one step in this journey.
          </p>

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link
              href="/clinics"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90 active:scale-[0.97]"
              style={{ backgroundColor: "#2563EB" }}
            >
              Join a Clinic <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold border transition-all duration-200 hover:border-[#2563EB] hover:text-[#111827] active:scale-[0.97]"
              style={{ borderColor: "#E2E8F0", color: "#4B5563" }}
            >
              About Researchvy
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
