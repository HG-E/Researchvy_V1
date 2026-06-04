import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, Globe, TrendingUp, ExternalLink, BookOpen, CheckCircle } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { organizationSchema, breadcrumbSchema } from "@/lib/seo/schemas";
import { siteConfig } from "@/config/site";
import { FrameworkCarousel } from "@/components/about/FrameworkCarousel";
import { DivisionsCarousel } from "@/components/about/DivisionsCarousel";
import { FACILITATORS, PARTNER_INSTITUTIONS } from "@/constants/facilitators";

export const metadata = generatePageMetadata({
  title: "About Researchvy",
  description:
    "Learn about Researchvy, our mission to transform scholarly visibility, our framework, and our commitment to research impact.",
  path: "/about",
});

const VALUES = [
  {
    title:       "Scholarly Integrity",
    description: "We uphold the highest standards of academic rigour in everything we produce and teach.",
    icon:        Shield,
    color:       "#2563EB",
  },
  {
    title:       "Equity in Visibility",
    description: "We believe every researcher, regardless of geography or institution, deserves global discoverability.",
    icon:        Globe,
    color:       "#10B981",
  },
  {
    title:       "Impact Over Output",
    description: "We measure success not by publication counts but by real-world application and societal change.",
    icon:        TrendingUp,
    color:       "#A78BFA",
  },
];

