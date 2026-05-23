"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { InsightCategory } from "@/types";

const CATEGORIES: { value: InsightCategory | "all"; label: string }[] = [
  { value: "all",                        label: "All" },
  { value: "scholarly-visibility",       label: "Scholarly Visibility" },
  { value: "research-intelligence",      label: "Research Intelligence" },
  { value: "scholarly-communication",    label: "Scholarly Communication" },
  { value: "modern-scholarly-systems",   label: "Modern Scholarly Systems" },
  { value: "institutional-positioning",  label: "Institutional Positioning" },
];

export function CategoryFilter() {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams = useSearchParams();
  const active      = searchParams.get("category") ?? "all";

  function select(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") params.delete("category");
    else params.set("category", value);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {CATEGORIES.map(({ value, label }) => {
        const isActive = active === value;
        return (
          <button
            key={value}
            onClick={() => select(value)}
            className="rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-150"
            style={{
              backgroundColor: isActive ? "#2563EB" : "#1E293B",
              color:           isActive ? "#fff"     : "#9CA3AF",
              border:          `1px solid ${isActive ? "#2563EB" : "#334155"}`,
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
