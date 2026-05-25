"use client";

import { posthog } from "@/lib/analytics/posthog";

export function useAnalytics() {
  function track(event: string, properties?: Record<string, unknown>) {
    try {
      posthog.capture(event, properties);
    } catch {
      // never block UI on analytics failure
    }
  }
  return { track };
}
