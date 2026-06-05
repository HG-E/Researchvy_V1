"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  { value: "grant",          label: "Grant" },
  { value: "fellowship",     label: "Fellowship" },
  { value: "conference",     label: "Call for Papers" },
  { value: "speaking",       label: "Call for Speakers" },
  { value: "collaboration",  label: "Collaboration" },
  { value: "job",            label: "Job / Position" },
  { value: "award",          label: "Award / Prize" },
  { value: "travel-grant",   label: "Travel Grant / Bursary" },
  { value: "other",          label: "Other" },
];

const LEVELS = [
  { value: "all",          label: "All Levels" },
  { value: "early_career", label: "Early-Career" },
  { value: "mid",          label: "Mid-Career" },
  { value: "senior",       label: "Senior" },
];

export default function NewOpportunityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [title,       setTitle]       = useState("");
  const [category,    setCategory]    = useState("grant");
  const [funder,      setFunder]      = useState("");
  const [value,       setValue]       = useState("");
  const [deadline,    setDeadline]    = useState("");
  const [applyUrl,    setApplyUrl]    = useState("");
  const [targetLevel, setTargetLevel] = useState("all");
  const [body,        setBody]        = useState("");
  const [isFeatured,  setIsFeatured]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/opportunities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title:        title.trim(),
        body:         body.trim(),
        category,
        funder:       funder.trim()  || null,
        value:        value.trim()   || null,
        deadline:     deadline       || null,
        apply_url:    applyUrl.trim(),
        target_level: targetLevel,
        is_published: true,
        is_featured:  isFeatured,
      }),
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) { setError(json.error ?? "Something went wrong."); return; }
    setSuccess(true);
    setTimeout(() => router.push("/admin/opportunities"), 1200);
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <CheckCircle className="h-12 w-12" style={{ color: "#10B981" }} />
        <p className="text-lg font-semibold" style={{ color: "#F9FAFB" }}>Opportunity published!</p>
        <p className="text-sm" style={{ color: "#6B7280" }}>Redirecting…</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <Link href="/admin/opportunities"
        className="inline-flex items-center gap-2 text-xs mb-6 transition-opacity hover:opacity-70"
        style={{ color: "#6B7280" }}>
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Opportunities
      </Link>

      <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>
        Admin › Opportunities
      </p>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
        Create New Opportunity
      </h1>

      {error && (
        <div className="rounded-xl border p-4 mb-6" style={{ backgroundColor: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.2)" }}>
          <p className="text-sm" style={{ color: "#FCA5A5" }}>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#9CA3AF" }}>Title *</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required
            className="w-full rounded-xl px-4 py-3 text-sm outline-none"
            style={{ backgroundColor: "#0F172A", border: "1px solid #1E293B", color: "#F9FAFB" }} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#9CA3AF" }}>Category *</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{ backgroundColor: "#0F172A", border: "1px solid #1E293B", color: "#F9FAFB" }}>
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#9CA3AF" }}>Target Level</label>
            <select value={targetLevel} onChange={(e) => setTargetLevel(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{ backgroundColor: "#0F172A", border: "1px solid #1E293B", color: "#F9FAFB" }}>
              {LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#9CA3AF" }}>Funder / Organisation</label>
            <input value={funder} onChange={(e) => setFunder(e.target.value)}
              placeholder="e.g. TWAS, Wellcome Trust"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{ backgroundColor: "#0F172A", border: "1px solid #1E293B", color: "#F9FAFB" }} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#9CA3AF" }}>Value / Stipend</label>
            <input value={value} onChange={(e) => setValue(e.target.value)}
              placeholder="e.g. $10,000 · Travel funded"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{ backgroundColor: "#0F172A", border: "1px solid #1E293B", color: "#F9FAFB" }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#9CA3AF" }}>Deadline</label>
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{ backgroundColor: "#0F172A", border: "1px solid #1E293B", color: "#F9FAFB" }} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#9CA3AF" }}>Application URL *</label>
            <input value={applyUrl} onChange={(e) => setApplyUrl(e.target.value)} required type="url"
              placeholder="https://"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none font-mono"
              style={{ backgroundColor: "#0F172A", border: "1px solid #1E293B", color: "#F9FAFB" }} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#9CA3AF" }}>Description (Markdown) *</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} required rows={8}
            placeholder="Full description, eligibility, what is covered, key dates…"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-y"
            style={{ backgroundColor: "#0F172A", border: "1px solid #1E293B", color: "#F9FAFB", minHeight: "140px" }} />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)}
            className="rounded" />
          <span className="text-sm" style={{ color: "#9CA3AF" }}>Feature this opportunity (shows at top of board)</span>
        </label>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="flex-1 py-3 rounded-xl text-sm font-semibold disabled:opacity-50"
            style={{ backgroundColor: "#2563EB", color: "#fff" }}>
            {loading ? "Publishing…" : "Publish Opportunity"}
          </button>
          <Link href="/admin/opportunities"
            className="px-6 py-3 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: "#1E293B", color: "#9CA3AF" }}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
