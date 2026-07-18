"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MessageCircle, CheckCircle2 } from "lucide-react";
import { trackCtaClick } from "@/lib/analytics/posthog";
import { buildWhatsAppUrl } from "@/config/site";

const ROTATE_INTERVAL = 2600;
const ROTATING_WORDS = ["seen.", "cited.", "discovered.", "impactful."];

const TRUST_POINTS = [
  "38+ countries",
  "Certified on completion",
  "Live cohort · ≤20 researchers",
  "No fluff — measurable results",
];

export function Hero() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setWordIndex((i) => (i + 1) % ROTATING_WORDS.length);
    }, ROTATE_INTERVAL);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: "#FAFBFF" }}
    >
      {/* Warm gradient top band */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(37,99,235,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Decorative dots */}
      <div
        aria-hidden
        className="absolute top-0 right-0 w-72 h-72 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#2563EB 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-20 pb-14 sm:pt-28 sm:pb-20 text-center">

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-widest uppercase border mb-8"
          style={{
            color: "#2563EB",
            borderColor: "rgba(37,99,235,0.2)",
            backgroundColor: "rgba(37,99,235,0.05)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#10B981" }} />
          Scholarly Visibility Ecosystem
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-bold leading-tight mb-6"
          style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
          aria-label="Great research deserves to be seen, cited, discovered, impactful"
        >
          Great research
          <br />
          deserves to be{" "}
          <span aria-hidden className="relative inline-block">
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIndex}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -22 }}
                transition={{ duration: 0.36 }}
                className="inline-block"
                style={{ color: "#2563EB" }}
              >
                {ROTATING_WORDS[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base sm:text-xl max-w-2xl mx-auto mb-4 leading-relaxed"
          style={{ color: "#4B5563" }}
        >
          Researchvy helps researchers increase their visibility, reach the
          right audience, and create{" "}
          <span className="font-semibold" style={{ color: "#111827" }}>
            real-world impact.
          </span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.28 }}
          className="text-sm font-medium mb-10"
          style={{ color: "#9CA3AF" }}
        >
          More visibility.&nbsp; More collaboration.&nbsp; More impact.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.32 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-center gap-3 max-w-xs mx-auto sm:max-w-none"
        >
          {/* Primary: WhatsApp / Clinic */}
          <a
            href={buildWhatsAppUrl("Digital Visibility Clinic enrollment")}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2.5 rounded-xl px-8 py-4 text-base font-semibold text-white active:scale-[0.97]"
            style={{
              backgroundColor: "#2563EB",
              transition: "background-color 140ms ease, transform 100ms",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1D4ED8")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
            onFocus={(e) => (e.currentTarget.style.backgroundColor = "#1D4ED8")}
            onBlur={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
            onClick={() => trackCtaClick("Join the Clinic", "hero", "/clinics")}
          >
            <MessageCircle className="h-4 w-4 flex-shrink-0" />
            Join the Clinic
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>

          {/* Secondary: free scorecard */}
          <Link
            href="/resources/visibility-scorecard"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-semibold border active:scale-[0.97]"
            style={{
              color: "#374151",
              borderColor: "#D1D5DB",
              transition: "border-color 140ms ease, color 140ms ease, transform 100ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#10B981";
              e.currentTarget.style.color = "#059669";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#D1D5DB";
              e.currentTarget.style.color = "#374151";
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#10B981";
              e.currentTarget.style.color = "#059669";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#D1D5DB";
              e.currentTarget.style.color = "#374151";
            }}
            onClick={() => trackCtaClick("Take the FREE Scorecard", "hero", "/resources/visibility-scorecard")}
          >
            Take the FREE Scorecard
          </Link>
        </motion.div>

        {/* Trust micro-copy */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.48 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
        >
          {TRUST_POINTS.map((point) => (
            <span
              key={point}
              className="flex items-center gap-1.5 text-xs"
              style={{ color: "#6B7280" }}
            >
              <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#10B981" }} />
              {point}
            </span>
          ))}
        </motion.div>

        {/* Impact stat pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.58 }}
          className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto"
        >
          {[
            { value: "87%",  label: "Visibility increase",   accent: "#2563EB", bg: "rgba(37,99,235,0.06)"  },
            { value: "2.4×", label: "More citations",        accent: "#7C3AED", bg: "rgba(124,58,237,0.06)" },
            { value: "100+", label: "Countries reached",     accent: "#10B981", bg: "rgba(16,185,129,0.06)" },
            { value: "10K+", label: "Researchers empowered", accent: "#F59E0B", bg: "rgba(245,158,11,0.06)"  },
          ].map(({ value, label, accent, bg }) => (
            <div
              key={label}
              className="rounded-2xl border p-4 text-center"
              style={{ backgroundColor: bg, borderColor: `${accent}25` }}
            >
              <p
                className="text-2xl sm:text-3xl font-bold tabular-nums mb-0.5"
                style={{ fontFamily: "var(--font-serif)", color: accent }}
              >
                {value}
              </p>
              <p className="text-xs leading-snug" style={{ color: "#6B7280" }}>{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Partner strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.72 }}
          className="mt-10"
        >
          <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: "#9CA3AF" }}>
            Delivered in partnership with
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {["FUTO", "Bingham University", "Olabisi Onabanjo University", "ASM Nigeria"].map((name) => (
              <span
                key={name}
                className="text-[11px] font-medium px-3 py-1 rounded-full border"
                style={{ backgroundColor: "#F3F4F6", borderColor: "#E5E7EB", color: "#6B7280" }}
              >
                {name}
              </span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
