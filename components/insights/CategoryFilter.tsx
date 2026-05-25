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
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const active       = searchParams.get("category") ?? "all";

  function select(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") params.delete("category");
    else params.set("category", value);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    // Wrapper provides the fade-mask edges; overflow-hidden clips the fades cleanly
    <div className="relative overflow-hidden">
      {/* Left fade — signals scroll affordance on mobile */}
      <div
        className="absolute left-0 top-0 bottom-0 w-5 pointer-events-none z-10 sm:hidden"
        style={{ background: "linear-gradient(90deg, #080E1A, transparent)" }}
        aria-hidden="true"
      />
      {/* Right fade */}
      <div
        className="absolute right-0 top-0 bottom-0 w-10 pointer-events-none z-10 sm:hidden"
        style={{ background: "linear-gradient(270deg, #080E1A, transparent)" }}
        aria-hidden="true"
      />

      {/* Scrollable pill row — no wrapping, smooth scroll on touch */}
      <div
        className="flex items-center gap-2 overflow-x-auto scroll-hide pb-1"
        style={{ scrollbarWidth: "none" } as React.CSSProperties}
        role="tablist"
        aria-label="Filter articles by category"
      >
        {CATEGORIES.map(({ value, label }) => {
          const isActive = active === value;
          return (
            <button
              key={value}
              role="tab"
              aria-selected={isActive}
              onClick={() => select(value)}
              className="flex-shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-150"
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
    </div>
  );
}
