import Link from "next/link";
import {
  ArrowRight, GraduationCap, MessageCircle, PlayCircle,
  CheckCircle, Globe, TrendingUp, Award, Users, BookOpen,
  Zap, ChevronRight,
} from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { buildWhatsAppUrl } from "@/config/site";
import { LEVEL_COLORS } from "@/constants/academy";

export const metadata = generatePageMetadata({
  title: "Researchvy Academy — Research Visibility & Scholarly Impact Training",
  description:
    "The only professional development platform built specifically for researchers who want to be found, cited, funded, and promoted. Five structured levels. Start free today.",
  path: "/academy",
});

// ── Level data ─────────────────────────────────────────────────────────────

const LEVELS = [
  {
    level: 1,
    name: "Research Identity",
    tagline: "Be Found Where It Counts",
    description:
      "Build a verified, cross-platform scholarly identity that discovery systems, promotion panels, and grant reviewers can actually find.",
    outcomes: [
      "Verified Scopus Author Profile — no duplicates, all papers attributed",
      "ORCID iD linked to every major platform",
      "Google Scholar claimed, complete, and monitored",
      "Citations flowing to one profile, not scattered across three",
    ],
    slug: "research-identity",
    available: true,
    lessonCount: 36,
  },
  {
    level: 2,
    name: "Research Intelligence",
    tagline: "Read the Numbers Running Your Career",
    description:
      "Understand and use every metric that drives promotion decisions, grant awards, and institutional recognition — bibliometrics, h-index strategy, journal rankings, citation intelligence.",
    outcomes: [
      "Read your bibliometric profile like a career strategist",
      "Know which journal to target for every paper",
      "Grow your h-index with ethical, evidence-based strategies",
      "Present your metrics compellingly to any review panel",
    ],
    slug: null,
    available: false,
    lessonCount: 26,
  },
  {
    level: 3,
    name: "Research Presence",
    tagline: "Build the Platform the World Can Find",
    description:
      "Extend your visibility beyond databases — LinkedIn authority, personal website, research newsletter, social media presence that positions you as a credible public expert.",
    outcomes: [
      "LinkedIn profile that ranks in your field",
      "Personal research website that works while you sleep",
      "Newsletter that grows your audience and citation network",
      "Social media presence that drives paper discovery",
    ],
    slug: null,
    available: false,
    lessonCount: 40,
  },
  {
    level: 4,
    name: "Research Impact",
    tagline: "Make Your Work Change the World",
    description:
      "Translate your research into policy briefs, media coverage, community partnerships, and real-world decisions that cite your work and elevate your institutional standing.",
    outcomes: [
      "Write policy briefs that reach decision-makers",
      "Earn media coverage for your research findings",
      "Build the Altmetric score that impresses any grant reviewer",
      "Create a measurable trail from your research to real outcomes",
    ],
    slug: null,
    available: false,
    lessonCount: 20,
  },
  {
    level: 5,
    name: "Research Leadership",
    tagline: "Lead the Future of Scholarship",
    description:
      "Shape institutional research culture, pioneer open science practices, build mentorship programmes, and become the researcher others benchmark themselves against.",
    outcomes: [
      "Design open science systems at institutional level",
      "Lead research mentorship and visibility training",
      "Publish research on research practice itself",
      "Become a recognised authority on scholarly visibility",
    ],
    slug: null,
    available: false,
    lessonCount: 19,
  },
] as const;

