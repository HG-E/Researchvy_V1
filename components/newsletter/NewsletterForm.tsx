"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, Mail } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { EVENTS } from "@/lib/analytics/events";

interface NewsletterFormProps {
  variant?: "inline" | "card";
  resourceTitle?: string;
  redirectTo?: string;
}

export function NewsletterForm({ variant = "inline", resourceTitle, redirectTo }: NewsletterFormProps) {
  const { track } = useAnalytics();
  const [email,   setEmail]   = useState("");
  const [status,  setStatus]  = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email }),
      });
      if (res.ok) {
        track(EVENTS.NEWSLETTER_SUBSCRIBED, { resource: resourceTitle ?? "general" });
        setStatus("success");
        setMessage(resourceTitle
          ? `We'll send "${resourceTitle}" to ${email} within 24 hours.`
          : "You're subscribed! Check your inbox for a welcome email.");
      } else {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please check your connection.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col gap-3 rounded-xl p-4" style={{ backgroundColor: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: "#10B981" }} />
          <p className="text-sm leading-relaxed" style={{ color: "#10B981" }}>{message}</p>
        </div>
        {redirectTo && (
          <a
            href={redirectTo}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white w-fit transition-all duration-200"
            style={{ backgroundColor: "#10B981" }}
          >
            Open Your Scorecard Now →
          </a>
        )}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="rounded-2xl border p-8" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(37,99,235,0.1)" }}>
            <Mail className="h-5 w-5" style={{ color: "#2563EB" }} />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: "#F9FAFB" }}>Free Resources by Email</p>
            <p className="text-xs" style={{ color: "#6B7280" }}>No spam, scholarly visibility insights only</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 rounded-xl px-4 py-2.5 text-sm border outline-none"
            style={{ backgroundColor: "#1E293B", borderColor: "#334155", color: "#F9FAFB" }}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60 flex items-center gap-2"
            style={{ backgroundColor: "#2563EB" }}
            onMouseEnter={(e) => { if (status !== "loading") e.currentTarget.style.backgroundColor = "#1D4ED8"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#2563EB"; }}
          >
            {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
          </button>
        </form>
        {status === "error" && (
          <p className="text-xs mt-2" style={{ color: "#F87171" }}>{message}</p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        required
        className="flex-1 rounded-xl px-4 py-2.5 text-sm border outline-none"
        style={{ backgroundColor: "#1E293B", borderColor: "#334155", color: "#F9FAFB" }}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60 whitespace-nowrap flex items-center gap-2"
        style={{ backgroundColor: "#2563EB" }}
        onMouseEnter={(e) => { if (status !== "loading") e.currentTarget.style.backgroundColor = "#1D4ED8"; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#2563EB"; }}
      >
        {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get Access"}
      </button>
    </form>
  );
}
