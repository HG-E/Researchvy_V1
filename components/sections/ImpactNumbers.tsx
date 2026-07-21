"use client";

import { motion } from "framer-motion";
import {
  FlaskConical, Eye, Globe2, Users, Heart, GraduationCap,
  Stethoscope, Landmark, BookOpen, ArrowRight,
} from "lucide-react";
import Link from "next/link";

// ── Journey steps: Research → Visibility → Lives Changed ──────────────────
const JOURNEY = [
  {
    icon: FlaskConical,
    step: "01",
    label: "Research Happens",
    desc:  "You dedicate years to your field. You publish. You contribute knowledge the world needs.",
    color: "#2563EB",
    bg:    "rgba(37,99,235,0.08)",
  },
  {
    icon: Eye,
    step: "02",
    label: "Research Gets Visible",
    desc:  "With the right visibility strategy, your work is found by the people who need it.",
    color: "#7C3AED",
    bg:    "rgba(124,58,237,0.08)",
  },
  {
    icon: Globe2,
    step: "03",
    label: "Research Crosses Borders",
    desc:  "Colleagues in 100+ countries discover, cite, and build on your findings.",
    color: "#10B981",
    bg:    "rgba(16,185,129,0.08)",
  },
  {
    icon: Heart,
    step: "04",
    label: "Research Changes Lives",
    desc:  "Doctors apply your findings. Policymakers act on your data. Communities benefit.",
    color: "#EF4444",
    bg:    "rgba(239,68,68,0.08)",
  },
];

// ── Who benefits when research becomes visible ─────────────────────────────
const BENEFICIARIES = [
  {
    icon:  Stethoscope,
    title: "Clinicians & Doctors",
    desc:  "A physician in Brazil finds your study on drug resistance. Their patients get better treatment.",
    color: "#EF4444",
    bg:    "rgba(239,68,68,0.07)",
  },
  {
    icon:  Landmark,
    title: "Policymakers",
    desc:  "A government agency cites your environmental study. National policy is shaped by your data.",
    color: "#F59E0B",
    bg:    "rgba(245,158,11,0.07)",
  },
  {
    icon:  GraduationCap,
    title: "Students & Academics",
    desc:  "PhD candidates worldwide build on your foundation. You become the citation that drives the next breakthrough.",
    color: "#2563EB",
    bg:    "rgba(37,99,235,0.07)",
  },
  {
    icon:  Users,
    title: "Communities",
    desc:  "NGOs and development organisations implement your recommendations. Real people feel the change.",
    color: "#10B981",
    bg:    "rgba(16,185,129,0.07)",
  },
  {
    icon:  BookOpen,
    title: "Future Researchers",
    desc:  "Inspired by your visibility, junior researchers see that impact is possible — and follow the same path.",
    color: "#6366F1",
    bg:    "rgba(99,102,241,0.07)",
  },
];

// ── Headline stats ─────────────────────────────────────────────────────────
const STATS = [
  { value: "87%",  label: "Visibility increase",        accent: "#2563EB" },
  { value: "2.4×", label: "More citations",              accent: "#7C3AED" },
  { value: "70%",  label: "Stronger collaborations",    accent: "#10B981" },
  { value: "100+", label: "Countries reached",           accent: "#06B6D4" },
  { value: "3.1×", label: "More full-text downloads",   accent: "#EF4444" },
  { value: "65%",  label: "Higher career advancement",  accent: "#F59E0B" },
  { value: "95%",  label: "Profile health improvement", accent: "#6366F1" },
  { value: "10K+", label: "Researchers empowered",      accent: "#EC4899" },
];

