"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, LayoutDashboard } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin-error]", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#EF4444" }}>
          Admin Error
        </p>
        <h2
          className="text-2xl font-bold mb-3"
          style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
        >
          Page failed to load
        </h2>
        <p className="text-sm mb-8 leading-relaxed" style={{ color: "#6B7280" }}>
          An error occurred in this admin section. Try refreshing or return to the overview.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: "#2563EB" }}
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors"
            style={{ backgroundColor: "#0F172A", color: "#9CA3AF", border: "1px solid #1E293B" }}
          >
            <LayoutDashboard className="h-4 w-4" />
            Admin Overview
          </Link>
        </div>
        {error.digest && (
          <p className="text-xs mt-6 font-mono" style={{ color: "#374151" }}>
            Ref: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
