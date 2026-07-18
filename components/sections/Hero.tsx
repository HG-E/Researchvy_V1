"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { copy } from "@/constants/copy";
import { trackCtaClick } from "@/lib/analytics/posthog";

const ROTATE_INTERVAL = 2800;

const STAT_BADGES = [
  { value: "38+",  label: "Countries" },
  { value: "≤20",  label: "Per cohort" },
  { value: "5",    label: "Sessions" },
  { value: "100%", label: "Certified" },
];

export function Hero() {
  const [wordIndex, setWordIndex] = useState(0);
  const words = copy.hero.rotatingMessages;

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((i) => (i + 1) % words.length);
    }, ROTATE_INTERVAL);
    return () => clearInterval(timer);
  }, [words.length]);

  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-screen text-center overflow-hidden"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      {/* Subtle background grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(#2563EB 1px, transparent 1px), linear-gradient(90deg, #2563EB 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Primary radial glow — very subtle on white */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06] blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #2563EB 0%, #7C3AED 55%, transparent 80%)" }}
      />
      {/* Secondary accent glow — green, upper-right */}
      <div
        aria-hidden="true"
        className="absolute top-[30%] right-[5%] w-[280px] h-[280px] rounded-full opacity-[0.04] blur-3xl pointer-events-none"
        style={{ backgroundColor: "#10B981" }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs font-semibold tracking-widest uppercase mb-6"
          style={{ color: "#2563EB" }}
        >
          Scholarly Visibility Ecosystem
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-bold mb-4 leading-tight"
          style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
          aria-label="Your research deserves more visibility"
        >
          Research Beyond
          <br />
          {/* aria-hidden: stable aria-label above is what crawlers and AT index */}
          <span aria-hidden="true" className="relative inline-block min-w-[160px] sm:min-w-[360px]">
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIndex}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.38 }}
                className="inline-block"
                style={{ color: "#2563EB" }}
              >
                {words[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed"
          style={{ color: "#6B7280" }}
        >
          {copy.hero.body}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col items-stretch sm:flex-row sm:items-center sm:justify-center gap-3 w-full max-w-xs mx-auto sm:max-w-none"
        >
          {/* Primary: clinic — direct revenue action */}
          <Link
            href="/clinics"
            className="group inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-semibold text-white active:scale-[0.97] active:opacity-90"
            style={{
              backgroundColor: "#2563EB",
              transition: "background-color 150ms ease, transform 100ms ease, opacity 100ms ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1D4ED8")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
            onFocus={(e) => (e.currentTarget.style.backgroundColor = "#1D4ED8")}
            onBlur={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
            onClick={() => trackCtaClick("Join the Clinic", "hero", "/clinics")}
          >
            Join the Clinic
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          {/* Secondary: free scorecard — low-friction funnel entry */}
          <Link
            href="/resources/visibility-scorecard"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-semibold border active:scale-[0.97] active:opacity-80"
            style={{
              color: "#374151",
              borderColor: "#E2E8F0",
              transition: "border-color 150ms ease, color 150ms ease, transform 100ms ease, opacity 100ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#10B981"; e.currentTarget.style.color = "#10B981"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.color = "#374151"; }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "#10B981"; e.currentTarget.style.color = "#10B981"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.color = "#374151"; }}
            onClick={() => trackCtaClick("Check My Score Free", "hero", "/resources/visibility-scorecard")}
          >
            Check My Score Free
          </Link>
        </motion.div>

        {/* Social proof stat badges */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-7 flex flex-wrap items-center justify-center gap-2.5"
        >
          {STAT_BADGES.map(({ value, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-full px-3.5 py-1.5 border"
              style={{
                backgroundColor: "#F8FAFC",
                borderColor: "#E2E8F0",
              }}
            >
              <span className="text-sm font-bold tabular-nums" style={{ color: "#2563EB" }}>{value}</span>
              <span className="text-xs" style={{ color: "#6B7280" }}>{label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-8 hidden sm:flex flex-wrap items-center justify-center gap-6 text-sm"
          style={{ color: "#6B7280" }}
        >
          {["Research Intelligence", "Scholarly Visibility", "Digital Discoverability"].map((item) => (
            <span key={item} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#2563EB" }} />
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      <motion.div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        style={{ color: "#6B7280" }}
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </motion.div>
    </section>
  );
}
