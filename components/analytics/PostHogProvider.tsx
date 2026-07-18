"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { MotionConfig } from "framer-motion";
import { initPostHog, posthog } from "@/lib/analytics/posthog";
import { getStoredConsent } from "./CookieBanner";

function PageViewTracker() {
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
    if (getStoredConsent() !== "accepted") return;
    posthog.capture("$pageview", { $current_url: window.location.href });
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const consent = getStoredConsent();
    if (consent === "accepted") {
      initPostHog();
    }
    // Listen for consent decisions made this session
    function onConsent(e: Event) {
      const detail = (e as CustomEvent<string>).detail;
      if (detail === "accepted") initPostHog();
      if (detail === "declined" && typeof posthog.opt_out_capturing === "function") {
        posthog.opt_out_capturing();
      }
    }
    window.addEventListener("rv:consent", onConsent);
    return () => window.removeEventListener("rv:consent", onConsent);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <>
        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>
        {children}
      </>
    </MotionConfig>
  );
}
