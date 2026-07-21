"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const CONSENT_KEY = "rv_analytics_consent";

export type ConsentValue = "accepted" | "declined" | null;

export function getStoredConsent(): ConsentValue {
  if (typeof window === "undefined") return null;
  return (localStorage.getItem(CONSENT_KEY) as ConsentValue) ?? null;
}

export function setStoredConsent(value: "accepted" | "declined") {
  localStorage.setItem(CONSENT_KEY, value);
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getStoredConsent()) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  function accept() {
    setStoredConsent("accepted");
    setVisible(false);
    window.dispatchEvent(new CustomEvent("rv:consent", { detail: "accepted" }));
  }

  function decline() {
    setStoredConsent("declined");
    setVisible(false);
    window.dispatchEvent(new CustomEvent("rv:consent", { detail: "declined" }));
  }

  if (!visible) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 sm:px-6"
    >
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Analytics consent"
    >
      <div
        className="mx-auto max-w-3xl rounded-2xl border p-5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4"
        style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold mb-1" style={{ color: "#111827" }}>
            We use privacy-friendly analytics
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "#4B5563" }}>
            We use PostHog to understand how visitors use Researchvy. No cookies are set — data is stored locally in your browser only.{" "}
            <Link href="/privacy" className="underline" style={{ color: "#60A5FA" }}>
              Privacy policy
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 rounded-xl text-xs font-semibold border transition-colors"
            style={{ borderColor: "#E2E8F0", color: "#4B5563" }}
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white transition-colors"
            style={{ backgroundColor: "#2563EB" }}
          >
            Accept
          </button>
          <button
            onClick={() => setVisible(false)}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "#4B5563" }}
            aria-label="Dismiss for now"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
