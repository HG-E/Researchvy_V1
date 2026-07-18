import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className="max-w-lg w-full text-center">
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-4"
          style={{ color: "#2563EB" }}
        >
          404: Page Not Found
        </p>
        <h1
          className="text-5xl font-bold mb-4 leading-tight"
          style={{ fontFamily: "var(--font-serif)", color: "#111827", letterSpacing: "-0.02em" }}
        >
          Lost in the<br />
          <span style={{ color: "#10B981" }}>visibility gap</span>
        </h1>
        <p className="text-base leading-relaxed mb-10" style={{ color: "#6B7280" }}>
          This page doesn&apos;t exist. It may have moved, been removed, or the URL
          is incorrect.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: "#2563EB" }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <Link
            href="/insights"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-colors"
            style={{ backgroundColor: "#FFFFFF", color: "#6B7280", border: "1px solid #1E293B" }}
          >
            <Search className="h-4 w-4" />
            Browse Insights
          </Link>
        </div>
        <p className="text-xs mt-10" style={{ color: "#374151" }}>
          Looking for something specific?{" "}
          <Link href="/contact" className="underline" style={{ color: "#6B7280" }}>
            Contact us
          </Link>
        </p>
      </div>
    </div>
  );
}
