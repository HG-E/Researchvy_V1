"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";

interface LeadCaptureWidgetProps {
  articleTitle?: string;
}

export function LeadCaptureWidget({ articleTitle }: LeadCaptureWidgetProps) {
  const [firstName, setFirstName] = useState("");
  const [email,     setEmail]     = useState("");
  const [status,    setStatus]    = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg,  setErrorMsg]  = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/leads", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          first_name:    firstName,
          article_title: articleTitle,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error ?? "Something went wrong. Please try again.");
        setStatus("error");
      } else {
        setStatus("done");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div
        className="rounded-2xl border p-8"
        style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="h-8 w-8 flex-shrink-0" style={{ color: "#10B981" }} />
          <div>
            <h3 className="text-base font-bold" style={{ color: "#111827" }}>
              Check your inbox, {firstName}.
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
              Your Researcher Visibility Guide is on its way.
            </p>
          </div>
        </div>
        <div className="pt-4 border-t" style={{ borderColor: "#E2E8F0" }}>
          <p className="text-xs mb-3" style={{ color: "#6B7280" }}>
            While you wait — find out your exact visibility score:
          </p>
          <a
            href="/resources/visibility-scorecard"
            className="inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-bold text-white"
            style={{ backgroundColor: "#10B981" }}
          >
            Take the Scorecard Free →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0", borderLeft: "3px solid #2563EB" }}
    >
      <div className="px-8 py-8">
        <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#2563EB" }}>
          Free Resource
        </p>
        <h3
          className="text-xl font-bold mb-2 leading-tight"
          style={{ fontFamily: "var(--font-serif)", color: "#111827" }}
        >
          Get the Researcher Visibility Guide
        </h3>
        <p className="text-sm mb-6 leading-relaxed" style={{ color: "#6B7280" }}>
          The 5 levers every cited, globally-discovered researcher uses — delivered free to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="rounded-xl px-4 py-2.5 text-sm border outline-none flex-1 min-w-0 focus:ring-1 focus:ring-[#2563EB]"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#CBD5E1", color: "#111827" }}
          />
          <input
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl px-4 py-2.5 text-sm border outline-none flex-[2] min-w-0 focus:ring-1 focus:ring-[#2563EB]"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#CBD5E1", color: "#111827" }}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 whitespace-nowrap flex-shrink-0"
            style={{ backgroundColor: "#2563EB" }}
          >
            {status === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>Get the guide <ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </form>

        {status === "error" && (
          <p className="mt-3 text-xs" style={{ color: "#F87171" }}>{errorMsg}</p>
        )}

        <p className="mt-3 text-xs" style={{ color: "#374151" }}>
          No spam. One email, pure value. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
