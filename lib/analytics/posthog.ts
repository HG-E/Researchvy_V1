import posthog from "posthog-js";

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

export { posthog };