const AUDIENCES = [
  {
    region: "Nigeria & West Africa",
    flag: "🇳🇬",
    pain: "Your promotion committee opens Scopus first. Do you know what they see?",
    stakes:
      "NUC assessments, TETFUND grants, and university promotion panels from Lecturer II to Professor all use Scopus metrics as the primary measure of research output. Researchers with incomplete or fragmented profiles are passed over — not because their work is weak, but because the system cannot find it.",
    keywords: ["Scopus h-index", "NUC benchmarks", "TETFUND grants", "promotion dossier"],
  },
  {
    region: "USA & Canada",
    flag: "🇺🇸",
    pain: "Your NIH biosketch, your tenure file, and your NSF application all depend on metrics you may not be managing.",
    stakes:
      "NIH requires ORCID for all principal investigators. NSF grant reviewers weight Intellectual Merit and Broader Impacts using your citation record. Tenure committees at research universities now benchmark your h-index against field norms. Are you measuring up — or are you below average without knowing it?",
    keywords: ["NIH biosketch", "NSF Intellectual Merit", "tenure review", "ORCID required"],
  },
  {
    region: "Europe & UK",
    flag: "🇪🇺",
    pain: "EU Horizon requires ORCID. ERC reviewers benchmark your h-index. Are your profiles ready?",
    stakes:
      "EU Horizon Europe requires named researchers to have ORCID iDs. ERC Starting and Consolidator grants are assessed in part on bibliometric evidence. The REF (UK) and ERA (Australia) frameworks affect institutional funding directly. This Academy teaches you to build the profile that passes any European institutional review.",
    keywords: ["EU Horizon Europe", "ERC grant", "REF assessment", "Web of Science"],
  },
  {
    region: "Africa & Global South",
    flag: "🌍",
    pain: "African research is underrepresented in global databases. You can change that — starting with your own profile.",
    stakes:
      "Researchers across Africa produce significant scholarly output that is systematically underrepresented in Scopus and Web of Science — partly due to journal indexing gaps, partly due to profile errors that could be fixed in an afternoon. This Academy was built with African researchers as a primary audience, not an afterthought.",
    keywords: ["AfricArXiv", "African journals", "global discovery", "Scopus indexing"],
  },
];

const PAIN_POINTS = [
  {
    icon: "📄",
    headline: "You published. Nobody found you.",
    body: "Publishing and being discovered are two completely separate steps. Most researchers only take the first one. The systems that decide whether your work gets found — Scopus, Google Scholar, ORCID, Web of Science — require active management. Nobody teaches you this at PhD orientation.",
  },
  {
    icon: "📊",
    headline: "Your metrics are being used to judge you — and you can't read them.",
    body: "Your h-index, your citation count, your journal quartile — a promotion committee is looking at these right now. If you don't know how they're calculated, why they differ across platforms, or what score you actually need for your next milestone, you're being assessed by a system you don't understand.",
  },
  {
    icon: "🌐",
    headline: "The researchers getting cited are not necessarily the best. They're the most visible.",
    body: "Bibliometric research consistently shows that citation count correlates weakly with research quality. What it correlates strongly with is discoverability — titles, keywords, profile completeness, open access status. This is learnable. Every researcher in this Academy learns it.",
  },
];

// ── Page ───────────────────────────────────────────────────────────────────