export function ImpactNumbers() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: "#F8FAFC" }}
    >
      {/* Dot grid */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(#0F172A 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">

        {/* ── Section header ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4" style={{ color: "#9CA3AF" }}>
            From Research to Real-World Impact
          </p>
          <h2
            className="text-4xl sm:text-5xl font-bold mb-5 leading-tight"
            style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
          >
            Your research is meant to
            <br />
            <span style={{ color: "#2563EB" }}>change lives.</span>
          </h2>
          <p className="text-base max-w-2xl mx-auto leading-relaxed" style={{ color: "#4B5563" }}>
            The gap between a published paper and real-world impact is <strong style={{ color: "#374151" }}>visibility</strong>.
            When your research is found, it doesn&rsquo;t just advance your career — it reaches the people whose lives depend on it.
          </p>
        </motion.div>

        {/* ── Journey: 4-step chain ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {JOURNEY.map(({ icon: Icon, step, label, desc, color, bg }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="relative rounded-2xl border p-6 flex flex-col gap-4"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" }}
            >
              {/* Step number */}
              <span
                className="text-[10px] font-black tracking-widest absolute top-4 right-4"
                style={{ color: `${color}60` }}
              >
                {step}
              </span>

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: bg }}
              >
                <Icon className="h-6 w-6" style={{ color }} />
              </div>

              <div>
                <p className="text-sm font-bold mb-1.5" style={{ color: "#111827" }}>{label}</p>
                <p className="text-xs leading-relaxed" style={{ color: "#4B5563" }}>{desc}</p>
              </div>

              {/* Connector arrow — shown on desktop between steps */}
              {i < JOURNEY.length - 1 && (
                <ArrowRight
                  className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 h-5 w-5 z-10"
                  style={{ color: "#D1D5DB" }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* ── Dark banner: "Who benefits" intro ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl px-8 py-7 mb-6 text-center"
          style={{ backgroundColor: "#0F172A" }}
        >
          <p className="text-lg sm:text-xl font-bold mb-1" style={{ color: "#F9FAFB", fontFamily: "var(--font-serif)" }}>
            Invisible research can&rsquo;t save lives.{" "}
            <span style={{ color: "#FCD34D" }}>Visible research can.</span>
          </p>
          <p className="text-sm" style={{ color: "#4B5563" }}>
            Here&rsquo;s who benefits when your work breaks out of the journal and into the world.
          </p>
        </motion.div>

        {/* ── Beneficiary cards ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-16">
          {BENEFICIARIES.map(({ icon: Icon, title, desc, color, bg }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl border p-5 flex flex-col gap-3"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: bg }}
              >
                <Icon className="h-5 w-5" style={{ color }} />
              </div>
              <p className="text-sm font-bold leading-snug" style={{ color: "#111827" }}>{title}</p>
              <p className="text-xs leading-relaxed" style={{ color: "#4B5563" }}>{desc}</p>
              <div className="w-8 h-0.5 rounded-full mt-auto" style={{ backgroundColor: color }} />
            </motion.div>
          ))}
        </div>

        {/* ── Impact stats grid ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-8"
        >
          <p className="text-center text-xs font-bold tracking-widest uppercase mb-6" style={{ color: "#9CA3AF" }}>
            The Researchvy Impact — by the numbers
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STATS.map(({ value, label, accent }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="rounded-2xl border p-5 text-center"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" }}
              >
                <p
                  className="text-3xl font-bold tabular-nums mb-1"
                  style={{ fontFamily: "var(--font-serif)", color: accent }}
                >
                  {value}
                </p>
                <p className="text-xs leading-snug" style={{ color: "#4B5563" }}>{label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── CTA nudge ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm mb-4" style={{ color: "#4B5563" }}>
            Your research can reach the people who need it.{" "}
            <span className="font-semibold" style={{ color: "#111827" }}>Start with visibility.</span>
          </p>
          <Link
            href="/resources/visibility-scorecard"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white"
            style={{ backgroundColor: "#2563EB", transition: "background-color 140ms" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1D4ED8")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
          >
            Take the FREE Visibility Scorecard
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-[10px] mt-3" style={{ color: "#9CA3AF" }}>
            Based on aggregate outcomes from researchers across Researchvy programme cohorts.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
