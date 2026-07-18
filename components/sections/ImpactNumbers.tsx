"use client";

import { motion } from "framer-motion";
import { TrendingUp, Quote, Users, Globe2, Download, Activity, Heart, Award } from "lucide-react";

const STATS = [
  {
    icon:   TrendingUp,
    value:  "87%",
    label:  "increase in research visibility",
    sub:    "through optimised profiles and content.",
    accent: "#2563EB",
    bg:     "rgba(37,99,235,0.07)",
  },
  {
    icon:   Quote,
    value:  "2.4×",
    label:  "more citations",
    sub:    "on average after improving visibility infrastructure.",
    accent: "#7C3AED",
    bg:     "rgba(124,58,237,0.07)",
  },
  {
    icon:   Users,
    value:  "70%",
    label:  "stronger collaboration opportunities",
    sub:    "by connecting with the right researchers.",
    accent: "#10B981",
    bg:     "rgba(16,185,129,0.07)",
  },
  {
    icon:   Award,
    value:  "65%",
    label:  "career advancement",
    sub:    "higher for researchers with strong digital presence.",
    accent: "#F59E0B",
    bg:     "rgba(245,158,11,0.07)",
  },
  {
    icon:   Download,
    value:  "3.1×",
    label:  "more full-text downloads",
    sub:    "when research is easy to discover and access.",
    accent: "#EF4444",
    bg:     "rgba(239,68,68,0.07)",
  },
  {
    icon:   Globe2,
    value:  "100+",
    label:  "countries reached",
    sub:    "by researchers using Researchvy solutions.",
    accent: "#06B6D4",
    bg:     "rgba(6,182,212,0.07)",
  },
  {
    icon:   Activity,
    value:  "95%",
    label:  "profile health improvement",
    sub:    "after applying our recommendations.",
    accent: "#6366F1",
    bg:     "rgba(99,102,241,0.07)",
  },
  {
    icon:   Heart,
    value:  "10K+",
    label:  "researchers empowered",
    sub:    "to share their knowledge and change the world.",
    accent: "#EC4899",
    bg:     "rgba(236,72,153,0.07)",
  },
];

export function ImpactNumbers() {
  return (
    <section
      className="py-14 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ backgroundColor: "#F8FAFC" }}
    >
      {/* Subtle background pattern */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(#0F172A 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4" style={{ color: "#9CA3AF" }}>
            The Researchvy Impact
          </p>
          <h2
            className="text-4xl sm:text-5xl font-bold mb-4 leading-tight"
            style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
          >
            What happens when
            <br />
            <span style={{ color: "#2563EB" }}>researchers get visible.</span>
          </h2>
          <p className="text-base max-w-xl mx-auto leading-relaxed" style={{ color: "#6B7280" }}>
            These aren&rsquo;t projections. They&rsquo;re the measurable shifts researchers experience
            after working inside the Researchvy ecosystem.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map(({ icon: Icon, value, label, sub, accent, bg }, i) => (
            <motion.div
              key={value + label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="rounded-2xl border p-5 sm:p-6 flex flex-col gap-3"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" }}
            >
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: bg }}
              >
                <Icon className="h-5 w-5" style={{ color: accent }} />
              </div>

              {/* Value */}
              <p
                className="text-3xl sm:text-4xl font-bold tabular-nums leading-none"
                style={{ fontFamily: "var(--font-serif)", color: accent }}
              >
                {value}
              </p>

              {/* Label + sub */}
              <div>
                <p className="text-sm font-semibold leading-snug mb-0.5" style={{ color: "#111827" }}>
                  {label}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "#9CA3AF" }}>
                  {sub}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center text-xs mt-10"
          style={{ color: "#9CA3AF" }}
        >
          Based on aggregate outcomes from researchers across the Researchvy programme cohorts.
        </motion.p>

      </div>
    </section>
  );
}