export default function AcademyPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080E1A" }}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(37,99,235,0.12), transparent)",
          }}
        />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <span
                className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border"
                style={{ backgroundColor: "rgba(37,99,235,0.1)", borderColor: "rgba(37,99,235,0.3)", color: "#60A5FA" }}
              >
                Researchvy Academy
              </span>
              <span
                className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border"
                style={{ backgroundColor: "rgba(16,185,129,0.1)", borderColor: "rgba(16,185,129,0.3)", color: "#10B981" }}
              >
                Level 1 Live Now
              </span>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB", letterSpacing: "-0.02em" }}
            >
              You Were Taught to{" "}
              <span style={{ color: "#60A5FA" }}>Publish.</span>
              <br />
              Nobody Taught You to Be{" "}
              <span style={{ color: "#A78BFA" }}>Found.</span>
            </h1>

            <p className="text-lg sm:text-xl leading-relaxed mb-4" style={{ color: "#94A3B8" }}>
              Researchvy Academy is the only professional development platform built specifically
              for researchers who want their work to be discovered, cited, funded, and recognised —
              on every platform that matters.
            </p>
            <p className="text-base leading-relaxed mb-10" style={{ color: "#6B7280" }}>
              Five structured levels. Self-paced. Built for researchers in Nigeria, Africa,
              the USA, Europe, and beyond. Start free — no payment, no commitment.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/academy/courses/research-identity"
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#2563EB" }}
              >
                <PlayCircle className="h-4 w-4" />
                Start Free — Level 1
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/academy/courses"
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold border transition-colors hover:bg-[#1E293B]"
                style={{ borderColor: "#1E293B", color: "#9CA3AF" }}
              >
                <GraduationCap className="h-4 w-4" />
                Browse All Courses
              </Link>
            </div>

            {/* Trust line */}
            <p className="mt-6 text-xs" style={{ color: "#374151" }}>
              Free preview lessons available on every module. No credit card required.
            </p>
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM ────────────────────────────────────────────────────── */}
      <section className="border-t" style={{ borderColor: "#0F172A" }}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3 text-center" style={{ color: "#4B5563" }}>
            The Gap Nobody Talks About
          </p>
          <h2
            className="text-2xl sm:text-3xl font-bold mb-4 text-center"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
          >
            The System Is Running Your Career.<br />Most Researchers Don&apos;t Know How.
          </h2>
          <p className="text-sm text-center mb-14 max-w-2xl mx-auto" style={{ color: "#6B7280" }}>
            Three truths about academic careers that your institution never told you — and that this Academy exists to fix.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PAIN_POINTS.map((p) => (
              <div
                key={p.headline}
                className="rounded-2xl border p-6"
                style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
              >
                <span className="text-3xl mb-4 block">{p.icon}</span>
                <h3 className="text-sm font-bold mb-3 leading-snug" style={{ color: "#F9FAFB" }}>
                  {p.headline}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEVEL 1 SPOTLIGHT ──────────────────────────────────────────────── */}
      <section className="border-t" style={{ borderColor: "#0F172A", backgroundColor: "rgba(37,99,235,0.03)" }}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full"
              style={{ backgroundColor: "rgba(16,185,129,0.15)", color: "#10B981", border: "1px solid rgba(16,185,129,0.3)" }}
            >
              Live Now
            </span>
            <span
              className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full"
              style={{ backgroundColor: "rgba(37,99,235,0.12)", color: "#60A5FA", border: "1px solid rgba(37,99,235,0.25)" }}
            >
              Level 1 · Start Here
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2
                className="text-3xl sm:text-4xl font-bold mb-4 leading-tight"
                style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB", letterSpacing: "-0.02em" }}
              >
                Research Identity:<br />
                <span style={{ color: "#60A5FA" }}>Be Found Where It Counts</span>
              </h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: "#6B7280" }}>
                Seven modules. 36 lessons. Everything you need to build a verified, cross-platform
                scholarly identity that the systems running your career can find — and act on.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { value: "7", label: "Modules" },
                  { value: "36", label: "Lessons" },
                  { value: "Free", label: "Previews" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border p-4 text-center"
                    style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
                  >
                    <p className="text-2xl font-bold mb-0.5" style={{ color: "#60A5FA" }}>{s.value}</p>
                    <p className="text-xs" style={{ color: "#4B5563" }}>{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/academy/courses/research-identity"
                  className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#2563EB" }}
                >
                  <PlayCircle className="h-4 w-4" />
                  Preview First Lesson Free
                </Link>
                <a
                  href={buildWhatsAppUrl("Researchvy Academy — Level 1 enrolment")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold border transition-colors hover:bg-[#1E293B]"
                  style={{ borderColor: "#25D366", color: "#25D366" }}
                >
                  <MessageCircle className="h-4 w-4" />
                  Enrol via WhatsApp
                </a>
              </div>
            </div>

            {/* Module list */}
            <div className="space-y-2">
              {[
                { pos: 1, title: "Why You're Invisible — And What the System Isn't Telling You", lessons: 4 },
                { pos: 2, title: "Scopus Decoded — The Platform That Decides Promotions & Grants", lessons: 6 },
                { pos: 3, title: "Google Scholar Mastery — Fix the Errors Costing You Citations", lessons: 5 },
                { pos: 4, title: "ORCID — The 30-Minute Setup That Connects Everything, Forever", lessons: 5 },
                { pos: 5, title: "How Citations Actually Work — and Why You Deserve More", lessons: 5 },
                { pos: 6, title: "The h-Index Explained — What That Number Means for Your Career", lessons: 6 },
                { pos: 7, title: "How Journals and Databases Find — or Lose — Your Research", lessons: 5 },
              ].map((m) => (
                <div
                  key={m.pos}
                  className="flex items-start gap-3 px-4 py-3 rounded-xl border"
                  style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: "rgba(96,165,250,0.15)", color: "#60A5FA" }}
                  >
                    {m.pos}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium leading-snug" style={{ color: "#D1D5DB" }}>
                      {m.title}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: "#4B5563" }}>
                      {m.lessons} lessons · Free
                    </p>
                  </div>
                  <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 mt-1" style={{ color: "#10B981" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5-LEVEL PATHWAY ────────────────────────────────────────────────── */}
      <section className="border-t" style={{ borderColor: "#0F172A" }}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3 text-center" style={{ color: "#4B5563" }}>
            The Complete Journey
          </p>
          <h2
            className="text-2xl sm:text-3xl font-bold mb-4 text-center"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
          >
            Five Levels. One Career Transformation.
          </h2>
          <p className="text-sm text-center mb-14 max-w-xl mx-auto" style={{ color: "#6B7280" }}>
            Each level builds on the last. You move from invisible to discoverable, from confused
            by metrics to strategic about them, from locally known to globally positioned.
          </p>

          <div className="space-y-4">
            {LEVELS.map((lvl) => {
              const color = LEVEL_COLORS[(lvl.level - 1) as 0 | 1 | 2 | 3 | 4];
              return (
                <div
                  key={lvl.level}
                  className="rounded-2xl border overflow-hidden"
                  style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
                >
                  <div className="flex items-start gap-5 p-6">
                    {/* Level badge */}
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold flex-shrink-0"
                      style={{ backgroundColor: `${color}18`, color }}
                    >
                      {lvl.level}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 flex-wrap mb-1">
                        <div>
                          <p className="text-[10px] font-bold tracking-widest uppercase mb-0.5" style={{ color }}>
                            Level {lvl.level} · {lvl.name}
                          </p>
                          <h3 className="text-base font-bold" style={{ color: "#F9FAFB" }}>
                            {lvl.tagline}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {lvl.available ? (
                            <span
                              className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full"
                              style={{ backgroundColor: "rgba(16,185,129,0.15)", color: "#10B981", border: "1px solid rgba(16,185,129,0.3)" }}
                            >
                              Live Now
                            </span>
                          ) : (
                            <span
                              className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full"
                              style={{ backgroundColor: "#1E293B", color: "#4B5563" }}
                            >
                              Coming 2026
                            </span>
                          )}
                          <span className="text-[10px]" style={{ color: "#374151" }}>
                            {lvl.lessonCount} lessons
                          </span>
                        </div>
                      </div>

                      <p className="text-xs leading-relaxed mb-4" style={{ color: "#6B7280" }}>
                        {lvl.description}
                      </p>

                      {/* Outcomes */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {lvl.outcomes.map((o) => (
                          <div key={o} className="flex items-start gap-2">
                            <ChevronRight className="h-3 w-3 flex-shrink-0 mt-0.5" style={{ color }} />
                            <span className="text-xs" style={{ color: "#9CA3AF" }}>{o}</span>
                          </div>
                        ))}
                      </div>

                      {lvl.available && lvl.slug && (
                        <div className="mt-5">
                          <Link
                            href={`/academy/courses/${lvl.slug}`}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold transition-opacity hover:opacity-80"
                            style={{ color }}
                          >
                            View course <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── GLOBAL AUDIENCE ────────────────────────────────────────────────── */}
      <section className="border-t" style={{ borderColor: "#0F172A", backgroundColor: "rgba(167,139,250,0.02)" }}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Globe className="h-4 w-4" style={{ color: "#A78BFA" }} />
            <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#4B5563" }}>
              Built for Researchers Everywhere
            </p>
          </div>
          <h2
            className="text-2xl sm:text-3xl font-bold mb-4 text-center"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
          >
            The Stakes Are Real — Wherever You Are
          </h2>
          <p className="text-sm text-center mb-14 max-w-xl mx-auto" style={{ color: "#6B7280" }}>
            The platforms that run academic careers are global. But the consequences of ignoring
            them are felt locally — in promotions denied, grants not awarded, and collaborations
            that never happened.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {AUDIENCES.map((a) => (
              <div
                key={a.region}
                className="rounded-2xl border p-6"
                style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{a.flag}</span>
                  <h3 className="text-sm font-bold" style={{ color: "#F9FAFB" }}>{a.region}</h3>
                </div>
                <p className="text-xs font-semibold mb-2 leading-snug" style={{ color: "#D1D5DB" }}>
                  &ldquo;{a.pain}&rdquo;
                </p>
                <p className="text-xs leading-relaxed mb-4" style={{ color: "#6B7280" }}>
                  {a.stakes}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {a.keywords.map((k) => (
                    <span
                      key={k}
                      className="text-[10px] px-2 py-0.5 rounded-md"
                      style={{ backgroundColor: "#1E293B", color: "#6B7280" }}
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY RESEARCHVY ─────────────────────────────────────────────────── */}
      <section className="border-t" style={{ borderColor: "#0F172A" }}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3 text-center" style={{ color: "#4B5563" }}>
            Why Researchvy Academy
          </p>
          <h2
            className="text-2xl sm:text-3xl font-bold mb-14 text-center"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
          >
            No Other Platform Teaches This
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: TrendingUp,
                title: "Built Around Your Career, Not Generic Learners",
                body: "Every lesson connects directly to a promotion panel, a grant application, a citation count, or a discoverability outcome. Nothing here is theoretical padding.",
                color: "#60A5FA",
              },
              {
                icon: Globe,
                title: "Africa and the Global South as the Primary Audience",
                body: "Most platforms treat Nigeria and Africa as afterthoughts. We built this for Nigerian and African researchers first — with TETFUND, NUC, and Scopus at the centre of every example.",
                color: "#A78BFA",
              },
              {
                icon: Award,
                title: "Certification That Links to Your Scholarly Identity",
                body: "Course completion certificates connect to your ORCID, appear on your LinkedIn profile, and are verifiable. This is not a participation certificate — it is a credential.",
                color: "#34D399",
              },
              {
                icon: Users,
                title: "Action-First, Not Lecture-First",
                body: "Every lesson ends with a specific, immediately doable action step. You leave each lesson having changed something in your actual scholarly profiles — not just having watched a video.",
                color: "#FCD34D",
              },
              {
                icon: BookOpen,
                title: "Aligned to Global Standards",
                body: "Lessons are structured around Bloom's Taxonomy outcomes, CPD-standard objectives, and professional certification frameworks. This is not informal learning — it is professional development.",
                color: "#F472B6",
              },
              {
                icon: Zap,
                title: "Level 1 Is Fully Free",
                body: "Every lesson in Level 1 (36 lessons across 7 modules) is 100% free — no login required to sample, no payment, no form. Start immediately and experience the full quality before committing to Levels 2–5.",
                color: "#60A5FA",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border p-6"
                style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${f.color}15` }}
                >
                  <f.icon className="h-5 w-5" style={{ color: f.color }} />
                </div>
                <h3 className="text-sm font-bold mb-2 leading-snug" style={{ color: "#F9FAFB" }}>
                  {f.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPANION: CLINICS ─────────────────────────────────────────────── */}
      <section className="border-t" style={{ borderColor: "#0F172A", backgroundColor: "rgba(37,99,235,0.02)" }}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="rounded-2xl border p-8 flex flex-col sm:flex-row items-start gap-6"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B", borderLeft: "4px solid #2563EB" }}>
            <div className="flex-1">
              <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>
                Companion Product · Optional
              </p>
              <h3 className="text-lg font-bold mb-2" style={{ color: "#F9FAFB" }}>
                Want Live Sessions Alongside the Self-Paced Course?
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                The <strong style={{ color: "#F9FAFB" }}>Digital Visibility Clinic (DVC)</strong> is a <em>separate, paid</em> live programme — not part of the Academy.
                Small cohorts, expert facilitator, live Q&A, personalised profile review.
                The two products work well together but are completely independent.
                <span style={{ display: "block", marginTop: "8px", color: "#4B5563", fontSize: "12px" }}>
                  Academy = self-paced, Level 1 free · DVC = paid, live, cohort-based
                </span>
              </p>
            </div>
            <Link
              href="/clinics/digital-visibility-clinic"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold flex-shrink-0 transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#2563EB", color: "#fff" }}
            >
              View Clinic <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="border-t" style={{ borderColor: "#0F172A" }}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24 text-center">
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#4B5563" }}>
            Your Next Step
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-5 leading-tight"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB", letterSpacing: "-0.02em" }}
          >
            The Researchers Getting Found<br />
            Started Exactly Here.
          </h2>
          <p className="text-base leading-relaxed mb-10" style={{ color: "#6B7280" }}>
            Level 1 is live. The first lesson of every module is free.
            You can begin right now — no payment, no registration, no commitment.
            Spend 15 minutes on the first lesson and decide whether this changes how you think
            about your research career. We are confident it will.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/academy/courses/research-identity"
              className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#2563EB" }}
            >
              <PlayCircle className="h-5 w-5" />
              Start Free — Level 1
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href={buildWhatsAppUrl("Researchvy Academy — I want to enrol")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-semibold border transition-colors hover:bg-[#1E293B]"
              style={{ borderColor: "#25D366", color: "#25D366" }}
            >
              <MessageCircle className="h-5 w-5" />
              Enrol via WhatsApp
            </a>
          </div>

          <p className="mt-6 text-xs" style={{ color: "#374151" }}>
            Questions? WhatsApp us — we respond within 24 hours, usually much sooner.
          </p>
        </div>
      </section>

    </div>
  );
}
