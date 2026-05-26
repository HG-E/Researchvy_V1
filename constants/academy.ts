export const LEVEL_COLORS = [
  "#60A5FA",
  "#A78BFA",
  "#34D399",
  "#FCD34D",
  "#F472B6",
] as const;

export const LEVEL_LABELS = [
  "Foundational Visibility",
  "Research Metrics & Intelligence",
  "Advanced Research Intelligence",
  "Scholarly Communication",
  "Open & Future Scholarship",
] as const;

export function levelColor(level: number): string {
  return LEVEL_COLORS[(Math.max(1, Math.min(5, level)) - 1) as 0 | 1 | 2 | 3 | 4];
}
