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
      className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ backgroundColor: "#080E1A" }}
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ backgroundColor: "#2563EB" }}
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

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/ecosystem"
              className="group inline-flex items-center gap-2 rounded-lg px-8 py-3.5 text-base font-semibold text-white transition-all duration-200"
              style={{ backgroundColor: "#2563EB" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1D4ED8")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563EB")}
            >
              Explore the Ecosystem
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/clinics"
              className="inline-flex items-center gap-2 rounded-lg px-8 py-3.5 text-base font-semibold border transition-all duration-200"
              style={{ color: "#F9FAFB", borderColor: "#1E293B" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#2563EB";
                e.currentTarget.style.color = "#60A5FA";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#1E293B";
                e.currentTarget.style.color = "#F9FAFB";
              }}
            >
              Join a Clinic
            </Link>
          </div>

          {/* Framework chain */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-2">
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
                  <span className="text-sm" style={{ color: "#2563EB" }}>
                    →
                  </span>
                )}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
