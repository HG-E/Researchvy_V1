import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely (clsx + tailwind-merge). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a date string to institutional long format. */
export function formatDate(dateStr: string, options?: Intl.DateTimeFormatOptions): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year:  "numeric",
    month: "long",
    day:   "numeric",
    ...options,
  });
}

/** Format a date range for clinic display. */
export function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  if (s.toDateString() === e.toDateString()) return formatDate(start);
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${s.toLocaleDateString("en-US", { month: "long", day: "numeric" })}–${e.getDate()}, ${e.getFullYear()}`;
  }
  return `${formatDate(start)} – ${formatDate(end)}`;
}

/** Convert words-per-minute estimate to reading time string. */
export function readingTime(content: string, wpm = 238): string {
  const words = content.trim().split(/\s+/).length;
  const mins  = Math.max(1, Math.round(words / wpm));
  return `${mins} min read`;
}

/** Truncate text to a maximum length. */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

/** Generate a slug from a title. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Format a price — free or currency. */
export function formatPrice(price: number, currency = "USD"): string {
  if (price === 0) return "Free";
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(price);
}

/** Wait n milliseconds (use sparingly). */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
