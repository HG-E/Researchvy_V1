"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";

export function ProfileShareButton({ url, name }: { url: string; name: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard API not available — silently ignore
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-opacity hover:opacity-80"
      style={{ backgroundColor: "rgba(107,114,128,0.12)", color: "#4B5563" }}
      aria-label={`Copy ${name}'s profile link`}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5" style={{ color: "#10B981" }} />
      ) : (
        <Link2 className="h-3.5 w-3.5" />
      )}
      {copied ? "Copied!" : "Share"}
    </button>
  );
}
