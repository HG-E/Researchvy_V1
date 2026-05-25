import Link from "next/link";
import { ArrowRight, GraduationCap, MessageCircle } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { learningPathways } from "@/constants/programs";
import { buildWhatsAppUrl } from "@/config/site";
import { HoverCard } from "@/components/ui/HoverCard";

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
            that gap — five structured levels that take you from foundational visibility principles
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

        {/* Coming soon notice + CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            className="rounded-2xl border p-8"
            style={{ backgroundColor: "rgba(167,139,250,0.05)", borderColor: "rgba(167,139,250,0.2)" }}
          >
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#A78BFA" }}>
              Programmes
            </p>
            <h3
              className="text-2xl font-bold mb-3"
              style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
            >
              Enrolling Soon
            </h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#6B7280" }}>
              Cohorts are small and deliberately limited. Early access goes to researchers
              who register interest first — before public enrolment opens. Don&apos;t wait
              until there are no spots.
            </p>
            <a
              href={buildWhatsAppUrl("Researchvy Academy waitlist")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#6D28D9]"
              style={{ backgroundColor: "#7C3AED" }}
            >
              <MessageCircle className="h-4 w-4" />
              Get Early Access
            </a>
          </div>

          <div
            className="rounded-2xl border p-8"
            style={{ backgroundColor: "rgba(37,99,235,0.04)", borderColor: "rgba(37,99,235,0.2)" }}
          >
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#2563EB" }}>
              Start Now
            </p>
            <h3
              className="text-2xl font-bold mb-3"
              style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
            >
              Begin with a Clinic
            </h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#6B7280" }}>
              The Digital Visibility Clinic is our flagship live programme — the fastest way to
              develop practical scholarly visibility skills right now.
            </p>
            <Link
              href="/clinics/digital-visibility-clinic"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-[#1D4ED8]"
              style={{ backgroundColor: "#2563EB", color: "#F9FAFB" }}
            >
              View the Clinic <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
