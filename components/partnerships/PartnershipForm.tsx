"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, Send } from "lucide-react";

const RESEARCHER_COUNTS = [
  "Under 50",
  "50–200",
  "200–500",
  "500–1,000",
  "Over 1,000",
];

const INTEREST_AREAS = [
  "Institutional Visibility Audit",
  "Staff Development Programme (Academy)",
  "Discounted Clinic Access for Staff/Students",
  "Strategic Partnership (full scope)",
  "Not sure — want to discuss",
];

const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#1E293B",
  borderColor: "#334155",
  color: "#F9FAFB",
  borderRadius: "0.75rem",
  padding: "12px 14px",
  /* 16px minimum prevents iOS Safari auto-zoom on input focus */
  fontSize: "16px",
  outline: "none",
  border: "1px solid #334155",
  boxSizing: "border-box" as const,
};

export function PartnershipForm() {
  const [form, setForm] = useState({
    contact_name:     "",
    contact_email:    "",
    institution:      "",
    researcher_count: "",
    interest_area:    "",
    message:          "",
  });
  const [status,  setStatus]  = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/partnerships", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submission failed");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div
        className="rounded-2xl border p-8"
        style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
      >
        <div className="flex items-start gap-4">
          <CheckCircle2 className="h-6 w-6 flex-shrink-0 mt-0.5" style={{ color: "#10B981" }} />
          <div>
            <p className="text-base font-bold mb-2" style={{ color: "#F9FAFB" }}>Enquiry received.</p>
            <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
              We&apos;ll review your enquiry and reach out within 24 hours to discuss how Researchvy
              can support your institution&apos;s research visibility goals.
            </p>
            <p className="text-xs mt-3" style={{ color: "#374151" }}>
              Check your inbox for a confirmation email.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border p-8 space-y-5"
      style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
    >
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#60A5FA" }}>
          Partnership Enquiry
        </p>
        <h3 className="text-xl font-bold" style={{ color: "#F9FAFB" }}>
          Tell us about your institution
        </h3>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          We respond within 24 hours. Every enquiry gets a direct, personal response.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "#9CA3AF" }}>
            Your name <span style={{ color: "#EF4444" }}>*</span>
          </label>
          <input
            type="text"
            required
            value={form.contact_name}
            onChange={(e) => update("contact_name", e.target.value)}
            placeholder="Dr. Jane Smith"
            style={INPUT_STYLE}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "#9CA3AF" }}>
            Email <span style={{ color: "#EF4444" }}>*</span>
          </label>
          <input
            type="email"
            required
            value={form.contact_email}
            onChange={(e) => update("contact_email", e.target.value)}
            placeholder="jane@university.edu"
            style={INPUT_STYLE}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: "#9CA3AF" }}>
          Institution / Organisation <span style={{ color: "#EF4444" }}>*</span>
        </label>
        <input
          type="text"
          required
          value={form.institution}
          onChange={(e) => update("institution", e.target.value)}
          placeholder="University of Lagos"
          style={INPUT_STYLE}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "#9CA3AF" }}>
            Number of researchers <span style={{ color: "#EF4444" }}>*</span>
          </label>
          <select
            required
            value={form.researcher_count}
            onChange={(e) => update("researcher_count", e.target.value)}
            style={{ ...INPUT_STYLE, cursor: "pointer" }}
          >
            <option value="" disabled>Select range…</option>
            {RESEARCHER_COUNTS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "#9CA3AF" }}>
            Primary interest <span style={{ color: "#EF4444" }}>*</span>
          </label>
          <select
            required
            value={form.interest_area}
            onChange={(e) => update("interest_area", e.target.value)}
            style={{ ...INPUT_STYLE, cursor: "pointer" }}
          >
            <option value="" disabled>Select…</option>
            {INTEREST_AREAS.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: "#9CA3AF" }}>
          Anything else you&apos;d like us to know? (optional)
        </label>
        <textarea
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          rows={4}
          placeholder="Your current challenges, timeline, specific departments, or questions…"
          style={{ ...INPUT_STYLE, resize: "vertical" }}
        />
      </div>

      {status === "error" && (
        <p className="text-sm" style={{ color: "#F87171" }}>{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white transition-all active:scale-[0.97] disabled:opacity-60"
        style={{ backgroundColor: "#2563EB" }}
      >
        {status === "loading" ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
        ) : (
          <><Send className="h-4 w-4" /> Send Enquiry</>
        )}
      </button>
      <p className="text-xs" style={{ color: "#374151" }}>
        We respond within 24 hours. Your information is never shared.
      </p>
    </form>
  );
}
