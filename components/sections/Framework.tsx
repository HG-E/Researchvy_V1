"use client";

import { motion } from "framer-motion";
import { copy } from "@/constants/copy";

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
          className="text-center mb-16"
        >
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: "#2563EB" }}
          >
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
          <div
            className="absolute top-8 left-8 right-8 h-px"
            style={{ backgroundColor: "#1E293B" }}
          />
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
                  borderColor:
                    i === steps.length - 1
                      ? "#10B981"
                      : i === 0
                      ? "#2563EB"
                      : "#1E293B",
                  color:
                    i === steps.length - 1
                      ? "#fff"
                      : i === 0
                      ? "#2563EB"
                      : "#9CA3AF",
                }}
              >
                {i + 1}
              </div>
              <p
                className="text-sm font-semibold mb-1"
                style={{ color: i === steps.length - 1 ? "#10B981" : "#F9FAFB" }}
              >
                {step.label}
              </p>
              <p className="text-xs leading-snug px-1" style={{ color: "#6B7280" }}>
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Mobile: vertical list */}
        <div className="lg:hidden space-y-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex items-center gap-4 rounded-xl p-4 border"
              style={{ backgroundColor: "#1E293B", borderColor: "#334155" }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{
                  backgroundColor: i === steps.length - 1 ? "#10B981" : "#2563EB",
                  color: "#fff",
                }}
              >
                {i + 1}
              </div>
              <div>
                <p
                  className="font-semibold text-sm"
                  style={{ color: i === steps.length - 1 ? "#10B981" : "#F9FAFB" }}
                >
                  {step.label}
                </p>
                <p className="text-xs" style={{ color: "#9CA3AF" }}>
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
