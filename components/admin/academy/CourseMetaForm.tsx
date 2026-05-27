"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Trash2, ExternalLink } from "lucide-react";

type Course = {
  id: string; title: string; subtitle: string | null; description: string | null;
  level: number; slug: string; is_free: boolean; is_published: boolean;
  thumbnail_url: string | null; trailer_url: string | null; duration_minutes: number | null;
};

export function CourseMetaForm({ course }: { course: Course }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: course.title,
    subtitle: course.subtitle ?? "",
    description: course.description ?? "",
    slug: course.slug,
    level: String(course.level),
    is_free: course.is_free,
    is_published: course.is_published,
    thumbnail_url: course.thumbnail_url ?? "",
    trailer_url: course.trailer_url ?? "",
    duration_minutes: String(course.duration_minutes ?? ""),
  });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function set(field: string, value: unknown) {
    setForm(p => ({ ...p, [field]: value }));
    setStatus("idle");
  }

  async function save() {
    setSaving(true); setStatus("idle");
    const body: Record<string, unknown> = { ...form, level: Number(form.level) };
    if (form.duration_minutes) body.duration_minutes = Number(form.duration_minutes);
    const res = await fetch(`/api/admin/academy/courses/${course.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    setStatus(res.ok ? "saved" : "error");
    if (res.ok) router.refresh();
  }

  async function deleteCourse() {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    const res = await fetch(`/api/admin/academy/courses/${course.id}`, { method: "DELETE" });
    if (res.ok) { router.push("/admin/academy"); return; }
    const { error } = await res.json();
    alert(error ?? "Delete failed");
    setDeleting(false); setConfirmDelete(false);
  }

  const inp = "w-full rounded-md px-3 py-2 text-sm border";
  const inpStyle = { backgroundColor: "#1E293B", borderColor: "#334155", color: "#F9FAFB" };

  return (
    <div className="rounded-xl border p-5 space-y-5" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold" style={{ color: "#F9FAFB" }}>Course Metadata</h2>
        <div className="flex items-center gap-2">
          {form.is_published && (
            <a href={`/academy/courses/${form.slug}`} target="_blank" rel="noreferrer"
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-md"
              style={{ color: "#60A5FA" }}>
              <ExternalLink className="h-3 w-3" /> View live
            </a>
          )}
          <span className="text-xs px-2.5 py-1 rounded-full" style={{
            backgroundColor: form.is_published ? "#14532d" : "#1E293B",
            color: form.is_published ? "#86efac" : "#6B7280",
          }}>
            {form.is_published ? "Published" : "Draft"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs mb-1" style={{ color: "#6B7280" }}>Title *</label>
          <input className={inp} style={inpStyle} value={form.title} onChange={e => set("title", e.target.value)} />
        </div>
        <div>
          <label className="block text-xs mb-1" style={{ color: "#6B7280" }}>Slug *</label>
          <input className={`${inp} font-mono`} style={inpStyle} value={form.slug} onChange={e => set("slug", e.target.value)} />
        </div>
        <div>
          <label className="block text-xs mb-1" style={{ color: "#6B7280" }}>Level</label>
          <select className={inp} style={inpStyle} value={form.level} onChange={e => set("level", e.target.value)}>
            <option value="1">1 — Foundations</option>
            <option value="2">2 — Intermediate</option>
            <option value="3">3 — Advanced</option>
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1" style={{ color: "#6B7280" }}>Duration (minutes)</label>
          <input className={inp} style={inpStyle} type="number" value={form.duration_minutes}
            onChange={e => set("duration_minutes", e.target.value)} placeholder="e.g. 120" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs mb-1" style={{ color: "#6B7280" }}>Subtitle</label>
          <input className={inp} style={inpStyle} value={form.subtitle} onChange={e => set("subtitle", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs mb-1" style={{ color: "#6B7280" }}>Description</label>
          <textarea className={`${inp} resize-none`} style={inpStyle} rows={4}
            value={form.description} onChange={e => set("description", e.target.value)} />
        </div>
        <div>
          <label className="block text-xs mb-1" style={{ color: "#6B7280" }}>Thumbnail URL</label>
          <input className={inp} style={inpStyle} value={form.thumbnail_url}
            onChange={e => set("thumbnail_url", e.target.value)} placeholder="https://…" />
        </div>
        <div>
          <label className="block text-xs mb-1" style={{ color: "#6B7280" }}>Trailer URL</label>
          <input className={inp} style={inpStyle} value={form.trailer_url}
            onChange={e => set("trailer_url", e.target.value)} placeholder="https://…" />
        </div>
        <div className="flex items-center gap-6 pt-1">
          <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "#D1D5DB" }}>
            <input type="checkbox" checked={form.is_free} onChange={e => set("is_free", e.target.checked)} className="rounded" />
            Free course
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "#D1D5DB" }}>
            <input type="checkbox" checked={form.is_published} onChange={e => set("is_published", e.target.checked)} className="rounded" />
            Published
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "#1E293B" }}>
        <div className="flex items-center gap-2">
          <button onClick={deleteCourse} disabled={deleting}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-md"
            style={{
              color: confirmDelete ? "#F87171" : "#6B7280",
              backgroundColor: confirmDelete ? "#1f0a0a" : "transparent",
            }}>
            <Trash2 className="h-3.5 w-3.5" />
            {confirmDelete ? "Click again to confirm" : "Delete course"}
          </button>
          {confirmDelete && (
            <button onClick={() => setConfirmDelete(false)} className="text-xs px-2 py-1" style={{ color: "#6B7280" }}>
              Cancel
            </button>
          )}
        </div>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-md font-medium"
          style={{
            backgroundColor: status === "saved" ? "#14532d" : status === "error" ? "#7f1d1d" : "#2563EB",
            color: status === "saved" ? "#86efac" : status === "error" ? "#FCA5A5" : "#fff",
            opacity: saving ? 0.7 : 1,
          }}>
          <Save className="h-4 w-4" />
          {saving ? "Saving…" : status === "saved" ? "Saved!" : status === "error" ? "Error — retry" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
