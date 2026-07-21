"use client";

import { useState } from "react";

export function WaitlistForm({ clinicSlug }: { clinicSlug: string }) {
  const [name,   setName]   = useState("");
  const [email,  setEmail]  = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error,  setError]  = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res  = await fetch("/api/waitlist", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name, email, clinicSlug }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setStatus("error");
      } else {
        setStatus("done");
      }
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="shrink-0">
        <div
          className="rounded-2xl border px-5 py-4 text-center lg:text-right"
          style={{ backgroundColor: "rgba(16,185,129,0.06)", borderColor: "rgba(16,185,129,0.2)" }}
        >
          <p className="text-sm font-bold mb-1" style={{ color: "#10B981" }}>
            You're on the waitlist
          </p>
          <p className="text-xs" style={{ color: "#4B5563" }}>
            We'll email you when the next cohort opens.
          </p>
        </div>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    borderColor:     "#D1D5DB",
    color:           "#111827",
    backgroundColor: "#FFFFFF",
  };

  return (
    <div className="shrink-0" style={{ minWidth: 260 }}>
      <p className="text-xs font-semibold mb-3" style={{ color: "#4B5563" }}>
        Get notified when the next cohort opens:
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={status === "loading"}
          className="rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-60"
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === "loading"}
          className="rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-60"
          style={inputStyle}
        />
        {status === "error" && (
          <p className="text-xs" style={{ color: "#EF4444" }}>{error}</p>
        )}
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-xl px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: "#2563EB" }}
        >
          {status === "loading" ? "Joining…" : "Join the Waitlist"}
        </button>
      </form>
    </div>
  );
}
