"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import type { Course } from "@/types/academy";

const TIERS = [
  { value: "starter",       label: "Starter" },
  { value: "builder",       label: "Builder" },
  { value: "pro",           label: "Pro" },
  { value: "institutional", label: "Institutional" },
  { value: "complimentary", label: "Complimentary" },
] as const;

interface EnrollmentFormProps {
  courses: Pick<Course, "id" | "title" | "level">[];
  onSuccess: () => void;
}

export function EnrollmentForm({ courses, onSuccess }: EnrollmentFormProps) {
  const router = useRouter();
  const [open,      setOpen]      = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [message,   setMessage]   = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [email,     setEmail]     = useState("");
  const [courseId,  setCourseId]  = useState(courses[0]?.id ?? "");
  const [tier,      setTier]      = useState<string>("starter");
  const [expiresAt, setExpiresAt] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/enrollments", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_email: email.trim(),
          course_id:  courseId,
          tier,
          expires_at: expiresAt || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setMessage({ type: "err", text: json.error ?? "Enrollment failed" });
      } else {
        setMessage({ type: "ok", text: "Enrollment created successfully." });
        setEmail("");
        setExpiresAt("");
        onSuccess();
        router.refresh();
        setTimeout(() => { setOpen(false); setMessage(null); }, 1800);
      }
    } catch {
      setMessage({ type: "err", text: "Network error — please try again." });
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#2563EB" }}
      >
        <PlusCircle className="h-4 w-4" />
        Enroll a researcher
      </button>
    );
  }

  return (
    <div
      className="rounded-2xl border p-6 mb-6"
      style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-bold" style={{ color: "#F9FAFB" }}>New Enrollment</h2>
        <button
          onClick={() => { setOpen(false); setMessage(null); }}
          className="text-xs"
          style={{ color: "#4B5563" }}
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* User email */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#9CA3AF" }}>
            Researcher email *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="researcher@institution.edu"
            className="w-full rounded-xl px-3.5 py-2.5 text-sm border outline-none focus:ring-1"
            style={{
              backgroundColor: "#080E1A",
              borderColor:     "#334155",
              color:           "#F9FAFB",
            }}
          />
        </div>

        {/* Course */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#9CA3AF" }}>
            Course *
          </label>
          <select
            required
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="w-full rounded-xl px-3.5 py-2.5 text-sm border outline-none focus:ring-1"
            style={{ backgroundColor: "#080E1A", borderColor: "#334155", color: "#F9FAFB" }}
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                L{c.level} — {c.title}
              </option>
            ))}
          </select>
        </div>

        {/* Tier */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#9CA3AF" }}>
            Tier *
          </label>
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value)}
            className="w-full rounded-xl px-3.5 py-2.5 text-sm border outline-none focus:ring-1"
            style={{ backgroundColor: "#080E1A", borderColor: "#334155", color: "#F9FAFB" }}
          >
            {TIERS.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Expiry (optional) */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#9CA3AF" }}>
            Expires at <span style={{ color: "#4B5563" }}>(optional — leave blank for lifetime access)</span>
          </label>
          <input
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="rounded-xl px-3.5 py-2.5 text-sm border outline-none focus:ring-1"
            style={{ backgroundColor: "#080E1A", borderColor: "#334155", color: "#F9FAFB" }}
          />
        </div>

        {/* Feedback */}
        {message && (
          <div
            className="sm:col-span-2 flex items-center gap-2 rounded-xl px-4 py-3 text-sm"
            style={{
              backgroundColor: message.type === "ok" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
              color:           message.type === "ok" ? "#10B981" : "#F87171",
            }}
          >
            {message.type === "ok"
              ? <CheckCircle className="h-4 w-4 flex-shrink-0" />
              : <AlertCircle className="h-4 w-4 flex-shrink-0" />}
            {message.text}
          </div>
        )}

        {/* Submit */}
        <div className="sm:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: "#2563EB" }}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
            {loading ? "Enrolling…" : "Create enrollment"}
          </button>
        </div>
      </form>
    </div>
  );
}
