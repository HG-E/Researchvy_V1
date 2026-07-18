"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, ArrowLeft } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error monitoring if configured (e.g. Sentry)
    console.error(error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className="max-w-lg w-full text-center">
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-4"
          style={{ color: "#EF4444" }}
        >
          Something went wrong
        </p>
        <h1
          className="text-4xl font-bold mb-4 leading-tight"
          style={{ fontFamily: "var(--font-serif)", color: "#111827", letterSpacing: "-0.02em" }}
        >
          Unexpected error
        </h1>
        <p className="text-base leading-relaxed mb-10" style={{ color: "#6B7280" }}>
          An error occurred while loading this page. This has been logged, please try again
          or return home.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: "#2563EB" }}
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-colors"
            style={{ backgroundColor: "#FFFFFF", color: "#6B7280", border: "1px solid #1E293B" }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
        {error.digest && (
          <p className="text-xs mt-8 font-mono" style={{ color: "#374151" }}>
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
