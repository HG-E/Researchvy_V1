"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, AlertCircle } from "lucide-react";
import type { OpportunityCategory } from "@/types/opportunity";
import { useAnalytics } from "@/hooks/useAnalytics";
import { EVENTS } from "@/lib/analytics/events";

const CATEGORIES: { value: OpportunityCategory; label: string; hint: string }[] = [
  { value: "grant",          label: "Grant",                   hint: "Research funding award" },
  { value: "fellowship",     label: "Fellowship",              hint: "Residential or stipend-based programme" },
  { value: "conference",     label: "Call for Papers",         hint: "CFP / abstract submission for a conference" },
  { value: "speaking",       label: "Call for Speakers",       hint: "Speaker invitation or proposal" },
  { value: "collaboration",  label: "Collaboration Call",      hint: "Joint research or multi-PI proposal" },
  { value: "job",            label: "Job / Position",          hint: "Postdoc, faculty, or research role" },
  { value: "award",          label: "Award / Prize",           hint: "Recognitions, prizes, distinctions" },
  { value: "travel-grant",   label: "Travel Grant / Bursary",  hint: "Funded travel to attend a conference or workshop" },
  { value: "other",          label: "Other",                   hint: "Doesn't fit the above" },
];

const LEVELS = [
  { value: "early_career", label: "Early-Career Researchers" },
  { value: "mid",          label: "Mid-Career Researchers" },
  { value: "senior",       label: "Senior Researchers" },
  { value: "all",          label: "All Levels" },
];

type FormState = "form" | "submitting" | "success" | "error";

