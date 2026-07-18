"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BarChart2, GraduationCap, FileImage, Stethoscope, Network, ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { MobileCarousel } from "@/components/ui/MobileCarousel";

const ICONS = { BarChart2, GraduationCap, FileImage, Stethoscope, Network } as const;

const DIVISION_ACCENTS: Record<string, string> = {
  intelligence: "#2563EB",
  academy:      "#7C3AED",
  media:        "#D97706",
  clinics:      "#10B981",
  network:      "#EC4899",
};

const cardVariants = {
  hidden:  { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

function DivisionCard({ division }: { division: (typeof siteConfig.divisions)[number] }) {
  const Icon   = ICONS[division.icon as keyof typeof ICONS];
  const accent = DIVISION_ACCENTS[division.id] ?? "#2563EB";

  return (
    <div
      className="rounded-2xl p-6 border h-full flex flex-col"
      style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ background: `linear-gradient(135deg, ${accent}20 0%, ${accent}08 100%)` }}
      >
        {Icon && <Icon className="h-6 w-6" style={{ color: accent }} />}
      </div>

      <h3 className="text-lg font-bold mb-1" style={{ color: "#111827" }}>
        {division.name}
      </h3>
      <p className="text-xs font-medium mb-3" style={{ color: accent }}>
        {division.tagline}
      </p>
      <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: "#6B7280" }}>
        {division.description}
      </p>
      <Link
        href={`/${division.slug}`}
        className="inline-flex items-center gap-1 text-sm font-semibold active:opacity-70"
        style={{ color: accent, transition: "opacity 100ms ease" }}
      >
        Explore <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

export function EcosystemOverview() {
  return (
    <section className="py-14 sm:py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#F8FAFC" }}>
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
            The Ecosystem
          </p>
          <h2
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
          >
            Five Divisions. One Mission.
          </h2>
          <p className="text-base max-w-2xl mx-auto" style={{ color: "#6B7280" }}>
            From intelligence and analytics to community and clinics, every dimension of scholarly
            visibility is covered.
          </p>
        </motion.div>

        {/* Desktop: 3-column grid */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-6">
          {siteConfig.divisions.map((division, i) => {
            const accent = DIVISION_ACCENTS[division.id] ?? "#2563EB";
            return (
              <motion.div
                key={division.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group rounded-2xl border transition-all duration-300"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = accent;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#E2E8F0";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <DivisionCard division={division} />
              </motion.div>
            );
          })}
        </div>

        {/* Mobile: auto-advancing swipe carousel */}
        <MobileCarousel
          className="sm:hidden"
          autoPlay
          autoPlayDelay={3800}
          items={siteConfig.divisions.map((division) => (
            <div key={division.id} className="px-0.5">
              <DivisionCard division={division} />
            </div>
          ))}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-10 sm:mt-12"
        >
          <Link
            href="/ecosystem"
            className="inline-flex items-center gap-2 text-sm font-semibold rounded-lg px-6 py-3 border active:opacity-70"
            style={{
              color: "#374151",
              borderColor: "#E2E8F0",
              transition: "border-color 150ms ease, color 150ms ease, opacity 100ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#2563EB";
              e.currentTarget.style.color = "#2563EB";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#E2E8F0";
              e.currentTarget.style.color = "#374151";
            }}
          >
            View the Full Ecosystem <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
