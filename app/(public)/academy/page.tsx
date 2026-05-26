import Link from "next/link";
import { ArrowRight, GraduationCap, MessageCircle, CalendarDays, Users, Zap } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { learningPathways } from "@/constants/programs";
import { buildWhatsAppUrl } from "@/config/site";
import { HoverCard } from "@/components/ui/HoverCard";
import { EarlyBirdCountdown } from "@/components/clinics/EarlyBirdCountdown";

export const metadata = generatePageMetadata({
  title: "Researchvy Academy",
  description: "Five-level professional development pathways covering every dimension of scholarly visibility, from foundational concepts to advanced research intelligence.",
  path: "/academy",
});

const LEVEL_COLORS = ["#60A5FA", "#A78BFA", "#34D399", "#FCD34D", "#F472B6"];

export default function AcademyPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080E1A" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Header */}
        <div className="max-w-3xl mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
            Researchvy Academy
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold mb-5 leading-tight"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB", letterSpacing: "-0.02em" }}
          >
            The Skills Nobody<br />
            <span style={{ color: "#A78BFA" }}>Taught You.</span>
          </h1>
          <p className="text-lg leading-relaxed mb-8" style={{ color: "#6B7280" }}>
            You were taught to publish. Nobody taught you to be found. Researchvy Academy fills
            that gap, five structured levels that take you from foundational visibility principles
            to advanced research intelligence strategy.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/clinics"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8]"
              style={{ backgroundColor: "#2563EB" }}
            >
              <GraduationCap className="h-4 w-4" />
              Start with a Clinic
            </Link>
            <a
              href={buildWhatsAppUrl("Researchvy Academy programmes")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold border transition-colors hover:bg-[#1E293B]"
              style={{ borderColor: "#1E293B", color: "#9CA3AF" }}
            >
              <MessageCircle className="h-4 w-4" />
              I Have a Question
            </a>
          </div>
        </div>

        {/* Level pathway */}
        <div className="mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: "#4B5563" }}>
            5-Level Learning Pathway
          </p>
          <div className="space-y-4">
            {learningPathways.map((pathway, idx) => {
              const color = LEVEL_COLORS[idx];
              return (
                <HoverCard
                  key={pathway.level}
                  accentColor={color}
                  className="overflow-hidden"
                >
                  <div className="flex items-start gap-5 p-6">
                    {/* Level badge */}
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-lg font-bold"
                      style={{ backgroundColor: `${color}18`, color }}
                    >
                      {pathway.level}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color }}>
                            Level {pathway.level}
                          </p>
                          <h2 className="text-base font-bold" style={{ color: "#F9FAFB" }}>
                            {pathway.title}
                          </h2>
                          <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>
                            {pathway.description}
                          </p>
                        </div>
                        <span
                          className="rounded-full px-2.5 py-1 text-xs font-medium shrink-0"
                          style={{ backgroundColor: "#1E293B", color: "#6B7280" }}
                        >
                          {pathway.programs.length} programmes
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {pathway.programs.map((prog) => (
                          <span
                            key={prog}
                            className="rounded-lg px-2.5 py-1 text-xs"
                            style={{ backgroundColor: "#1E293B", color: "#9CA3AF" }}
                          >
                            {prog}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </HoverCard>
              );
            })}
          </div>
        </div>

        {/* Level 1 CTA + Levels 2-5 notice */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Level 1 — Digital Visibility Clinic (active, enrol now) */}
          <div
            className="rounded-2xl border p-8 relative overflow-hidden"
            style={{ backgroundColor: "rgba(37,99,235,0.05)", borderColor: "rgba(37,99,235,0.25)" }}
          >
            {/* "Open now" badge */}
            <span
              className="absolute top-5 right-5 rounded-full px-2.5 py-1 text-xs font-bold"
              style={{ backgroundColor: "rgba(16,185,129,0.15)", color: "#10B981" }}
            >
              Open Now
            </span>

            <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>
              Level 1 · Start Here
            </p>
            <h3
              className="text-2xl font-bold mb-1"
              style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
            >
              Digital Visibility Clinic
            </h3>
            <p className="text-sm mb-5" style={{ color: "#6B7280" }}>
              Your Academy journey begins here. Four live sessions that transform how your
              research is found, cited, and recognised — built around your actual Scopus profile.
            </p>

            {/* Key details */}
            <div className="space-y-2 mb-5">
              <div className="flex items-center gap-2 text-sm" style={{ color: "#9CA3AF" }}>
                <CalendarDays className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#60A5FA" }} />
                July 2026 · Wednesday or Sunday track
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: "#9CA3AF" }}>
                <Users className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#60A5FA" }} />
                Max 20 researchers · 8 spots already filled
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: "#9CA3AF" }}>
                <Zap className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#FCD34D" }} />
                Early bird from <span className="font-semibold" style={{ color: "#F9FAFB" }}>₦38,000</span> — closes 20 June
              </div>
            </div>

            {/* Countdown */}
            <div className="flex items-center gap-2 rounded-xl px-4 py-2.5 mb-5 border text-sm" style={{ backgroundColor: "rgba(15,23,42,0.6)", borderColor: "#1E293B" }}>
              <span style={{ color: "#6B7280" }}>Early bird closes in:</span>
              <EarlyBirdCountdown deadline="2026-06-20" />
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/clinics/digital-visibility-clinic"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-[#1D4ED8]"
                style={{ backgroundColor: "#2563EB", color: "#F9FAFB" }}
              >
                Secure My Spot <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={buildWhatsAppUrl("Digital Visibility Clinic — Level 1 Academy")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold border transition-colors hover:bg-[#1E293B]"
                style={{ borderColor: "#334155", color: "#9CA3AF" }}
              >
                <MessageCircle className="h-4 w-4" />
                Ask a Question
              </a>
            </div>
          </div>

          {/* Levels 2–5 — coming, clinic alumni get priority */}
          <div
            className="rounded-2xl border p-8"
            style={{ backgroundColor: "rgba(167,139,250,0.04)", borderColor: "rgba(167,139,250,0.15)" }}
          >
            <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#A78BFA" }}>
              Levels 2–5 · Coming 2026
            </p>
            <h3
              className="text-2xl font-bold mb-3"
              style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
            >
              The Full Academy Path
            </h3>
            <p className="text-sm leading-relaxed mb-5" style={{ color: "#6B7280" }}>
              Levels 2–5 cover Research Intelligence, Publication Strategy, Institutional
              Positioning, and Advanced Research Leadership. Cohorts launch progressively
              from late 2026.
            </p>

            {/* Priority access note */}
            <div
              className="rounded-xl border-l-4 px-4 py-3 mb-5 text-sm"
              style={{ borderLeftColor: "#A78BFA", backgroundColor: "rgba(167,139,250,0.07)", color: "#C4B5FD" }}
            >
              <strong>Level 1 alumni get first access.</strong> Researchers who complete the
              Digital Visibility Clinic are offered priority enrolment in Level 2 before
              public registration opens.
            </div>

            <a
              href={buildWhatsAppUrl("Researchvy Academy Levels 2-5 interest")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-[#6D28D9]"
              style={{ backgroundColor: "#7C3AED", color: "#F9FAFB" }}
            >
              <MessageCircle className="h-4 w-4" />
              Register Interest
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
