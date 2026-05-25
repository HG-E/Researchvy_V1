"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { copy } from "@/constants/copy";

const FRAMEWORK_STEPS = [
  "Research",
  "Visibility",
  "Discoverability",
  "Connection",
  "Communication",
  "Application",
  "Impact",
];

export function CTA() {
  return (
    <section
      className="py-14 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ backgroundColor: "#080E1A" }}
    >
      {/* Multi-color radial glow — blue → purple → green */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-[0.09] blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, #7C3AED 0%, #2563EB 40%, #10B981 80%, transparent 100%)" }}
      />
      {/* Subtle right-side accent */}
      <div
        className="absolute right-0 top-0 bottom-0 w-[300px] opacity-[0.04] blur-3xl pointer-events-none"
        style={{ background: "linear-gradient(180deg, #10B981, transparent)" }}
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: "#2563EB" }}
          >
            Begin Your Journey
          </p>
          <h2
            className="text-4xl sm:text-5xl font-bold mb-6 leading-tight"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
          >
            {copy.cta.ecosystem}
          </h2>
          <p
            className="text-base max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: "#9CA3AF" }}
          >
            {copy.cta.body}
          </p>

          <div className="flex flex-col items-stretch sm:flex-row sm:items-center sm:justify-center gap-3 w-full max-w-xs mx-auto sm:max-w-none">
            <Link
              href="/clinics"
              className="group inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-semibold text-white active:scale-[0.97] active:opacity-90"
              style={{
                backgroundColor: "#2563EB",
                transition: "background-color 150ms ease, transform 100ms ease, opacity 100ms ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1D4ED8")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
            >
              Secure My Spot
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/ecosystem"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-semibold border active:scale-[0.97] active:opacity-80"
              style={{
                color: "#F9FAFB",
                borderColor: "#1E293B",
                transition: "border-color 150ms ease, color 150ms ease, transform 100ms ease, opacity 100ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#2563EB";
                e.currentTarget.style.color = "#60A5FA";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#1E293B";
                e.currentTarget.style.color = "#F9FAFB";
              }}
            >
              Explore the Ecosystem
            </Link>
          </div>

          {/* Framework chain — hidden on mobile */}
          <div className="mt-16 hidden sm:flex flex-wrap items-center justify-center gap-2">
            {FRAMEWORK_STEPS.map((step, i) => (
              <span key={i} className="flex items-center gap-2">
                <span
                  className="text-xs font-medium px-3 py-1.5 rounded-full border"
                  style={{
                    backgroundColor: "#0F172A",
                    borderColor: i === FRAMEWORK_STEPS.length - 1 ? "#10B981" : "#1E293B",
                    color: i === FRAMEWORK_STEPS.length - 1 ? "#10B981" : "#9CA3AF",
                  }}
                >
                  {step}
                </span>
                {i < FRAMEWORK_STEPS.length - 1 && (
                  <span className="text-sm" style={{ color: "#2563EB" }}>→</span>
                )}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
