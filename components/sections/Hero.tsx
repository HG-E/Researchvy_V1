"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MessageCircle, CheckCircle2, Lightbulb } from "lucide-react";
import { trackCtaClick } from "@/lib/analytics/posthog";
import { buildWhatsAppUrl } from "@/config/site";

const ROTATE_INTERVAL = 2600;
// Short words only — "deserves to be [word]" never wraps past line 2
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
      style={{ backgroundColor: "#FAFAF8" }}
    >
      {/* Warm ambient glow — left side only */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 70% at 15% 50%, rgba(37,99,235,0.07) 0%, transparent 60%)",
        }}
      />

      {/*
        Two-column layout:
        · Left  (text)  — 45% width, content scrolls naturally
        · Right (photo) — 55% width, photo fills the column height
        Both columns share the same overall min-height so they always line up.
      */}
      <div
        className="relative z-10 flex flex-col lg:flex-row"
        style={{ minHeight: "calc(100svh - 72px)" }}
      >

        {/* ══════════════════════════════════════════
            LEFT COLUMN — Text content
        ══════════════════════════════════════════ */}
        <div
          className="flex flex-col justify-center px-6 sm:px-10 lg:px-14 xl:px-20 py-16 lg:py-24 w-full lg:w-[45%] xl:w-[42%] flex-shrink-0"
        >
          {/* Eyebrow pill */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold tracking-widest uppercase border mb-8 self-start"
            style={{
              color: "#2563EB",
              borderColor: "rgba(37,99,235,0.22)",
              backgroundColor: "rgba(37,99,235,0.05)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#10B981" }} />
            Connect. Communicate. Collaborate.
          </motion.p>

          {/*
            Headline — locked to exactly 2 visual lines:
              Line 1: "Great research"
              Line 2: "deserves to be [word]"   ← sm:whitespace-nowrap prevents line 3
            Font scaled with clamp so the 2nd line fits within the narrower column.
          */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-bold mb-5"
            style={{
              fontFamily: "var(--font-serif)",
              color: "#0F172A",
              fontSize: "clamp(1.9rem, 3.8vw, 3.25rem)",
              lineHeight: 1.14,
            }}
            aria-label="Great research deserves to be seen"
          >
            Great research
            <br />
            <span className="sm:whitespace-nowrap">
              deserves to be{" "}
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.36 }}
                  className="inline-block"
                  style={{ color: "#2563EB" }}
                  aria-hidden
                >
                  {ROTATING_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>

          {/* Body copy */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-[1.05rem] max-w-sm leading-relaxed mb-2"
            style={{ color: "#4B5563" }}
          >
            Researchvy helps researchers increase their visibility, reach the right audience, and create{" "}
            <span className="font-semibold" style={{ color: "#111827" }}>real-world impact.</span>
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
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.34 }}
            className="flex flex-col sm:flex-row items-start gap-3 mb-8"
          >
            <a
              href={buildWhatsAppUrl("Digital Visibility Clinic enrollment")}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2.5 rounded-xl px-7 py-3.5 text-[15px] font-semibold text-white active:scale-[0.97]"
              style={{ backgroundColor: "#2563EB", transition: "background-color 140ms ease, transform 100ms" }}
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
              className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-[15px] font-semibold border active:scale-[0.97]"
              style={{ color: "#374151", borderColor: "#D1D5DB", transition: "border-color 140ms ease, color 140ms ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#10B981"; e.currentTarget.style.color = "#059669"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#D1D5DB"; e.currentTarget.style.color = "#374151"; }}
              onClick={() => trackCtaClick("Take the FREE Scorecard", "hero", "/resources/visibility-scorecard")}
            >
              Take the FREE Scorecard
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.48 }}
            className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-10"
          >
            {TRUST_POINTS.map((point) => (
              <span key={point} className="flex items-center gap-1.5 text-xs" style={{ color: "#6B7280" }}>
                <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#10B981" }} />
                {point}
              </span>
            ))}
          </motion.div>

          {/* Impact stat pills */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.58 }}
            className="grid grid-cols-2 gap-3"
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
                <p className="text-2xl font-bold tabular-nums mb-0.5" style={{ fontFamily: "var(--font-serif)", color: accent }}>
                  {value}
                </p>
                <p className="text-xs leading-snug" style={{ color: "#6B7280" }}>{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ══════════════════════════════════════════
            RIGHT COLUMN — Full-bleed photo
            The gradient bleed on the left edge "merges" the image
            into the background — matching the flyer's brush-stroke feel.
        ══════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="relative hidden lg:block flex-1"
          style={{ minHeight: "600px" }}
        >
          {/* Photo fills the entire right column */}
          <Image
            src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=900&q=85&fit=crop&crop=faces,center"
            alt="Researcher working at laptop — representing the Researchvy community"
            fill
            className="object-cover object-center"
            sizes="55vw"
            priority
          />

          {/* ① Left-edge gradient bleed — background colour fades into the photo,
               creating the "seamless merge" from the flyer */}
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 z-10 pointer-events-none"
            style={{
              width: "140px",
              background: "linear-gradient(to right, #FAFAF8 0%, rgba(250,250,248,0.75) 40%, transparent 100%)",
            }}
          />

          {/* ② Bottom dark fade — improves caption readability */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
            style={{
              height: "55%",
              background: "linear-gradient(to top, rgba(10,15,26,0.82) 0%, rgba(10,15,26,0.3) 60%, transparent 100%)",
            }}
          />

          {/* ③ Blue brand tint — top-left area, ties image to brand palette */}
          <div
            aria-hidden
            className="absolute top-0 left-0 right-0 h-1/3 z-10 pointer-events-none"
            style={{
              background: "linear-gradient(135deg, rgba(37,99,235,0.12) 0%, transparent 60%)",
            }}
          />

          {/* Floating annotation card — top right, matches flyer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="absolute top-8 right-8 z-20 rounded-2xl px-4 py-3.5 shadow-xl border"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E7EB", minWidth: "176px" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(245,158,11,0.1)" }}
              >
                <Lightbulb className="h-3.5 w-3.5" style={{ color: "#D97706" }} />
              </div>
              <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#9CA3AF" }}>The outcome</p>
            </div>
            <p className="text-xs leading-[1.75]" style={{ color: "#374151" }}>
              More visibility,<br />
              More collaboration,<br />
              More impact.
            </p>
          </motion.div>

          {/* Live cohort floating badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="absolute z-20 rounded-2xl p-4 shadow-xl border"
            style={{
              bottom: "140px",
              right: "32px",
              backgroundColor: "#FFFFFF",
              borderColor: "#E5E7EB",
            }}
          >
            <div className="flex items-center gap-2 mb-0.5">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#10B981" }} />
              <p className="text-xs font-semibold" style={{ color: "#111827" }}>Live cohort open</p>
            </div>
            <p className="text-xs" style={{ color: "#6B7280" }}>≤20 researchers per batch</p>
          </motion.div>

          {/* Bottom caption bar — spans from the bleed point to the right edge */}
          <div
            className="absolute bottom-0 left-0 right-0 z-20 px-8 py-5"
            style={{ background: "linear-gradient(to top, rgba(10,15,26,0.9) 0%, transparent 100%)" }}
          >
            <p className="text-[11px] font-bold tracking-[0.18em] uppercase mb-1.5" style={{ color: "#60A5FA" }}>
              Your research matters.
            </p>
            <p className="text-[15px] font-semibold leading-snug" style={{ color: "#F9FAFB", fontFamily: "var(--font-serif)" }}>
              &ldquo;Visibility is not luck. It&rsquo;s a strategy.&rdquo;
            </p>
          </div>
        </motion.div>

      </div>

      {/* Mobile photo strip — shown only on mobile below content */}
      <div className="relative lg:hidden h-64 overflow-hidden" aria-hidden>
        <Image
          src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=800&q=80&fit=crop&crop=faces,center"
          alt=""
          fill
          className="object-cover object-top"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, #FAFAF8 0%, transparent 30%, rgba(10,15,26,0.5) 100%)" }}
        />
        <div className="absolute bottom-4 left-6 right-6">
          <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#60A5FA" }}>
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
