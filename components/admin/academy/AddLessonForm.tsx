"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AddLessonForm({ moduleId }: { moduleId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "", slug: "", lesson_type: "video",
    video_provider: "youtube", video_id: "",
    is_free_preview: false, duration_seconds: "",
  });

  function toSlug(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function set(k: string, v: unknown) {
    setForm(p => {
      const next = { ...p, [k]: v };
      if (k === "title") next.slug = toSlug(v as string);
      return next;
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError("");
    const body: Record<string, unknown> = {
      module_id: moduleId,
      title: form.title, slug: form.slug,
      lesson_type: form.lesson_type,
      is_free_preview: form.is_free_preview,
    };
    if (form.lesson_type === "video") {
      body.video_provider = form.video_provider;
      body.video_id = form.video_id || null;
    }
    if (form.duration_seconds) body.duration_seconds = Number(form.duration_seconds);

    const res = await fetch("/api/admin/academy/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (!res.ok) { const j = await res.json(); setError(j.error ?? "Failed"); return; }
    setForm({ title: "", slug: "", lesson_type: "video", video_provider: "youtube", video_id: "", is_free_preview: false, duration_seconds: "" });
    setOpen(false);
    router.refresh();
  }

  const inp = "w-full rounded-md px-3 py-2 text-sm border";
  const inpStyle = { backgroundColor: "#1E293B", borderColor: "#334155", color: "#F9FAFB" };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md mt-2"
        style={{ color: "#60A5FA", backgroundColor: "transparent" }}>
        + Add Lesson
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="border-t pt-3 mt-2 space-y-3" style={{ borderColor: "#334155" }}>
      <p className="text-xs font-medium" style={{ color: "#94A3B8" }}>New Lesson</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="block text-xs mb-1" style={{ color: "#6B7280" }}>Title *</label>
          <input className={inp} style={inpStyle} value={form.title}
            onChange={e => set("title", e.target.value)} required />
        </div>
        <div>
          <label className="block text-xs mb-1" style={{ color: "#6B7280" }}>Slug *</label>
          <input className={`${inp} font-mono`} style={inpStyle} value={form.slug}
            onChange={e => set("slug", toSlug(e.target.value))} required />
        </div>
        <div>
          <label className="block text-xs mb-1" style={{ color: "#6B7280" }}>Type</label>
          <select className={inp} style={inpStyle} value={form.lesson_type}
            onChange={e => set("lesson_type", e.target.value)}>
            <option value="video">Video</option>
            <option value="article">Article</option>
          </select>
        </div>
        {form.lesson_type === "video" && (
          <>
            <div>
              <label className="block text-xs mb-1" style={{ color: "#6B7280" }}>Provider</label>
              <select className={inp} style={inpStyle} value={form.video_provider}
                onChange={e => set("video_provider", e.target.value)}>
                <option value="youtube">YouTube</option>
                <option value="bunny">Bunny</option>
              </select>
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: "#6B7280" }}>Video ID</label>
              <input className={`${inp} font-mono`} style={inpStyle} value={form.video_id}
                onChange={e => set("video_id", e.target.value)} placeholder="dQw4w9WgXcQ" />
            </div>
          </>
        )}
        <div>
          <label className="block text-xs mb-1" style={{ color: "#6B7280" }}>Duration (seconds)</label>
          <input className={inp} style={inpStyle} type="number" value={form.duration_seconds}
            onChange={e => set("duration_seconds", e.target.value)} />
        </div>
        <div className="flex items-center gap-2 pt-4">
          <input type="checkbox" id={`fp-${moduleId}`} checked={form.is_free_preview}
            onChange={e => set("is_free_preview", e.target.checked)} />
          <label htmlFor={`fp-${moduleId}`} className="text-xs cursor-pointer" style={{ color: "#D1D5DB" }}>
            Free preview
          </label>
        </div>
      </div>
      {error && <p className="text-xs" style={{ color: "#F87171" }}>{error}</p>}
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={() => setOpen(false)} className="px-3 py-1.5 text-xs rounded-md" style={{ color: "#6B7280" }}>Cancel</button>
        <button type="submit" disabled={saving} className="px-3 py-1.5 text-xs rounded-md font-medium"
          style={{ backgroundColor: "#2563EB", color: "#fff" }}>
          {saving ? "Adding…" : "Add Lesson"}
        </button>
      </div>
    </form>
  );
}
