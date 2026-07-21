import type { EventType, EventFormat } from "@/types/event";

const TYPE_CONFIG: Record<EventType, { label: string; color: string; bg: string }> = {
  conference:  { label: "Conference",  color: "#818CF8", bg: "rgba(129,140,248,0.12)" },
  seminar:     { label: "Seminar",     color: "#34D399", bg: "rgba(52,211,153,0.12)"  },
  workshop:    { label: "Workshop",    color: "#FB923C", bg: "rgba(251,146,60,0.12)"  },
  symposium:   { label: "Symposium",   color: "#A78BFA", bg: "rgba(167,139,250,0.12)" },
  webinar:     { label: "Webinar",     color: "#22D3EE", bg: "rgba(34,211,238,0.12)"  },
  lecture:     { label: "Lecture",     color: "#FBBF24", bg: "rgba(251,191,36,0.12)"  },
  panel:       { label: "Panel",       color: "#F472B6", bg: "rgba(244,114,182,0.12)" },
  hackathon:   { label: "Hackathon",   color: "#4ADE80", bg: "rgba(74,222,128,0.12)"  },
  other:       { label: "Other",       color: "#4B5563", bg: "rgba(148,163,184,0.12)" },
};

const FORMAT_CONFIG: Record<EventFormat, { label: string }> = {
  "in-person": { label: "In-Person" },
  virtual:     { label: "Virtual"   },
  hybrid:      { label: "Hybrid"    },
};

export function EventTypeBadge({ type }: { type: EventType }) {
  const cfg = TYPE_CONFIG[type] ?? TYPE_CONFIG.other;
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize"
      style={{ backgroundColor: cfg.bg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  );
}

export function EventFormatBadge({ format }: { format: EventFormat }) {
  const cfg = FORMAT_CONFIG[format];
  const color =
    format === "virtual"    ? "#22D3EE" :
    format === "hybrid"     ? "#FB923C" :
    "#94A3B8";
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold"
      style={{ backgroundColor: `${color}14`, color }}
    >
      {cfg.label}
    </span>
  );
}

export { TYPE_CONFIG };
