"use client";

import { BarChart2, GraduationCap, FileImage, Stethoscope, Network } from "lucide-react";
import { MobileCarousel } from "@/components/ui/MobileCarousel";
import { siteConfig } from "@/config/site";

const ICONS = { BarChart2, GraduationCap, FileImage, Stethoscope, Network } as const;

const DIVISION_ACCENTS: Record<string, string> = {
  intelligence: "#2563EB",
  academy:      "#A78BFA",
  media:        "#FCD34D",
  clinics:      "#34D399",
  network:      "#F472B6",
};

export function DivisionsCarousel() {
  const divisions = siteConfig.divisions;

  return (
    <>
      {/* Desktop (sm+): 2-col → 3-col grid */}
      <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-6">
        {divisions.map((division) => {
          const accent = DIVISION_ACCENTS[division.id] ?? "#2563EB";
          const Icon   = ICONS[division.icon as keyof typeof ICONS];
          return (
            <div
              key={division.id}
              className="rounded-2xl p-6 border transition-all duration-300"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${accent}40`; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1E293B"; }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{
                  background: `linear-gradient(135deg, ${accent}30, ${accent}0D)`,
                  border: `1px solid ${accent}25`,
                }}
              >
                <Icon className="h-5 w-5" style={{ color: accent }} />
              </div>
              <h3 className="font-bold text-base mb-1" style={{ color: "#111827" }}>
                {division.name}
              </h3>
              <p className="text-xs mb-3 font-medium" style={{ color: accent }}>
                {division.tagline}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#4B5563" }}>
                {division.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Mobile (< sm): swipe carousel */}
      <MobileCarousel
        className="sm:hidden"
        dotColor="#2563EB"
        items={divisions.map((division) => {
          const accent = DIVISION_ACCENTS[division.id] ?? "#2563EB";
          const Icon   = ICONS[division.icon as keyof typeof ICONS];
          return (
            <div
              key={division.id}
              className="mx-0.5 rounded-2xl border overflow-hidden"
              style={{ backgroundColor: "#FFFFFF", borderColor: `${accent}35` }}
            >
              {/* Gradient header */}
              <div
                className="px-5 pt-5 pb-4"
                style={{ background: `linear-gradient(135deg, ${accent}14 0%, transparent 100%)` }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                  style={{
                    background: `linear-gradient(135deg, ${accent}30, ${accent}10)`,
                    border: `1px solid ${accent}30`,
                  }}
                >
                  <Icon className="h-5 w-5" style={{ color: accent }} />
                </div>
                <h3 className="font-bold text-base leading-snug mb-0.5" style={{ color: "#111827" }}>
                  {division.name}
                </h3>
                <p className="text-xs font-medium leading-snug" style={{ color: accent }}>
                  {division.tagline}
                </p>
              </div>
              <div
                className="h-px"
                style={{ background: `linear-gradient(90deg, ${accent}30, transparent)` }}
              />
              <div className="px-5 py-4">
                <p className="text-sm leading-relaxed" style={{ color: "#4B5563" }}>
                  {division.description}
                </p>
              </div>
            </div>
          );
        })}
      />
    </>
  );
}
