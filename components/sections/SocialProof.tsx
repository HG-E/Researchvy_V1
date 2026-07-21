"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { MobileCarousel } from "@/components/ui/MobileCarousel";

const TESTIMONIALS = [
  {
    before:   "Google Scholar missing half my publications. H-index stuck for 3 years.",
    after:    "H-index moved within 2 weeks. Fully optimised profile, first time ever.",
    quote:
      "I had no idea the gaps even existed until the visibility audit. Within two weeks of applying the fixes, my h-index moved — something that hadn't happened in three years of publishing.",
    name:     "Dr. A. Mensah",
    role:     "Senior Lecturer, West Africa",
    initials: "AM",
    color:    "#2563EB",
  },
  {
    before:   "6 years publishing. Near-zero citations outside my department.",
    after:    "Citation trend reversed in 6 months. Discoverable internationally.",
    quote:
      "The audit showed me exactly why I was invisible — and gave me a step-by-step fix. Six months later the difference is measurable, and people outside my field are finding my work for the first time.",
    name:     "Dr. O. Adeyemi",
    role:     "Postdoctoral Researcher",
    initials: "OA",
    color:    "#7C3AED",
  },
  {
    before:   "Team of 14 researchers, none knew how visibility worked.",
    after:    "Institution-wide audit. Every researcher with an optimised scholarly identity.",
    quote:
      "I needed something built for our specific gaps, not a generic workshop. The institutional programme gave my entire team a shared framework. Our researchers now understand exactly what drives discoverability.",
    name:     "Prof. R. Nkosi",
    role:     "Director of Research, South Africa",
    initials: "RN",
    color:    "#10B981",
  },
];

const STATS = [
  { value: "≤20",  label: "Researchers per cohort",  accent: "#2563EB" },
  { value: "5",    label: "Sessions per cohort",      accent: "#7C3AED" },
  { value: "38+",  label: "Countries represented",    accent: "#10B981" },
  { value: "100%", label: "Certified on completion",  accent: "#F59E0B" },
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
      style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
    >
      {/* Before → After transformation strip */}
      <div className="rounded-xl overflow-hidden mb-5 text-xs font-medium" style={{ borderColor: "#E2E8F0" }}>
        <div className="flex items-stretch">
          <div className="flex-1 px-3 py-2.5" style={{ backgroundColor: "#FEF2F2", color: "#DC2626" }}>
            <span className="block text-[9px] font-bold tracking-widest uppercase mb-0.5" style={{ color: "#F87171" }}>Before</span>
            {t.before}
          </div>
          <div
            className="flex items-center justify-center px-2 text-sm font-bold flex-shrink-0"
            style={{ backgroundColor: t.color, color: "#FFFFFF" }}
          >
            →
          </div>
          <div className="flex-1 px-3 py-2.5" style={{ backgroundColor: "#F0FDF4", color: "#16A34A" }}>
            <span className="block text-[9px] font-bold tracking-widest uppercase mb-0.5" style={{ color: "#4ADE80" }}>After</span>
            {t.after}
          </div>
        </div>
      </div>

      <StarRating color={t.color} />
      <Quote className="h-5 w-5 mb-3 flex-shrink-0" style={{ color: t.color }} />
      <p className="text-sm leading-relaxed flex-1 mb-6" style={{ color: "#374151" }}>
        &ldquo;{t.quote}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${t.color}20, ${t.color}08)`, color: t.color }}
        >
          {t.initials}
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: "#111827" }}>{t.name}</p>
          <p className="text-xs" style={{ color: "#4B5563" }}>{t.role}</p>
        </div>
      </div>
    </div>
  );
}

export function SocialProof() {
  return (
    <section className="py-14 sm:py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#F8FAFC" }}>
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
            style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
          >
            This Is What Changes
            <br />
            <span style={{ color: "#10B981" }}>When You Get Found.</span>
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: "#4B5563" }}>
            Researchers across disciplines and continents, from postdocs to research directors,
            on what shifted after working with Researchvy.
          </p>
        </motion.div>

        {/* Testimonials */}
        <div className="mb-12 sm:mb-16">
          {/* Desktop */}
          <div className="hidden md:grid grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.initials}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="rounded-2xl border transition-all duration-300"
                style={{ borderColor: "#E2E8F0" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = t.color;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#E2E8F0";
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
            dotColor="#2563EB"
            items={TESTIMONIALS.map((t) => (
              <div key={t.initials} className="px-0.5">
                <TestimonialCard t={t} />
              </div>
            ))}
          />
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
        >
          {STATS.map((stat, i) => (
            <div key={i} className="text-center">
              <p
                className="text-3xl sm:text-4xl font-bold mb-1 tabular-nums"
                style={{ fontFamily: "var(--font-serif)", color: stat.accent }}
              >
                {stat.value}
              </p>
              <p className="text-xs leading-snug" style={{ color: "#4B5563" }}>{stat.label}</p>
            </div>
          ))}
        </motion.div>


      </div>
    </section>
  );
}
