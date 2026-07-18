"use client";

import { motion } from "framer-motion";
import { Eye, SearchX, Unplug, Megaphone, BarChart3, Lightbulb, ArrowRight } from "lucide-react";
import Link from "next/link";

const PROBLEMS = [
  {
    icon:  Eye,
    label: "Low Visibility",
    color: "#2563EB",
    bg:    "rgba(37,99,235,0.08)",
    desc:  "Hard to find profiles, papers, or information about your research.",
  },
  {
    icon:  SearchX,
    label: "Poor Discoverability",
    color: "#10B981",
    bg:    "rgba(16,185,129,0.08)",
    desc:  "Not optimised for search or indexing across scholarly databases.",
  },
  {
    icon:  Unplug,
    label: "Limited Connections",
    color: "#F59E0B",
    bg:    "rgba(245,158,11,0.08)",
    desc:  "Not enough collaboration or exposure to researchers in your field.",
  },
  {
    icon:  Megaphone,
    label: "Weak Promotion",
    color: "#EF4444",
    bg:    "rgba(239,68,68,0.08)",
    desc:  "Great work shared with the wrong audience, in the wrong way.",
  },
  {
    icon:  BarChart3,
    label: "No Impact Strategy",
    color: "#6366F1",
    bg:    "rgba(99,102,241,0.08)",
    desc:  "No clear plan to increase citations, reach, or measurable impact.",
  },
];

export function VisibilityGap() {
  return (
    <section
      className="py-14 sm:py-24 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#EF4444" }}>
            The Problem
          </p>
          <h2
            className="text-4xl sm:text-5xl font-bold mb-4 leading-tight"
            style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
          >
            Why great research
            <br />
            <span style={{ color: "#2563EB" }}>gets ignored.</span>
          </h2>
          <p className="text-base sm:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: "#6B7280" }}>
            It&rsquo;s not always about the quality.
            <br />
            It&rsquo;s about the <span className="font-semibold" style={{ color: "#374151" }}>visibility.</span>
          </p>
        </motion.div>

        {/* Problem cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          {PROBLEMS.map(({ icon: Icon, label, color, bg, desc }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.09 }}
              className="rounded-2xl border p-5 flex flex-col items-center text-center gap-3"
              style={{ backgroundColor: "#FAFAFA", borderColor: "#E5E7EB" }}
            >
              {/* Icon circle */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: bg }}
              >
                <Icon className="h-6 w-6" style={{ color }} />
              </div>

              {/* Label */}
              <p
                className="text-sm font-bold leading-snug"
                style={{ color }}
              >
                {label}
              </p>

              {/* Description */}
              <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>
                {desc}
              </p>

              {/* Bottom accent bar */}
              <div
                className="w-8 h-0.5 rounded-full mt-auto"
                style={{ backgroundColor: color }}
              />
            </motion.div>
          ))}
        </div>

        {/* "Visibility is not luck" banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6"
          style={{ backgroundColor: "#0F172A" }}
        >
          {/* Light-bulb icon */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "rgba(245,158,11,0.15)" }}
          >
            <Lightbulb className="h-8 w-8" style={{ color: "#F59E0B" }} />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <p
              className="text-xl sm:text-2xl font-bold mb-1 leading-snug"
              style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
            >
              Visibility is not luck.{" "}
              <span style={{ color: "#FCD34D" }}>It&rsquo;s a strategy.</span>
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>
              We help researchers get discovered, get cited, and make real impact.
            </p>
          </div>

          <Link
            href="/resources/visibility-scorecard"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white flex-shrink-0 active:opacity-80"
            style={{
              backgroundColor: "#2563EB",
              transition: "background-color 140ms ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1D4ED8")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
          >
            Start your strategy
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
