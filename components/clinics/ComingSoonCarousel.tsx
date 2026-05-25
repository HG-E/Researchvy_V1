"use client";

import { Bell } from "lucide-react";
import { MobileCarousel } from "@/components/ui/MobileCarousel";
import { buildWhatsAppUrl } from "@/config/site";

const COMING_SOON = [
  {
    name:    "Institutional Visibility Audit Clinic",
    tagline: "For research offices and university departments",
    icon:    "🏛️",
    color:   "#60A5FA",
  },
  {
    name:    "Scholarly Communication Clinic",
    tagline: "Research translation, visual abstracts, and public engagement",
    icon:    "📡",
    color:   "#A78BFA",
  },
  {
    name:    "Research Impact Strategy Clinic",
    tagline: "Bibliometrics, citation intelligence, and impact measurement",
    icon:    "📊",
    color:   "#34D399",
  },
];

export function ComingSoonCarousel() {
  return (
    <>
      {/* Desktop (sm+): 3-col grid — unchanged */}
      <div className="hidden sm:grid grid-cols-3 gap-4">
        {COMING_SOON.map(({ name, tagline, icon }) => (
          <div
            key={name}
            className="rounded-2xl border p-6 opacity-60"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            <p className="text-2xl mb-3">{icon}</p>
            <p className="text-sm font-semibold mb-1" style={{ color: "#F9FAFB" }}>{name}</p>
            <p className="text-xs leading-relaxed mb-4" style={{ color: "#6B7280" }}>{tagline}</p>
            <a
              href={buildWhatsAppUrl(`${name}, register interest`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors hover:bg-[#1E3A2F]"
              style={{ backgroundColor: "#1E293B", color: "#10B981", border: "1px solid rgba(16,185,129,0.2)" }}
            >
              <Bell className="h-3 w-3" />
              Notify Me
            </a>
          </div>
        ))}
      </div>

      {/* Mobile (< sm): auto-playing swipe carousel */}
      <MobileCarousel
        className="sm:hidden"
        autoPlay
        autoPlayDelay={5000}
        dotColor="#10B981"
        items={COMING_SOON.map(({ name, tagline, icon, color }) => (
          <div
            key={name}
            className="mx-0.5 rounded-2xl border p-6"
            style={{ backgroundColor: "#0F172A", borderColor: `${color}30` }}
          >
            {/* Colored top accent */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4"
              style={{ backgroundColor: `${color}15`, border: `1px solid ${color}25` }}
            >
              {icon}
            </div>
            <p className="text-sm font-semibold mb-1.5" style={{ color: "#F9FAFB" }}>{name}</p>
            <p className="text-xs leading-relaxed mb-5" style={{ color: "#6B7280" }}>{tagline}</p>
            <a
              href={buildWhatsAppUrl(`${name}, register interest`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
              style={{ backgroundColor: "#1E293B", color: "#10B981", border: "1px solid rgba(16,185,129,0.2)" }}
            >
              <Bell className="h-3 w-3" />
              Notify Me
            </a>
          </div>
        ))}
      />
    </>
  );
}
