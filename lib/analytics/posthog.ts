import posthog from "posthog-js";
import { EVENTS } from "./events";

let initialized = false;

export function initPostHog() {
  if (typeof window === "undefined" || initialized) return;
  const key  = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
  if (!key) return;
  posthog.init(key, {
    api_host:          host,
    capture_pageview:  false,
    capture_pageleave: true,
    persistence:       "localStorage",
    autocapture:       true,
  });
  initialized = true;
}

/** Fire a cta_click event with label, section context, and destination. */
export function trackCtaClick(cta_label: string, section: string, destination: string) {
  if (typeof window === "undefined") return;
  posthog.capture(EVENTS.CTA_CLICKED, { cta_label, section, destination });
}

export { posthog };
