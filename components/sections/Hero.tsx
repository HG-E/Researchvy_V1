"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MessageCircle, CheckCircle2 } from "lucide-react";
import { trackCtaClick } from "@/lib/analytics/posthog";
import { buildWhatsAppUrl } from "@/config/site";

const ROTATE_INTERVAL = 2600;
const ROTATING_WORDS = ["seen.", "read.", "cited.", "used.", "lived.", "social.", "human."];

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
      {/* Top-left radial glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 30% -5%, rgba(37,99,235,0.07) 0%, transparent 65%)",
        }}
      />

      {/* Dot grid — right half only */}
      <div
        aria-hidden
        className="absolute top-0 right-0 w-1/2 h-full opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#2563EB 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-10 sm:pt-20 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── LEFT: Text ── */}
          <div className="text-center lg:text-left">

            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase border mb-7"
              style={{
                color: "#2563EB",
                borderColor: "rgba(37,99,235,0.2)",
                backgroundColor: "rgba(37,99,235,0.05)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#10B981" }} />
              Connect. Communicate. Collaborate.
            </motion.p>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-5"
              style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
              aria-label="Great research deserves to be seen, read, cited, used, lived, social, human"
            >
              Great research
              <br />
              <span style={{ fontSize: "0.62em", lineHeight: 1.2 }}>
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
              </span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg max-w-xl mx-auto lg:mx-0 mb-3 leading-relaxed"
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
              className="text-sm font-medium mb-9"
              style={{ color: "#9CA3AF" }}
            >
              More visibility.&nbsp; More collaboration.&nbsp; More impact.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.32 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 max-w-xs mx-auto sm:max-w-none lg:mx-0"
            >
              <a
                href={buildWhatsAppUrl("Digital Visibility Clinic enrollment")}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2.5 rounded-xl px-7 py-4 text-base font-semibold text-white active:scale-[0.97]"
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

              <Link
                href="/resources/visibility-scorecard"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-4 text-base font-semibold border active:scale-[0.97]"
                style={{
                  color: "#374151",
                  borderColor: "#D1D5DB",
                  transition: "border-color 140ms ease, color 140ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#10B981";
                  e.currentTarget.style.color = "#059669";
                }}
                onMouseLeave={(e) => {
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
              className="mt-7 flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2"
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
              className="mt-9 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3"
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
                    className="text-2xl font-bold tabular-nums mb-0.5"
                    style={{ fontFamily: "var(--font-serif)", color: accent }}
                  >
                    {value}
                  </p>
                  <p className="text-xs leading-snug" style={{ color: "#6B7280" }}>{label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT: Researcher photo ── */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="relative hidden lg:block"
          >
            {/* Main photo card */}
            <div
              className="relative rounded-3xl overflow-hidden shadow-2xl"
              style={{ aspectRatio: "4/5", maxHeight: "580px" }}
            >
              {/* Gradient fallback shown before image loads */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #EDE9FE 100%)",
                }}
              />
              <Image
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80&fit=crop&crop=faces,center"
                alt="Researcher working at laptop — representing the Researchvy community"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 0px, 45vw"
                priority
              />
              {/* Warm overlay to harmonise with brand palette */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(180deg, rgba(37,99,235,0.04) 0%, rgba(15,23,42,0.18) 100%)",
                }}
              />

              {/* "Your research matters" badge — bottom-left */}
              <div
                className="absolute bottom-5 left-5 right-5 rounded-2xl p-4 backdrop-blur-sm"
                style={{ backgroundColor: "rgba(15,23,42,0.78)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#60A5FA" }}>
                  Your research matters.
                </p>
                <p className="text-sm font-semibold leading-snug" style={{ color: "#F9FAFB" }}>
                  "Visibility is not luck. It's a strategy."
                </p>
              </div>
            </div>

            {/* Floating top-right accent card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="absolute -top-4 -right-4 rounded-2xl p-4 shadow-lg border"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB", minWidth: "140px" }}
            >
              <p className="text-2xl font-bold mb-0.5" style={{ fontFamily: "var(--font-serif)", color: "#2563EB" }}>87%</p>
              <p className="text-xs leading-snug" style={{ color: "#6B7280" }}>researchers report<br />increased visibility</p>
            </motion.div>

            {/* Floating bottom-right accent card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.85 }}
              className="absolute -bottom-4 -right-6 rounded-2xl p-4 shadow-lg border"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" }}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#10B981" }} />
                <p className="text-xs font-semibold" style={{ color: "#111827" }}>Live cohort open</p>
              </div>
              <p className="text-xs" style={{ color: "#6B7280" }}>≤20 researchers per batch</p>
            </motion.div>
          </motion.div>

        </div>


      </div>
    </section>
  );
}
