"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MessageCircle, CheckCircle2 } from "lucide-react";
import { trackCtaClick } from "@/lib/analytics/posthog";
import { buildWhatsAppUrl } from "@/config/site";

const ROTATE_INTERVAL = 2600;
// Short words only — keeps "seen." on its own prominent line without wrapping
const ROTATING_WORDS = ["seen.", "cited.", "found.", "read.", "heard."];

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
      /* Warm beige — matches the flyer background exactly */
      style={{ backgroundColor: "#EDE8DF", minHeight: "calc(100svh - 72px)" }}
    >
      {/* Very subtle ambient glow left-centre */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 60% at 10% 55%, rgba(37,99,235,0.06) 0%, transparent 65%)",
        }}
      />

      <div
        className="relative z-10 flex flex-col lg:flex-row"
        style={{ minHeight: "inherit" }}
      >
        {/* ══════════════════════════════════════════════
            LEFT — all text content
        ══════════════════════════════════════════════ */}
        <div className="flex flex-col justify-center w-full lg:w-[48%] xl:w-[44%] flex-shrink-0 px-6 sm:px-10 lg:px-14 xl:px-20 py-14 lg:py-20">

          {/* Eyebrow — minimal dot + label, no pill box */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex items-center gap-2.5 mb-7"
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse"
              style={{ backgroundColor: "#10B981" }}
            />
            <p
              className="text-[11px] font-bold tracking-[0.22em] uppercase"
              style={{ color: "#2563EB" }}
            >
              Connect. Communicate. Collaborate.
            </p>
          </motion.div>

          {/*
            Headline — 3 lines matching the flyer exactly:
              Line 1: "Great research"
              Line 2: "deserves to be"
              Line 3: "[rotating word]" — prominent, blue, with underline accent
            Font uses clamp so it never overflows on any viewport width.
          */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08 }}
            className="font-bold mb-7"
            style={{
              fontFamily: "var(--font-serif)",
              color: "#0B1B3E",
              fontSize: "clamp(2.4rem, 5.2vw, 4.6rem)",
              lineHeight: 1.09,
            }}
            aria-label="Great research deserves to be seen"
          >
            Great research
            <br />
            deserves to be
            <br />
            {/* Rotating word + animated underline accent */}
            <span className="relative inline-block">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.38 }}
                  className="inline-block"
                  style={{ color: "#2563EB" }}
                  aria-hidden
                >
                  {ROTATING_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
              {/* Underline accent — mimics the hand-drawn underline in the flyer */}
              <motion.span
                key={`ul-${wordIndex}`}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.42, delay: 0.15 }}
                className="absolute left-0 right-0 rounded-full origin-left"
                style={{
                  bottom: "-6px",
                  height: "3px",
                  backgroundColor: "#2563EB",
                  opacity: 0.45,
                }}
              />
            </span>
          </motion.h1>

          {/* Description — "real-world impact." in italic underline style, matching flyer */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="text-base sm:text-[1.05rem] max-w-sm leading-[1.7] mb-10"
            style={{ color: "#4A5568" }}
          >
            Researchvy helps researchers increase their visibility, reach the right
            audience, and create{" "}
            <em
              className="not-italic font-semibold"
              style={{
                color: "#0B1B3E",
                textDecoration: "underline",
                textDecorationColor: "rgba(37,99,235,0.35)",
                textUnderlineOffset: "4px",
                textDecorationThickness: "2px",
              }}
            >
              real-world impact.
            </em>
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.34 }}
            className="flex flex-col sm:flex-row items-start gap-3 mb-9"
          >
            <a
              href={buildWhatsAppUrl("Digital Visibility Clinic enrollment")}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2.5 rounded-xl px-7 py-3.5 text-[15px] font-semibold text-white active:scale-[0.97]"
              style={{
                backgroundColor: "#0B1B3E",
                transition: "background-color 150ms ease, transform 100ms",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0B1B3E")}
              onFocus={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
              onBlur={(e) => (e.currentTarget.style.backgroundColor = "#0B1B3E")}
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
                color: "#0B1B3E",
                borderColor: "rgba(11,27,62,0.28)",
                backgroundColor: "rgba(11,27,62,0.04)",
                transition: "all 150ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(37,99,235,0.09)";
                e.currentTarget.style.borderColor = "#2563EB";
                e.currentTarget.style.color = "#2563EB";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(11,27,62,0.04)";
                e.currentTarget.style.borderColor = "rgba(11,27,62,0.28)";
                e.currentTarget.style.color = "#0B1B3E";
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
            {TRUST_POINTS.map((point) => (
              <span
                key={point}
                className="flex items-center gap-1.5 text-xs"
                style={{ color: "#6B7280" }}
              >
                <CheckCircle2
                  className="h-3.5 w-3.5 flex-shrink-0"
                  style={{ color: "#10B981" }}
                />
                {point}
              </span>
            ))}
          </motion.div>

          {/* Impact stat pills — 2×2 grid, warm tone */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-2 gap-3"
          >
            {[
              { value: "87%",  label: "Visibility increase",   accent: "#2563EB", bg: "rgba(37,99,235,0.07)"  },
              { value: "2.4×", label: "More citations",        accent: "#7C3AED", bg: "rgba(124,58,237,0.07)" },
              { value: "100+", label: "Countries reached",     accent: "#10B981", bg: "rgba(16,185,129,0.07)" },
              { value: "10K+", label: "Researchers empowered", accent: "#D97706", bg: "rgba(217,119,6,0.07)"   },
            ].map(({ value, label, accent, bg }) => (
              <div
                key={label}
                className="rounded-2xl border p-4 text-center"
                style={{ backgroundColor: bg, borderColor: `${accent}28` }}
              >
                <p
                  className="text-2xl font-bold tabular-nums mb-0.5"
                  style={{ fontFamily: "var(--font-serif)", color: accent }}
                >
                  {value}
                </p>
                <p className="text-xs leading-snug" style={{ color: "#6B7280" }}>
                  {label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ══════════════════════════════════════════════
            RIGHT — full-bleed photo, clean like the flyer
            No floating cards on the image — just the brush-stroke
            blend on the left edge and a caption bar at the bottom.
        ══════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.1 }}
          className="relative hidden lg:block flex-1"
          style={{ minHeight: "640px" }}
        >
          {/* ── Photo ── */}
          <Image
            src="https://images.unsplash.com/photo-1573497019236-17f8177b81e8?w=960&q=88&fit=crop&crop=faces,center"
            alt="Researcher working at laptop — representing the Researchvy community"
            fill
            className="object-cover object-center"
            sizes="56vw"
            priority
          />

          {/*
            ① BRUSH-STROKE BLEED
            The beige background fades into the photo from the left,
            replicating the painted/brush-stroke effect from the flyer.
            Three layered gradients give it depth and organicness.
          */}
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 z-10 pointer-events-none"
            style={{
              width: "200px",
              background:
                "linear-gradient(to right, #EDE8DF 0%, rgba(237,232,223,0.92) 30%, rgba(237,232,223,0.55) 60%, rgba(237,232,223,0.1) 85%, transparent 100%)",
            }}
          />
          {/* Slight organic curve by offsetting a second narrower gradient */}
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 z-10 pointer-events-none"
            style={{
              width: "120px",
              background:
                "linear-gradient(to right, #EDE8DF 0%, rgba(237,232,223,0.4) 70%, transparent 100%)",
            }}
          />

          {/* ② Blue brand tint — top-left, ties image to brand palette */}
          <div
            aria-hidden
            className="absolute top-0 left-0 right-0 h-2/5 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(37,99,235,0.1) 0%, transparent 55%)",
            }}
          />

          {/* ③ Bottom dark fade — readability for caption bar */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
            style={{
              height: "42%",
              background:
                "linear-gradient(to top, rgba(11,27,62,0.85) 0%, rgba(11,27,62,0.3) 55%, transparent 100%)",
            }}
          />

          {/* ④ "More visibility" annotation — matching flyer top-right note */}
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.88 }}
            className="absolute top-9 right-9 z-20 rounded-2xl px-4 py-3.5 shadow-lg"
            style={{
              backgroundColor: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.7)",
              minWidth: "160px",
            }}
          >
            <p
              className="text-xs leading-[1.85]"
              style={{ color: "#374151", fontStyle: "normal" }}
            >
              More visibility,
              <br />
              More collaboration,
              <br />
              More impact.
            </p>
          </motion.div>

          {/* ⑤ Bottom caption bar */}
          <div
            className="absolute bottom-0 left-0 right-0 z-20 px-9 pb-8 pt-5"
          >
            <p
              className="text-[11px] font-bold tracking-[0.18em] uppercase mb-1.5"
              style={{ color: "#93C5FD" }}
            >
              Your research matters.
            </p>
            <p
              className="text-base font-semibold leading-snug"
              style={{ color: "#F9FAFB", fontFamily: "var(--font-serif)" }}
            >
              &ldquo;Visibility is not luck. It&rsquo;s a strategy.&rdquo;
            </p>
          </div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════
          MOBILE — compact photo strip below text
      ══════════════════════════════════════════════ */}
      <div className="relative lg:hidden h-72 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1573497019236-17f8177b81e8?w=800&q=80&fit=crop&crop=faces,center"
          alt=""
          fill
          className="object-cover object-top"
          sizes="100vw"
          aria-hidden
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, #EDE8DF 0%, transparent 22%, rgba(11,27,62,0.6) 100%)",
          }}
        />
        <div className="absolute bottom-5 left-6 right-6">
          <p
            className="text-[11px] font-bold tracking-widest uppercase mb-1"
            style={{ color: "#93C5FD" }}
          >
            Your research matters.
          </p>
          <p className="text-sm font-semibold" style={{ color: "#F9FAFB" }}>
            &ldquo;Visibility is not luck. It&rsquo;s a strategy.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
