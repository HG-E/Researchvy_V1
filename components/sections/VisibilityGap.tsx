"use client";

import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { copy } from "@/constants/copy";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

export function VisibilityGap() {
  return (
    <section className="py-14 sm:py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#080E1A" }}>
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-3"
              style={{ color: "#2563EB" }}
            >
              The Problem
            </p>
            <h2
              className="text-4xl sm:text-5xl font-bold mb-6 leading-tight"
              style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
            >
              {copy.visibilityGap.title}
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: "#9CA3AF" }}>
              {copy.visibilityGap.subtitle}
            </p>
            <div
              className="rounded-xl p-6 border"
              style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
            >
              <p className="text-sm font-semibold mb-2" style={{ color: "#F9FAFB" }}>
                The Researchvy Framework bridges every gap:
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>
                Research → Visibility → Discoverability → Connection → Communication → Application →{" "}
                <span style={{ color: "#10B981" }}>Impact</span>
              </p>
            </div>
          </motion.div>

          {/* Right */}
          <motion.ul
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-4"
          >
            {copy.visibilityGap.problems.map((problem, i) => (
              <motion.li
                key={i}
                variants={itemVariants}
                className="flex items-start gap-4 rounded-xl p-5 border"
                style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
              >
                <AlertCircle
                  className="h-5 w-5 mt-0.5 flex-shrink-0"
                  style={{ color: "#EF4444" }}
                />
                <span className="text-sm font-medium leading-relaxed" style={{ color: "#D1D5DB" }}>
                  {problem}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
