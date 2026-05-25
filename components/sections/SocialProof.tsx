"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { MobileCarousel } from "@/components/ui/MobileCarousel";

const TESTIMONIALS = [
  {
    quote:
      "Before the clinic, I had no idea my Google Scholar profile was missing half my publications. Within two weeks of applying what I learned, my h-index moved. That had never happened in three years.",
    name:     "Dr. A. Mensah",
    role:     "Senior Lecturer, West Africa",
    initials: "AM",
    color:    "#60A5FA",
  },
  {
    quote:
      "I published consistently for six years and barely got cited outside my department. The visibility audit showed me exactly why, giving me a step-by-step fix. Six months later, the difference is measurable.",
    name:     "Dr. O. Adeyemi",
    role:     "Postdoctoral Researcher",
    initials: "OA",
    color:    "#A78BFA",
  },
  {
    quote:
      "As a research director, I needed something I could bring to the whole team, not another generic workshop. The institutional programme was built around our specific gaps. Our researchers finally understand how visibility works.",
    name:     "Prof. R. Nkosi",
    role:     "Director of Research, South Africa",
    initials: "RN",
    color:    "#34D399",
  },
];

const STATS = [
  { value: "≤20",  label: "Researchers per cohort",  accent: "#60A5FA" },
  { value: "4",    label: "Live sessions to visibility",  accent: "#A78BFA" },
  { value: "5",    label: "Ecosystem divisions",     accent: "#34D399" },
  { value: "100%", label: "Certified on completion", accent: "#FCD34D" },
];

function StarRating({ color }: { color: string }) {
  return (
    <div className="flex gap-0.5 mb-3" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 20 20" aria-hidden="true">
          <path
            fill={color}
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: (typeof TESTIMONIALS)[number] }) {
  return (
    <div
      className="rounded-2xl border p-6 flex flex-col h-full"
      style={{ backgroundColor: "#080E1A", borderColor: "#1E293B" }}
    >
      <StarRating color={t.color} />
      <Quote className="h-5 w-5 mb-3 flex-shrink-0" style={{ color: t.color }} />
      <p className="text-sm leading-relaxed flex-1 mb-6" style={{ color: "#D1D5DB" }}>
        &ldquo;{t.quote}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${t.color}30, ${t.color}10)`, color: t.color }}
        >
          {t.initials}
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: "#F9FAFB" }}>{t.name}</p>
          <p className="text-xs" style={{ color: "#4B5563" }}>{t.role}</p>
        </div>
      </div>
    </div>
  );
}

export function SocialProof() {
  return (
    <section className="py-14 sm:py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#0F172A" }}>
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 sm:mb-16"
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
            Researcher Results
          </p>
          <h2
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
          >
            This Is What Changes
            <br />
            <span style={{ color: "#10B981" }}>When You Get Found.</span>
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: "#6B7280" }}>
            Researchers across disciplines and continents, from postdocs to research directors,
            on what shifted after working with Researchvy.
          </p>
        </motion.div>

        {/* Testimonials — desktop: 3-col grid | mobile: swipe carousel */}
        <div className="mb-12 sm:mb-16">
          {/* Desktop */}
          <div className="hidden md:grid grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="rounded-2xl border transition-all duration-300"
                style={{ borderColor: "#1E293B" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = t.color;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#1E293B";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <TestimonialCard t={t} />
              </motion.div>
            ))}
          </div>

          {/* Mobile carousel */}
          <MobileCarousel
            className="md:hidden"
            dotColor="#60A5FA"
            items={TESTIMONIALS.map((t) => (
              <div key={t.initials} className="px-0.5">
                <TestimonialCard t={t} />
              </div>
            ))}
          />
        </div>

        {/* Stats bar — with per-stat accent colors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          style={{ backgroundColor: "#080E1A", borderColor: "#1E293B" }}
        >
          {STATS.map((stat, i) => (
            <div key={i} className="text-center">
              <p
                className="text-3xl sm:text-4xl font-bold mb-1 tabular-nums"
                style={{ fontFamily: "var(--font-serif)", color: stat.accent }}
              >
                {stat.value}
              </p>
              <p className="text-xs leading-snug" style={{ color: "#6B7280" }}>{stat.label}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