export function OpportunitySubmitForm() {
  const { track } = useAnalytics();

  const [state, setState] = useState<FormState>("form");
  const [error, setError] = useState("");

  const [title,        setTitle]        = useState("");
  const [category,     setCategory]     = useState<OpportunityCategory>("grant");
  const [funder,       setFunder]       = useState("");
  const [value,        setValue]        = useState("");
  const [deadline,     setDeadline]     = useState("");
  const [applyUrl,     setApplyUrl]     = useState("");
  const [targetLevel,  setTargetLevel]  = useState("all");
  const [body,         setBody]         = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setState("submitting");

    const res = await fetch("/api/opportunities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title:        title.trim(),
        body:         body.trim(),
        category,
        funder:       funder.trim()  || undefined,
        value:        value.trim()   || undefined,
        deadline:     deadline       || undefined,
        apply_url:    applyUrl.trim(),
        target_level: targetLevel,
      }),
    });

    const json = await res.json();
    if (!res.ok) {
      setError(json.error ?? "Something went wrong. Please try again.");
      setState("error");
      return;
    }
    track(EVENTS.OPPORTUNITY_SUBMITTED, { category });
    setState("success");
  }

  if (state === "success") {
    return (
      <div className="rounded-2xl border p-10 text-center" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
        <div className="flex items-center justify-center mb-4">
          <CheckCircle className="h-12 w-12" style={{ color: "#10B981" }} />
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: "#F9FAFB" }}>Submission received</h2>
        <p className="text-sm mb-6" style={{ color: "#9CA3AF" }}>
          Our team will review it within 48 hours. You will receive an email when it is live.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link href="/opportunities"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            style={{ backgroundColor: "#1E293B", color: "#F9FAFB" }}>
            Browse Opportunities
          </Link>
          <Link href="/dashboard/opportunities"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            style={{ backgroundColor: "#2563EB", color: "#fff" }}>
            My Submissions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error banner */}
      {state === "error" && (
        <div className="rounded-xl border p-4 flex items-start gap-3"
          style={{ backgroundColor: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.2)" }}>
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "#EF4444" }} />
          <p className="text-sm" style={{ color: "#FCA5A5" }}>{error}</p>
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: "#9CA3AF" }}>
          Opportunity Title <span style={{ color: "#EF4444" }}>*</span>
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="e.g. TWAS Research Grants Programme 2025"
          className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors"
          style={{ backgroundColor: "#1E293B", border: "1px solid #334155", color: "#F9FAFB" }}
          onFocus={(e) => { e.target.style.borderColor = "#2563EB"; }}
          onBlur={(e)  => { e.target.style.borderColor = "#334155"; }}
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-semibold mb-2" style={{ color: "#9CA3AF" }}>
          Category <span style={{ color: "#EF4444" }}>*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategory(cat.value)}
              className="text-left rounded-xl px-4 py-3 border transition-colors"
              style={{
                backgroundColor: category === cat.value ? "rgba(37,99,235,0.12)" : "#1E293B",
                borderColor:     category === cat.value ? "#2563EB" : "#334155",
                color:           category === cat.value ? "#60A5FA" : "#9CA3AF",
              }}
            >
              <p className="text-sm font-medium" style={{ color: category === cat.value ? "#60A5FA" : "#F9FAFB" }}>{cat.label}</p>
              <p className="text-[11px] mt-0.5">{cat.hint}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Funder + Value */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#9CA3AF" }}>Funder / Organisation</label>
          <input
            value={funder}
            onChange={(e) => setFunder(e.target.value)}
            placeholder="e.g. TWAS, Wellcome Trust"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors"
            style={{ backgroundColor: "#1E293B", border: "1px solid #334155", color: "#F9FAFB" }}
            onFocus={(e) => { e.target.style.borderColor = "#2563EB"; }}
            onBlur={(e)  => { e.target.style.borderColor = "#334155"; }}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#9CA3AF" }}>Value / Stipend</label>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. $10,000 · Travel funded · Stipend"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors"
            style={{ backgroundColor: "#1E293B", border: "1px solid #334155", color: "#F9FAFB" }}
            onFocus={(e) => { e.target.style.borderColor = "#2563EB"; }}
            onBlur={(e)  => { e.target.style.borderColor = "#334155"; }}
          />
        </div>
      </div>

      {/* Deadline + Target Level */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#9CA3AF" }}>Application Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors"
            style={{ backgroundColor: "#1E293B", border: "1px solid #334155", color: "#F9FAFB" }}
            onFocus={(e) => { e.target.style.borderColor = "#2563EB"; }}
            onBlur={(e)  => { e.target.style.borderColor = "#334155"; }}
          />
          <p className="text-[11px] mt-1" style={{ color: "#4B5563" }}>Leave blank for rolling deadlines</p>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#9CA3AF" }}>Target Career Level</label>
          <select
            value={targetLevel}
            onChange={(e) => setTargetLevel(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors"
            style={{ backgroundColor: "#1E293B", border: "1px solid #334155", color: "#F9FAFB" }}
          >
            {LEVELS.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Apply URL */}
      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: "#9CA3AF" }}>
          Application / Details URL <span style={{ color: "#EF4444" }}>*</span>
        </label>
        <input
          value={applyUrl}
          onChange={(e) => setApplyUrl(e.target.value)}
          required
          type="url"
          placeholder="https://example.org/apply"
          className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors font-mono"
          style={{ backgroundColor: "#1E293B", border: "1px solid #334155", color: "#F9FAFB" }}
          onFocus={(e) => { e.target.style.borderColor = "#2563EB"; }}
          onBlur={(e)  => { e.target.style.borderColor = "#334155"; }}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: "#9CA3AF" }}>
          Description <span style={{ color: "#EF4444" }}>*</span>
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={6}
          placeholder="Describe the opportunity, eligibility criteria, what is funded, key dates, and any relevant context. Markdown is supported."
          className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors resize-y"
          style={{ backgroundColor: "#1E293B", border: "1px solid #334155", color: "#F9FAFB", minHeight: "130px" }}
          onFocus={(e) => { e.target.style.borderColor = "#2563EB"; }}
          onBlur={(e)  => { e.target.style.borderColor = "#334155"; }}
        />
        <p className="text-[11px] mt-1" style={{ color: "#4B5563" }}>Markdown supported. Minimum 50 characters.</p>
      </div>

      {/* Legal */}
      <p className="text-[11px] leading-relaxed" style={{ color: "#4B5563" }}>
        By submitting you confirm this opportunity is genuine and the information is accurate. Admin will review before publishing.
      </p>

      {/* Submit */}
      <button
        type="submit"
        disabled={state === "submitting"}
        className="w-full py-3.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
        style={{ backgroundColor: "#2563EB", color: "#fff" }}
      >
        {state === "submitting" ? "Submitting…" : "Submit for Review"}
      </button>
    </form>
  );
}
