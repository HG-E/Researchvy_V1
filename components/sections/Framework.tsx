"use client";

import { motion } from "framer-motion";
import { copy } from "@/constants/copy";
import { MobileCarousel } from "@/components/ui/MobileCarousel";

export function Framework() {
  const steps = copy.framework.steps;

  return (
    <section className="py-14 sm:py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#0F172A" }}>
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
            The Framework
          </p>
          <h2
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
          >
            {copy.framework.title}
          </h2>
          <p className="text-base max-w-2xl mx-auto" style={{ color: "#9CA3AF" }}>
            {copy.framework.subtitle}
          </p>
        </motion.div>

        {/* Desktop: horizontal chain */}
        <div className="hidden lg:flex items-start justify-between relative">
          <div className="absolute top-8 left-8 right-8 h-px" style={{ backgroundColor: "#1E293B" }} />
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative flex flex-col items-center text-center"
              style={{ width: `${100 / steps.length}%` }}
            >
              <div
                className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-sm font-bold mb-4 border-2"
                style={{
                  backgroundColor: i === steps.length - 1 ? "#10B981" : "#0F172A",
                  borderColor: i === steps.length - 1 ? "#10B981" : i === 0 ? "#2563EB" : "#1E293B",
                  color: i === steps.length - 1 ? "#fff" : i === 0 ? "#2563EB" : "#9CA3AF",
                }}
              >
                {i + 1}
              </div>
              <p className="text-sm font-semibold mb-1" style={{ color: i === steps.length - 1 ? "#10B981" : "#F9FAFB" }}>
                {step.label}
              </p>
              <p className="text-xs leading-snug px-1" style={{ color: "#9CA3AF" }}>
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Mobile: one-step-at-a-time swipe carousel */}
        <MobileCarousel
          className="lg:hidden"
          items={steps.map((step, i) => (
            <div
              key={step.label}
              className="mx-0.5 rounded-2xl border p-6 flex flex-col items-center text-center"
              style={{ backgroundColor: "#1E293B", borderColor: "#334155" }}
            >
              {/* Step position */}
              <p className="text-xs font-semibold mb-4" style={{ color: "#4B5563" }}>
                Step {i + 1} of {steps.length}
              </p>
              {/* Circle */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold mb-5 border-2"
                style={{
                  backgroundColor: i === steps.length - 1 ? "#10B981" : "#0F172A",
                  borderColor: i === steps.length - 1 ? "#10B981" : i === 0 ? "#2563EB" : "#334155",
                  color: i === steps.length - 1 ? "#fff" : i === 0 ? "#2563EB" : "#9CA3AF",
                }}
              >
                {i + 1}
              </div>
              <p
                className="text-xl font-bold mb-3"
                style={{
                  fontFamily: "var(--font-serif)",
                  color: i === steps.length - 1 ? "#10B981" : "#F9FAFB",
                }}
              >
                {step.label}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>
                {step.description}
              </p>
            </div>
          ))}
        />
      </div>
    </section>
  );
}
