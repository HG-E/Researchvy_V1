"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "Before the clinic, I had no idea my Google Scholar profile was missing half my publications. Within two weeks of applying what I learned, my h-index moved. That had never happened in three years.",
    name: "Dr. A. Mensah",
    role: "Senior Lecturer, West Africa",
    initials: "AM",
    color: "#60A5FA",
  },
  {
    quote:
      "I published consistently for six years and barely got cited outside my department. The visibility audit showed me exactly why — and gave me a step-by-step fix. Six months later, the difference is measurable.",
    name: "Dr. O. Adeyemi",
    role: "Postdoctoral Researcher",
    initials: "OA",
    color: "#A78BFA",
  },
  {
    quote:
      "As a research director, I needed something I could bring to the whole team — not another generic workshop. The institutional programme was built around our specific gaps. Our researchers finally understand how visibility works.",
    name: "Prof. R. Nkosi",
    role: "Director of Research, South Africa",
    initials: "RN",
    color: "#34D399",
  },
];

const STATS = [
  { value: "≤20",   label: "Researchers per cohort — intentionally small" },
  { value: "6",     label: "Sessions from invisible to globally discoverable" },
  { value: "100%",  label: "Of completers receive a verified certificate" },
  { value: "24hrs", label: "Response time to every enquiry" },
];

export function SocialProof() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#0F172A" }}>
      <div className="mx-auto max-w-6xl">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
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
            Researchers across disciplines and continents — from postdocs to research directors —
            on what shifted after working with Researchvy.
          </p>
        </motion.div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="rounded-2xl border p-6 flex flex-col"
              style={{ backgroundColor: "#080E1A", borderColor: "#1E293B" }}
            >
              <Quote className="h-5 w-5 mb-4 flex-shrink-0" style={{ color: t.color }} />
              <p className="text-sm leading-relaxed flex-1 mb-6" style={{ color: "#D1D5DB" }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: `${t.color}20`, color: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#F9FAFB" }}>{t.name}</p>
                  <p className="text-xs" style={{ color: "#4B5563" }}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border p-8 grid grid-cols-2 lg:grid-cols-4 gap-8"
          style={{ backgroundColor: "#080E1A", borderColor: "#1E293B" }}
        >
          {STATS.map((stat, i) => (
            <div key={i} className="text-center">
              <p
                className="text-4xl font-bold mb-1"
                style={{ fontFamily: "var(--font-serif)", color: "#2563EB" }}
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
