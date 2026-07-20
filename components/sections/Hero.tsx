"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MessageCircle, CheckCircle2 } from "lucide-react";
import { trackCtaClick } from "@/lib/analytics/posthog";
import { buildWhatsAppUrl } from "@/config/site";

const ROTATE_INTERVAL = 2600;
const ROTATING_WORDS = ["seen.", "cited.", "found.", "read.", "heard."];

const TRUST_POINTS = [
  "38+ countries",
  "Certified on completion",
  "Live cohort · ≤20 researchers",
  "No fluff — measurable results",
];

const STATS = [
  { value: "87%",  label: "Visibility increase",  accent: "#4A78D0", bg: "rgba(74,120,208,0.08)"  },
  { value: "2.4×", label: "More citations",        accent: "#7C3AED", bg: "rgba(124,58,237,0.08)" },
  { value: "140+", label: "Researchers trained",   accent: "#10B981", bg: "rgba(16,185,129,0.08)" },
  { value: "10K+", label: "Research community",    accent: "#D97706", bg: "rgba(217,119,6,0.08)"  },
];

// ── Decorative SVG components ─────────────────────────────────────────────

function SparkAccent() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 22 22"
      width="18"
      height="18"
      fill="none"
      className="absolute"
      style={{ top: "-13px", right: "-9px" }}
    >
      <line x1="11" y1="2"  x2="11" y2="9"  stroke="#151E45" strokeWidth="2"   strokeLinecap="round" />
      <line x1="18" y1="6"  x2="13" y2="10" stroke="#151E45" strokeWidth="2"   strokeLinecap="round" />
      <line x1="4"  y1="6"  x2="9"  y2="10" stroke="#151E45" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function WavyUnderline({
  color = "#4A78D0",
  opacity = 0.65,
  strokeWidth = 2.5,
}: {
  color?: string;
  opacity?: number;
  strokeWidth?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 10"
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        left: 0,
        bottom: "-4px",
        width: "100%",
        height: "10px",
        pointerEvents: "none",
      }}
    >
      <path
        d="M 0 6 Q 25 1 50 6 Q 75 11 100 6 Q 125 1 150 6 Q 175 11 200 6"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={opacity}
      />
    </svg>
  );
}

function CurvedArrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 55 65"
      width="40"
      height="50"
      fill="none"
      className="absolute"
      style={{ bottom: "-52px", left: "-24px" }}
    >
      <path
        d="M 44 6 C 30 16 10 32 18 56"
        stroke="#151E45"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M 9 51 L 18 57 L 24 47"
        stroke="#151E45"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BlobShape() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 540 540"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        fill="#EDE6D8"
        d="M270 30 C390 5 510 80 520 200 C530 322 488 438 380 480 C272 522 132 510 58 420 C-18 330 6 182 60 92 C112 18 188 52 270 30Z"
      />
    </svg>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export function Hero() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setWordIndex((i) => (i + 1) % ROTATING_WORDS.length),
      ROTATE_INTERVAL,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <section
      className="relative overflow-x-hidden"
      style={{ backgroundColor: "#F5F1E8", minHeight: "calc(100svh - 72px)" }}
    >
      {/* Paper / canvas grain texture overlay */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* Ambient blue glow — left side */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 60% at 8% 52%, rgba(74,120,208,0.07) 0%, transparent 65%)",
        }}
      />

      {/* Two-column flex container */}
      <div
        className="relative z-10 max-w-[1280px] mx-auto flex flex-col lg:flex-row"
        style={{ minHeight: "inherit" }}
      >
        {/* ══════════════════════════════════════════
            LEFT — all text content
        ══════════════════════════════════════════ */}
        <div className="flex flex-col justify-center w-full lg:w-[52%] xl:w-[50%] flex-shrink-0 px-6 sm:px-10 lg:px-14 xl:px-20 py-14 lg:py-24">

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-[11px] font-bold tracking-[0.22em] uppercase mb-6"
            style={{ color: "#4A78D0" }}
          >
            Connect. Communicate. Collaborate.
          </motion.p>

          {/* Headline — Kalam 700, handwritten/display */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="leading-[1.12] font-bold mb-7"
            style={{
              fontFamily: "var(--font-display)",
              color: "#151E45",
              fontSize: "clamp(2.25rem, 4.6vw, 3.75rem)",
            }}
            aria-label="Great research deserves to be seen"
          >
            Great{" "}
            {/* Spark accent positioned above "research" */}
            <span className="relative inline-block">
              research
              <SparkAccent />
            </span>
            <br />
            deserves to be{" "}
            {/* Rotating word + wavy underline */}
            <span className="relative inline-block pb-2">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                  style={{ color: "#4A78D0" }}
                  className="inline-block"
                  aria-hidden
                >
                  {ROTATING_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
              <WavyUnderline color="#4A78D0" opacity={0.65} strokeWidth={2.5} />
            </span>
          </motion.h1>

          {/* Body copy */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="text-[1.05rem] sm:text-[1.1rem] leading-[1.75] mb-10"
            style={{ color: "#2B2B2B", maxWidth: "460px" }}
          >
            Researchvy helps researchers increase their visibility, reach the right
            audience, and create{" "}
            <span className="relative inline-block pb-1">
              real-world impact.
              <WavyUnderline color="#4A78D0" opacity={0.4} strokeWidth={2} />
            </span>
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.34 }}
            className="flex flex-wrap items-center gap-3 mb-9"
          >
            <a
              href={buildWhatsAppUrl("Digital Visibility Clinic enrollment")}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2.5 rounded-xl px-7 py-3.5 text-[15px] font-semibold text-white active:scale-[0.97]"
              style={{
                backgroundColor: "#151E45",
                transition: "background-color 150ms ease, transform 100ms",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#4A78D0")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#151E45")}
              onFocus={(e) => (e.currentTarget.style.backgroundColor = "#4A78D0")}
              onBlur={(e) => (e.currentTarget.style.backgroundColor = "#151E45")}
              onClick={() => trackCtaClick("Join the Clinic", "hero", "/clinics")}
            >
              <MessageCircle className="h-4 w-4 flex-shrink-0" />
              Join the Clinic
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>

            <Link
              href="/resources/visibility-scorecard"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-[15px] font-semibold border active:scale-[0.97]"
              style={{
                color: "#151E45",
                borderColor: "rgba(21,30,69,0.28)",
                backgroundColor: "rgba(21,30,69,0.04)",
                transition: "all 150ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(74,120,208,0.09)";
                e.currentTarget.style.borderColor = "#4A78D0";
                e.currentTarget.style.color = "#4A78D0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(21,30,69,0.04)";
                e.currentTarget.style.borderColor = "rgba(21,30,69,0.28)";
                e.currentTarget.style.color = "#151E45";
              }}
              onClick={() => trackCtaClick("Take the FREE Scorecard", "hero", "/resources/visibility-scorecard")}
            >
              Take the FREE Scorecard
            </Link>
          </motion.div>

          {/* Trust micro-copy */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-9"
          >
            {TRUST_POINTS.map((pt) => (
              <span
                key={pt}
                className="flex items-center gap-1.5 text-xs"
                style={{ color: "#4A5568" }}
              >
                <CheckCircle2
                  className="h-3.5 w-3.5 flex-shrink-0"
                  style={{ color: "#10B981" }}
                />
                {pt}
              </span>
            ))}
          </motion.div>

          {/* Impact stat pills — 2×2 grid */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-2 gap-3 max-w-[380px]"
          >
            {STATS.map(({ value, label, accent, bg }) => (
              <div
                key={label}
                className="rounded-2xl border p-4 text-center"
                style={{ backgroundColor: bg, borderColor: `${accent}22` }}
              >
                <p
                  className="text-2xl font-bold tabular-nums mb-0.5"
                  style={{ fontFamily: "var(--font-serif)", color: accent }}
                >
                  {value}
                </p>
                <p className="text-[11px] leading-snug" style={{ color: "#4A5568" }}>
                  {label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ══════════════════════════════════════════
            RIGHT — blob + photo + annotation (desktop)
        ══════════════════════════════════════════ */}
        <motion.div
          className="relative hidden lg:block flex-1"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
          style={{ minHeight: "640px" }}
        >
          {/* Organic blob behind the photo */}
          <div
            aria-hidden
            className="absolute z-0"
            style={{ top: "4%", left: "4%", right: "0%", bottom: "4%" }}
          >
            <BlobShape />
          </div>

          {/* Photo — inset inside the blob */}
          <div
            className="absolute z-10"
            style={{
              top: "9%",
              left: "13%",
              right: "5%",
              bottom: "9%",
              borderRadius: "1.75rem",
              overflow: "hidden",
            }}
          >
            <Image
              src="https://images.unsplash.com/photo-1573497019236-17f8177b81e8?w=960&q=88&fit=crop&crop=faces,center"
              alt="Researcher smiling while working at a laptop"
              fill
              className="object-cover object-center"
              sizes="48vw"
              priority
            />
            {/* Dark bottom fade for "Ry" badge legibility */}
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0"
              style={{
                height: "35%",
                background:
                  "linear-gradient(to top, rgba(21,30,69,0.72) 0%, transparent 100%)",
              }}
            />
          </div>

          {/* Handwritten annotation — upper-right, overlapping photo edge */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.7 }}
            className="absolute z-20"
            style={{ top: "6%", right: "2%" }}
          >
            <div
              className="relative inline-block text-right"
              style={{
                fontFamily: "var(--font-display)",
                color: "#151E45",
                fontSize: "1rem",
                lineHeight: 1.65,
              }}
            >
              More visibility,
              <br />
              More collaboration,
              <br />
              More impact.
              <CurvedArrow />
            </div>
          </motion.div>

          {/* "Ry" monogram badge — bottom-right of photo */}
          <div
            className="absolute z-20 flex items-center justify-center rounded-full"
            style={{
              width: "56px",
              height: "56px",
              backgroundColor: "#151E45",
              bottom: "10%",
              right: "5.5%",
              boxShadow: "0 4px 16px rgba(21,30,69,0.3)",
            }}
          >
            <span
              style={{
                color: "#ffffff",
                fontFamily: "var(--font-serif)",
                fontSize: "1.1rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              Ry
            </span>
          </div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════
          MOBILE — photo strip below text
      ══════════════════════════════════════════ */}
      <div
        className="relative lg:hidden overflow-hidden"
        style={{ height: "300px" }}
      >
        <Image
          src="https://images.unsplash.com/photo-1573497019236-17f8177b81e8?w=800&q=80&fit=crop&crop=faces,top"
          alt=""
          fill
          className="object-cover object-top"
          sizes="100vw"
          aria-hidden
        />
        {/* Top cream fade — blends into page background */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0"
          style={{
            height: "38%",
            background:
              "linear-gradient(to bottom, #F5F1E8 0%, transparent 100%)",
          }}
        />
        {/* Bottom dark fade */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0"
          style={{
            height: "50%",
            background:
              "linear-gradient(to top, rgba(21,30,69,0.75) 0%, transparent 100%)",
          }}
        />
        {/* Mobile annotation — compact single line */}
        <div
          className="absolute bottom-5 left-5 right-5"
          style={{
            fontFamily: "var(--font-display)",
            color: "#ffffff",
            fontSize: "0.95rem",
            lineHeight: 1.5,
          }}
        >
          More visibility · More collaboration · More impact.
        </div>
      </div>
    </section>
  );
}
