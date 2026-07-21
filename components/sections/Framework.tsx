"use client";

import { motion } from "framer-motion";
import { copy } from "@/constants/copy";
import { MobileCarousel } from "@/components/ui/MobileCarousel";
import {
  Search,
  Eye,
  Compass,
  Share2,
  MessageSquare,
  Zap,
  TrendingUp,
} from "lucide-react";

const STEP_COLORS = [
  "#2563EB",
  "#4F46E5",
  "#6366F1",
  "#8B5CF6",
  "#7C3AED",
  "#059669",
  "#10B981",
];

const STEP_CONFIG = [
  { Icon: Search,        tags: ["Literature", "Databases", "Citation"] },
  { Icon: Eye,           tags: ["Open Access", "Indexing", "SEO"] },
  { Icon: Compass,       tags: ["Metadata", "Keywords", "Algorithms"] },
  { Icon: Share2,        tags: ["Networks", "Collaboration", "Communities"] },
  { Icon: MessageSquare, tags: ["Plain Language", "Outreach", "Narrative"] },
  { Icon: Zap,           tags: ["Policy", "Practice", "Innovation"] },
  { Icon: TrendingUp,    tags: ["Citations", "Legacy", "Change"] },
];

export function Framework() {
  const steps = copy.framework.steps;

  return (
    <section className="py-14 sm:py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#FFFFFF" }}>
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
            style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
          >
            {copy.framework.title}
          </h2>
          <p className="text-base max-w-2xl mx-auto" style={{ color: "#4B5563" }}>
            {copy.framework.subtitle}
          </p>
        </motion.div>

        {/* Desktop: horizontal chain with gradient connector line */}
        <div className="hidden lg:flex items-start justify-between relative">
          <div
            className="absolute top-8 left-8 right-8 h-px"
            style={{ background: "linear-gradient(90deg, #2563EB, #6366F1, #10B981)" }}
          />
          {steps.map((step, i) => {
            const color = STEP_COLORS[i] ?? "#10B981";
            return (
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
                    backgroundColor: `${color}12`,
                    borderColor: color,
                    color,
                  }}
                >
                  {i + 1}
                </div>
                <p className="text-sm font-semibold mb-1" style={{ color }}>
                  {step.label}
                </p>
                <p className="text-xs leading-snug px-1" style={{ color: "#4B5563" }}>
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile: swipe carousel */}
        <MobileCarousel
          className="lg:hidden"
          items={steps.map((step, i) => {
            const color = STEP_COLORS[i] ?? "#10B981";
            const { Icon, tags } = STEP_CONFIG[i] ?? { Icon: Search, tags: [] };
            return (
              <div
                key={step.label}
                className="mx-0.5 rounded-2xl border overflow-hidden flex flex-col text-center"
                style={{ backgroundColor: "#F8FAFC", borderColor: `${color}40` }}
              >
                {/* Visual header */}
                <div
                  className="relative flex items-center justify-center"
                  style={{
                    height: 168,
                    background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
                  }}
                >
                  <span
                    className="absolute inset-0 flex items-end justify-end pr-4 pb-2 text-8xl font-black select-none pointer-events-none"
                    style={{ color: `${color}10`, lineHeight: 1 }}
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <Icon
                    className="absolute"
                    style={{ width: 88, height: 88, color: `${color}10` }}
                    aria-hidden="true"
                  />
                  <div
                    className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center border"
                    style={{
                      backgroundColor: `${color}15`,
                      borderColor: `${color}40`,
                    }}
                  >
                    <Icon className="w-8 h-8" style={{ color }} />
                  </div>
                  <div
                    className="absolute top-0 left-0 w-16 h-16 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 0% 0%, ${color}15 0%, transparent 70%)`,
                    }}
                    aria-hidden="true"
                  />
                </div>

                <div
                  className="h-px w-full"
                  style={{ background: `linear-gradient(90deg, transparent, ${color}30, transparent)` }}
                />

                {/* Content */}
                <div className="p-5 flex flex-col items-center flex-1">
                  <p className="text-xs font-semibold mb-3 tracking-widest uppercase" style={{ color: "#4B5563" }}>
                    Step {i + 1} of {steps.length}
                  </p>
                  <p
                    className="text-xl font-bold mb-2"
                    style={{ fontFamily: "var(--font-serif)", color }}
                  >
                    {step.label}
                  </p>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "#4B5563" }}>
                    {step.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 justify-center mt-auto">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${color}12`,
                          color: color,
                          border: `1px solid ${color}25`,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        />
      </div>
    </section>
  );
}
