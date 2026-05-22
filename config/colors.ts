export const colors = {
  navy: {
    DEFAULT: "#0F172A",
    light:   "#1E293B",
    dark:    "#0A0F1A",
    50:      "#F0F4FF",
    100:     "#E0E8FF",
  },
  blue: {
    DEFAULT: "#2563EB",
    light:   "#3B82F6",
    dark:    "#1D4ED8",
    50:      "#EFF6FF",
    100:     "#DBEAFE",
  },
  gray: {
    DEFAULT: "#6B7280",
    light:   "#9CA3AF",
    dark:    "#4B5563",
    50:      "#F9FAFB",
    100:     "#F3F4F6",
    200:     "#E5E7EB",
    800:     "#1F2937",
    900:     "#111827",
  },
  green: {
    DEFAULT: "#10B981",
    light:   "#34D399",
    dark:    "#059669",
    50:      "#ECFDF5",
    100:     "#D1FAE5",
  },
  amber:  "#F59E0B",
  red:    "#EF4444",
  white:  "#FFFFFF",
} as const;

export type Colors = typeof colors;
