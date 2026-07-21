"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

export function NewCourseForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "", slug: "", subtitle: "", description: "",
    level: "1", is_free: false,
  });

  function toSlug(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function set(field: string, value: unknown) {
    setForm(p => {
      const next = { ...p, [field]: value as string | boolean };
      if (field === "title") next.slug = toSlug(value as string);
      return next;
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError("");
    const res = await fetch("/api/admin/academy/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, level: Number(form.level) }),
    });
    const json = await res.json();
    if (!res.ok) { setError(json.error ?? "Failed to create course"); setSaving(false); return; }
    router.push(`/admin/academy/courses/${json.course.id}`);
  }

  const inp = "w-full rounded-md px-3 py-2 text-sm border";
  const inpStyle = { backgroundColor: "#1E293B", borderColor: "#334155", color: "#F9FAFB" };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
        style={{ backgroundColor: "#2563EB", color: "#fff" }}
      >
        <Plus className="h-4 w-4" /> New Course
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-xl border p-5 space-y-4" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold" style={{ color: "#F9FAFB" }}>Create New Course</h3>
        <button type="button" onClick={() => setOpen(false)} style={{ color: "#4B5563" }}>
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs mb-1" style={{ color: "#4B5563" }}>Title *</label>
          <input className={inp} style={inpStyle} value={form.title}
            onChange={e => set("title", e.target.value)} required />
        </div>
        <div>
          <label className="block text-xs mb-1" style={{ color: "#4B5563" }}>Slug *</label>
          <input className={`${inp} font-mono`} style={inpStyle} value={form.slug}
            onChange={e => setForm(p => ({ ...p, slug: toSlug(e.target.value) }))} required />
        </div>
        <div>
          <label className="block text-xs mb-1" style={{ color: "#4B5563" }}>Level</label>
          <select className={inp} style={inpStyle} value={form.level}
            onChange={e => setForm(p => ({ ...p, level: e.target.value }))}>
            <option value="1">1 — Foundations</option>
            <option value="2">2 — Intermediate</option>
            <option value="3">3 — Advanced</option>
            <option value="4">4 — Expert</option>
            <option value="5">5 — Master</option>
          </select>
        </div>
        <div className="flex items-center gap-2 pt-5">
          <input type="checkbox" id="new-is-free" checked={form.is_free}
            onChange={e => setForm(p => ({ ...p, is_free: e.target.checked }))} className="rounded" />
          <label htmlFor="new-is-free" className="text-sm" style={{ color: "#D1D5DB" }}>Free course</label>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs mb-1" style={{ color: "#4B5563" }}>Subtitle</label>
          <input className={inp} style={inpStyle} value={form.subtitle}
            onChange={e => setForm(p => ({ ...p, subtitle: e.target.value }))} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs mb-1" style={{ color: "#4B5563" }}>Description</label>
          <textarea className={`${inp} resize-none`} style={inpStyle} rows={3}
            value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
        </div>
      </div>

      {error && <p className="text-xs" style={{ color: "#F87171" }}>{error}</p>}

      <div className="flex gap-2 justify-end">
        <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm rounded-md" style={{ color: "#4B5563" }}>
          Cancel
        </button>
        <button type="submit" disabled={saving} className="px-4 py-2 text-sm rounded-md font-medium"
          style={{ backgroundColor: "#2563EB", color: "#fff", opacity: saving ? 0.7 : 1 }}>
          {saving ? "Creating…" : "Create Course →"}
        </button>
      </div>
    </form>
  );
}
