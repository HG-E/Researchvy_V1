"use client";

import { motion } from "framer-motion";
import { AlertCircle, ArrowRight } from "lucide-react";
import { copy } from "@/constants/copy";
import { MobileCarousel } from "@/components/ui/MobileCarousel";

const containerVariants = {
  hidden:   {},
  visible:  { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden:  { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

export function VisibilityGap() {
  const problems = copy.visibilityGap.problems;

  return (
    <section className="py-14 sm:py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#080E1A" }}>
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left — intro copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#2563EB" }}>
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
              style={{
                backgroundColor: "rgba(16,185,129,0.04)",
                borderColor: "rgba(16,185,129,0.28)",
              }}
            >
              <p className="flex items-center gap-2 text-sm font-semibold mb-2" style={{ color: "#F9FAFB" }}>
                <ArrowRight className="h-4 w-4 flex-shrink-0" style={{ color: "#10B981" }} />
                The Researchvy Framework bridges every gap:
              </p>
              <p className="text-sm leading-relaxed pl-6" style={{ color: "#9CA3AF" }}>
                Research → Visibility → Discoverability → Connection → Communication → Application →{" "}
                <span style={{ color: "#10B981" }}>Impact</span>
              </p>
            </div>
          </motion.div>

          {/* Right — mobile: swipe carousel | desktop: staggered list */}
          <div>
            {/* Mobile carousel — numbered + accent-striped cards */}
            <MobileCarousel
              className="lg:hidden"
              dotColor="#EF4444"
              items={problems.map((problem, i) => (
                <div
                  key={i}
                  className="relative flex items-start gap-4 rounded-xl p-5 border mx-0.5 overflow-hidden"
                  style={{ backgroundColor: "#0F172A", borderColor: "#1E293B", minHeight: 90 }}
                >
                  {/* Left accent stripe */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-0.5"
                    style={{ backgroundColor: "#EF4444" }}
                  />
                  {/* Problem number */}
                  <span
                    className="absolute top-3 right-3 text-xs font-bold tabular-nums"
                    style={{ color: "#374151" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: "#EF4444" }} />
                  <span className="text-sm font-medium leading-relaxed pr-6" style={{ color: "#D1D5DB" }}>
                    {problem}
                  </span>
                </div>
              ))}
            />

            {/* Desktop animated list — with accent left border */}
            <motion.ul
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-4 hidden lg:block"
            >
              {problems.map((problem, i) => (
                <motion.li
                  key={i}
                  variants={itemVariants}
                  className="relative flex items-start gap-4 rounded-xl p-5 border overflow-hidden"
                  style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 w-0.5"
                    style={{ backgroundColor: "#EF4444" }}
                  />
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: "#EF4444" }} />
                  <span className="text-sm font-medium leading-relaxed" style={{ color: "#D1D5DB" }}>
                    {problem}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </div>

        </div>
      </div>
    </section>
  );
}