const HERO_STATS = [
  "5 Divisions",
  "7-Step Framework",
  "38+ Countries",
  "Research → Impact",
];

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: "#0F172A", color: "#F9FAFB" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
          { name: "Home",  url: siteConfig.url },
          { name: "About", url: `${siteConfig.url}/about` },
        ])) }}
      />

      {/* ── Hero ────────────────────────────────────────────── */}
      <section
        className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-center overflow-hidden"
        style={{ backgroundColor: "#080E1A" }}
      >
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 55% at 50% -5%, rgba(37,99,235,0.20) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        {/* Secondary green accent — top right */}
        <div
          className="absolute top-0 right-0 w-72 h-72 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 100% 0%, rgba(16,185,129,0.08) 0%, transparent 60%)",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-4xl">
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#2563EB" }}>
            Our Mission
          </p>
          <h1
            className="text-4xl sm:text-6xl font-bold mb-5 leading-tight"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB", letterSpacing: "-0.02em" }}
          >
            Built for Researchers<br />
            <span style={{ color: "#2563EB" }}>Who Refuse to Stay Invisible.</span>
          </h1>
          <p className="text-base sm:text-lg max-w-3xl mx-auto leading-relaxed" style={{ color: "#9CA3AF" }}>
            Researchvy exists because great research deserves to be found, not buried in
            platforms nobody searches, cited by no one, reaching no one. We are the system
            that changes that.
          </p>

          {/* Micro-stat badges */}
          <div className="flex flex-wrap gap-2 justify-center mt-7">
            {HERO_STATS.map((label) => (
              <span
                key={label}
                className="text-xs font-medium px-3 py-1.5 rounded-full border"
                style={{
                  backgroundColor: "rgba(37,99,235,0.08)",
                  borderColor:     "rgba(37,99,235,0.22)",
                  color:           "#93C5FD",
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission + Framework ─────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* Left — Why We Exist */}
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
                Why We Exist
              </p>
              <h2
                className="text-3xl font-bold mb-6"
                style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
              >
                The Scholarly Visibility Crisis
              </h2>

              {/* Accent stripe on mobile; plain on desktop */}
              <div className="relative">
                <div
                  className="absolute left-0 top-0 bottom-0 w-0.5 lg:hidden"
                  style={{ backgroundColor: "rgba(37,99,235,0.35)" }}
                  aria-hidden="true"
                />
                <div className="pl-4 lg:pl-0 space-y-4 text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>
                  <p>
                    You spent years learning how to produce rigorous research. Nobody taught you how
                    to make it findable. That gap between what researchers produce and what the world
                    can discover is the problem Researchvy was built to close.
                  </p>
                  <p>
                    We are a scholarly visibility and research intelligence ecosystem. We work with
                    individual researchers, postgraduate scholars, and institutions to measure
                    visibility gaps, build the skills to close them, and communicate research in ways
                    that reach the people who need it most.
                  </p>
                  <p>
                    Your research has the potential to change something. But only if the right
                    people can find it, understand it, and act on it. That starts here.
                  </p>
                </div>
              </div>

              {/* Quick-link to deeper reading */}
              <Link
                href="/clinics"
                className="inline-flex items-center gap-1.5 mt-7 text-sm font-semibold transition-colors hover:text-[#93C5FD]"
                style={{ color: "#2563EB" }}
              >
                See how the clinic works <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Right — The Researchvy Framework */}
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#10B981" }}>
                What We Do
              </p>
              <h2
                className="text-3xl font-bold mb-6"
                style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
              >
                The Researchvy Framework
              </h2>
              <FrameworkCarousel />
            </div>

          </div>
        </div>
      </section>

      {/* ── Divisions ───────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#080E1A" }}>
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
              The Ecosystem
            </p>
            <h2
              className="text-4xl sm:text-5xl font-bold mb-4"
              style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
            >
              Five Specialised Divisions
            </h2>
            <p className="text-sm max-w-xl mx-auto leading-relaxed" style={{ color: "#6B7280" }}>
              Each division addresses a distinct dimension of scholarly visibility,
              from intelligence and training to storytelling, community, and real-world impact.
            </p>
          </div>
          <DivisionsCarousel />
        </div>
      </section>

      {/* ── Values ──────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
              Our Values
            </p>
            <h2
              className="text-4xl sm:text-5xl font-bold"
              style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
            >
              What We Stand For
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {VALUES.map(({ title, description, icon: Icon, color }) => (
              <div
                key={title}
                className="rounded-2xl p-6 border"
                style={{ backgroundColor: "#1E293B", borderColor: `${color}25` }}
              >
                {/* Colored icon container */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: `linear-gradient(135deg, ${color}28, ${color}0D)`,
                    border: `1px solid ${color}30`,
                  }}
                >
                  <Icon className="h-5 w-5" style={{ color }} />
                </div>
                <h3 className="font-bold text-base mb-2" style={{ color: "#F9FAFB" }}>
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section
        className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden"
        style={{ backgroundColor: "#080E1A" }}
      >
        {/* Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(124,58,237,0.10) 0%, rgba(37,99,235,0.08) 40%, transparent 80%)",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-2xl">
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#2563EB" }}>
            Ready to Begin?
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4 leading-tight"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
          >
            Your Research Deserves<br />
            <span style={{ color: "#10B981" }}>to Be Found.</span>
          </h2>
          <p className="text-base mb-8 leading-relaxed" style={{ color: "#9CA3AF" }}>
            Join a Researchvy Clinic and leave with a personal visibility strategy, verified
            certificate, and measurable results across our structured live sessions.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/clinics"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90 active:scale-[0.97]"
              style={{ backgroundColor: "#2563EB" }}
            >
              Join a Clinic <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/ecosystem"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold border transition-all duration-200 hover:border-[#2563EB] hover:text-white active:scale-[0.97]"
              style={{ borderColor: "#1E293B", color: "#9CA3AF" }}
            >
              Explore the Ecosystem
            </Link>
          </div>
        </div>
      </section>

      {/* ── Facilitator section ────────────────────────────────────────── */}
      {FACILITATORS.map((f) => (
        <section key={f.id} className="border-t" style={{ borderColor: "#1E293B" }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#2563EB" }}>
              Your Facilitator
            </p>
            <h2 className="text-2xl font-bold mb-10" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
              The person who works with you directly
            </h2>

            <div className="rounded-3xl border overflow-hidden" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
              <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#2563EB,#10B981)" }} />
              <div className="p-8 sm:p-10">
                <div className="flex flex-col sm:flex-row gap-8 items-start">

                  {/* Photo / initials */}
                  <div className="flex-shrink-0">
                    {f.photo ? (
                      <Image src={f.photo} alt={f.name} width={112} height={112} className="rounded-2xl object-cover w-28 h-28" />
                    ) : (
                      <div className="w-28 h-28 rounded-2xl flex items-center justify-center text-2xl font-bold" style={{ backgroundColor: "rgba(37,99,235,0.12)", color: "#60A5FA" }}>
                        {f.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold mb-1" style={{ color: "#F9FAFB" }}>{f.name}</h3>
                    <p className="text-sm mb-0.5" style={{ color: "#60A5FA" }}>{f.title}</p>
                    <p className="text-xs mb-4" style={{ color: "#4B5563" }}>{f.affiliation}</p>
                    <p className="text-sm leading-relaxed mb-5" style={{ color: "#9CA3AF" }}>{f.bio}</p>

                    {f.credentials.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#4B5563" }}>Credentials</p>
                        <ul className="space-y-1">
                          {f.credentials.map((c) => (
                            <li key={c} className="text-xs flex items-start gap-2" style={{ color: "#6B7280" }}>
                              <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" style={{ color: "#2563EB" }} />
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-4">
                      {f.specialisms.map((s) => (
                        <span key={s} className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(37,99,235,0.08)", color: "#93C5FD" }}>{s}</span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-4">
                      {f.linkedin      && <a href={f.linkedin}      target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: "#60A5FA" }}>LinkedIn <ExternalLink className="h-3 w-3" /></a>}
                      {f.orcid         && <a href={f.orcid}         target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: "#10B981" }}>ORCID <ExternalLink className="h-3 w-3" /></a>}
                      {f.googleScholar && <a href={f.googleScholar} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: "#A78BFA" }}>Google Scholar <ExternalLink className="h-3 w-3" /></a>}
                    </div>
                  </div>
                </div>

                {f.publications.length > 0 && (
                  <div className="mt-8 pt-6 border-t" style={{ borderColor: "#1E293B" }}>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: "#4B5563" }}>
                      <BookOpen className="h-3.5 w-3.5" /> Selected Publications
                    </p>
                    <ul className="space-y-2">
                      {f.publications.map((pub) => (
                        <li key={pub.title} className="text-xs" style={{ color: "#6B7280" }}>
                          <span style={{ color: "#D1D5DB" }}>{pub.title}</span> · {pub.journal}, {pub.year}
                          {pub.url && <a href={pub.url} target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex items-center gap-1" style={{ color: "#60A5FA" }}>View <ExternalLink className="h-2.5 w-2.5" /></a>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Track record */}
                <div className="mt-8 pt-6 border-t grid grid-cols-2 sm:grid-cols-2 gap-4" style={{ borderColor: "#1E293B" }}>
                  <div className="rounded-xl p-4 text-center" style={{ backgroundColor: "rgba(37,99,235,0.06)" }}>
                    <p className="text-2xl font-bold mb-1" style={{ color: "#F9FAFB" }}>{f.clinicsLed}</p>
                    <p className="text-xs" style={{ color: "#6B7280" }}>Cohorts facilitated</p>
                  </div>
                  <div className="rounded-xl p-4 text-center" style={{ backgroundColor: "rgba(16,185,129,0.06)" }}>
                    <p className="text-2xl font-bold mb-1" style={{ color: "#F9FAFB" }}>{f.researchersHelped}+</p>
                    <p className="text-xs" style={{ color: "#6B7280" }}>Researchers guided</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ── Partner institutions ───────────────────────────────────────── */}
      {PARTNER_INSTITUTIONS.length > 0 && (
        <section className="border-t" style={{ borderColor: "#1E293B" }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
            <p className="text-xs font-semibold tracking-widest uppercase mb-6 text-center" style={{ color: "#4B5563" }}>
              Previously Delivered In Partnership With
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {PARTNER_INSTITUTIONS.map(({ name }) => (
                <div key={name} className="rounded-xl border px-5 py-2.5 text-sm font-medium" style={{ borderColor: "#1E293B", color: "#6B7280" }}>
                  {name}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
