"use client";

import { Search, Eye, Compass, Share2, MessageSquare, Zap, TrendingUp } from "lucide-react";
import { MobileCarousel } from "@/components/ui/MobileCarousel";
import { siteConfig } from "@/config/site";

const STEP_COLORS = [
  "#2563EB", // Research
  "#4F46E5", // Visibility
  "#6366F1", // Discoverability
  "#8B5CF6", // Connection
  "#A78BFA", // Communication
  "#34D399", // Application
  "#10B981", // Impact
];

const STEP_ICONS = [Search, Eye, Compass, Share2, MessageSquare, Zap, TrendingUp];

const STEP_DESCRIPTIONS: Record<string, string> = {
  Research:        "The scholarly work that forms the foundation of all visibility.",
  Visibility:      "Ensuring your research is findable across all major platforms.",
  Discoverability: "Optimising your research for how discovery systems actually work.",
  Connection:      "Linking your work to the communities and scholars who need it.",
  Communication:   "Translating complex findings for broader academic and public audiences.",
  Application:     "Bridging your research to real-world policy and practice.",
  Impact:          "Achieving measurable societal and scholarly change.",
};

export function FrameworkCarousel() {
  const steps = siteConfig.framework as readonly string[];

  return (
    <>
      {/* Desktop (lg+): vertical list with color journey */}
      <div className="hidden lg:block space-y-2">
        {steps.map((step, i) => {
          const color = STEP_COLORS[i] ?? "#10B981";
          const Icon  = STEP_ICONS[i]  ?? TrendingUp;
          return (
            <div
              key={step}
              className="flex items-center gap-3 rounded-xl px-4 py-3 border"
              style={{ backgroundColor: "#1E293B", borderColor: `${color}28` }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${color}30, ${color}10)`,
                  border: `1px solid ${color}35`,
                }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color }} />
              </div>
              <span className="text-sm font-semibold" style={{ color }}>
                {step}
              </span>
              <span className="ml-auto text-xs font-mono" style={{ color: `${color}50` }}>
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile (< lg): full swipe carousel */}
      <MobileCarousel
        className="lg:hidden"
        dotColor="#2563EB"
        items={steps.map((step, i) => {
          const color = STEP_COLORS[i] ?? "#10B981";
          const Icon  = STEP_ICONS[i]  ?? TrendingUp;
          return (
            <div
              key={step}
              className="mx-0.5 rounded-2xl border overflow-hidden"
              style={{ borderColor: `${color}40` }}
            >
              {/* Visual header */}
              <div
                className="relative flex items-center justify-center"
                style={{
                  height: 140,
                  background: `linear-gradient(135deg, ${color}25 0%, ${color}06 100%)`,
                }}
              >
                <span
                  className="absolute inset-0 flex items-end justify-end pr-4 pb-1 text-7xl font-black select-none pointer-events-none"
                  style={{ color: `${color}12`, lineHeight: 1 }}
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Icon
                  className="absolute"
                  style={{ width: 72, height: 72, color: `${color}12` }}
                  aria-hidden="true"
                />
                <div
                  className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center border"
                  style={{ backgroundColor: `${color}20`, borderColor: `${color}50` }}
                >
                  <Icon className="w-7 h-7" style={{ color }} />
                </div>
                <div
                  className="absolute top-0 left-0 w-14 h-14 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 0% 0%, ${color}20 0%, transparent 70%)` }}
                  aria-hidden="true"
                />
              </div>
              <div
                className="h-px w-full"
                style={{ background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }}
              />
              <div className="p-5 text-center" style={{ backgroundColor: "#1E293B" }}>
                <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#4B5563" }}>
                  Step {i + 1} of {steps.length}
                </p>
                <p
                  className="text-xl font-bold mb-2"
                  style={{ fontFamily: "var(--font-serif)", color }}
                >
                  {step}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>
                  {STEP_DESCRIPTIONS[step] ?? ""}
                </p>
              </div>
            </div>
          );
        })}
      />
    </>
  );
}
