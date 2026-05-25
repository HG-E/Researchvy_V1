import Link from "next/link";
import { BarChart2, GraduationCap, FileImage, Stethoscope, Network, ArrowRight } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";

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

export default function EcosystemPage() {
  return (
    <div style={{ backgroundColor: "#0F172A", color: "#F9FAFB" }}>

      {/* ── Hero ──────────────────────────────────────────── */}
      <section
        className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 text-center overflow-hidden"
        style={{ backgroundColor: "#080E1A" }}
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
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB", letterSpacing: "-0.02em" }}
          >
            Every Dimension of Visibility.<br />
            <span style={{ color: "#2563EB" }}>One Ecosystem.</span>
          </h1>
          <p className="text-base sm:text-lg max-w-3xl mx-auto leading-relaxed" style={{ color: "#9CA3AF" }}>
            Most researchers address one piece of the visibility problem. Researchvy addresses
            all of it, five specialised divisions working together so nothing gets left behind.
          </p>

          {/* Division count badges */}
          <div className="flex flex-wrap gap-2 justify-center mt-8">
            {siteConfig.divisions.map((d) => {
              const accent = DIVISION_ACCENTS[d.id] ?? "#2563EB";
              return (
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
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Divisions — alternating layout ─────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-20 sm:space-y-28">
          {siteConfig.divisions.map((division, i) => {
            const accent = DIVISION_ACCENTS[division.id] ?? "#2563EB";
            const Icon   = DIVISION_ICONS[division.id] ?? BarChart2;
            return (
              <div
                key={division.id}
                className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
              >
                {/* Text — swap order for odd items on desktop */}
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <p
                    className="text-xs font-semibold tracking-widest uppercase mb-3"
                    style={{ color: accent }}
                  >
                    Division {i + 1} of {siteConfig.divisions.length}
                  </p>
                  <h2
                    className="text-3xl sm:text-4xl font-bold mb-3 leading-tight"
                    style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
                  >
                    {division.name}
                  </h2>
                  <p className="text-sm font-semibold mb-5" style={{ color: accent }}>
                    {division.tagline}
                  </p>
                  <p className="text-base leading-relaxed mb-8" style={{ color: "#9CA3AF" }}>
                    {division.description}
                  </p>
                  <Link
                    href={`/${division.slug}`}
                    className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 active:scale-[0.97]"
                    style={{ backgroundColor: accent }}
                  >
                    Explore {division.name}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                {/* Visual card */}
                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <div
                    className="relative rounded-2xl overflow-hidden border flex items-center justify-center"
                    style={{
                      minHeight: 260,
                      background: `linear-gradient(135deg, ${accent}18 0%, ${accent}06 100%)`,
                      borderColor: `${accent}30`,
                    }}
                  >
                    {/* Large watermark number */}
                    <span
                      className="absolute inset-0 flex items-end justify-end pr-5 pb-3 text-9xl font-black select-none pointer-events-none leading-none"
                      style={{ color: `${accent}10` }}
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    {/* Ghost background icon */}
                    <Icon
                      className="absolute"
                      style={{ width: 120, height: 120, color: `${accent}10` }}
                      aria-hidden={true}
                    />
                    {/* Main icon container */}
                    <div
                      className="relative z-10 flex flex-col items-center gap-4"
                    >
                      <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center border"
                        style={{
                          backgroundColor: `${accent}18`,
                          borderColor:     `${accent}40`,
                        }}
                      >
                        <Icon className="w-10 h-10" style={{ color: accent }} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold" style={{ color: "#F9FAFB" }}>
                          {division.name}
                        </p>
                        <p className="text-xs mt-0.5 font-medium" style={{ color: accent }}>
                          {division.tagline}
                        </p>
                      </div>
                    </div>
                    {/* Top-left corner accent */}
                    <div
                      className="absolute top-0 left-0 w-24 h-24 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at 0% 0%, ${accent}20 0%, transparent 70%)`,
                      }}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Framework reminder ─────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#080E1A" }}>
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#2563EB" }}>
            The Framework
          </p>
          <h2
            className="text-2xl sm:text-3xl font-bold mb-4"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
          >
            Every division serves the journey.
          </h2>
          {/* Scrollable chain — mobile friendly */}
          <div className="relative mt-6">
            <div
              className="absolute left-0 top-0 bottom-0 w-8 pointer-events-none z-10 sm:hidden"
              style={{ background: "linear-gradient(90deg, #080E1A, transparent)" }}
              aria-hidden="true"
            />
            <div
              className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none z-10 sm:hidden"
              style={{ background: "linear-gradient(270deg, #080E1A, transparent)" }}
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
                      backgroundColor: "#0F172A",
                      borderColor: i === siteConfig.framework.length - 1 ? "#10B981" : "#1E293B",
                      color:       i === siteConfig.framework.length - 1 ? "#10B981" : "#9CA3AF",
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
          <p className="text-sm mt-5" style={{ color: "#6B7280" }}>
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
              className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold border transition-all duration-200 hover:border-[#2563EB] hover:text-white active:scale-[0.97]"
              style={{ borderColor: "#1E293B", color: "#9CA3AF" }}
            >
              About Researchvy
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
