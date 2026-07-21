"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export function AddModuleForm({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError("");
    const res = await fetch("/api/admin/academy/modules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ course_id: courseId, title, description: description || undefined }),
    });
    setSaving(false);
    if (!res.ok) { const j = await res.json(); setError(j.error ?? "Failed"); return; }
    setTitle(""); setDescription(""); setOpen(false);
    router.refresh();
  }

  const inp = "w-full rounded-md px-3 py-2 text-sm border";
  const inpStyle = { backgroundColor: "#1E293B", borderColor: "#334155", color: "#F9FAFB" };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm px-4 py-3 rounded-xl border w-full justify-center"
        style={{ borderColor: "#334155", borderStyle: "dashed", color: "#60A5FA" }}>
        <Plus className="h-4 w-4" /> Add Module
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-xl border p-4 space-y-3" style={{ backgroundColor: "#0F172A", borderColor: "#334155" }}>
      <p className="text-xs font-semibold" style={{ color: "#F9FAFB" }}>New Module</p>
      <div>
        <label className="block text-xs mb-1" style={{ color: "#4B5563" }}>Title *</label>
        <input className={inp} style={inpStyle} value={title} onChange={e => setTitle(e.target.value)} required />
      </div>
      <div>
        <label className="block text-xs mb-1" style={{ color: "#4B5563" }}>Description (optional)</label>
        <input className={inp} style={inpStyle} value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      {error && <p className="text-xs" style={{ color: "#F87171" }}>{error}</p>}
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={() => setOpen(false)} className="px-3 py-1.5 text-xs rounded-md" style={{ color: "#4B5563" }}>Cancel</button>
        <button type="submit" disabled={saving} className="px-3 py-1.5 text-xs rounded-md font-medium"
          style={{ backgroundColor: "#2563EB", color: "#fff" }}>
          {saving ? "Adding…" : "Add Module"}
        </button>
      </div>
    </form>
  );
}
