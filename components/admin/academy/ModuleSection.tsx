"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { LessonRow } from "./LessonRow";
import { AddLessonForm } from "./AddLessonForm";

type Lesson = {
  id: string; title: string; slug: string; lesson_type: string;
  video_provider: string | null; video_id: string | null; video_url: string | null;
  content_md: string | null; duration_seconds: number; is_free_preview: boolean;
  is_published: boolean; position: number;
};

type Module = {
  id: string; title: string; description: string | null; position: number;
  lessons: Lesson[];
};

export function ModuleSection({ mod }: { mod: Module }) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(mod.title);
  const [description, setDescription] = useState(mod.description ?? "");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/admin/academy/modules/${mod.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description: description || null }),
    });
    setSaving(false);
    if (res.ok) { setEditing(false); router.refresh(); }
  }

  async function del() {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    const res = await fetch(`/api/admin/academy/modules/${mod.id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else { setDeleting(false); setConfirmDelete(false); }
  }

  const sortedLessons = [...mod.lessons].sort((a, b) => a.position - b.position);

  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#1E293B" }}>
      {/* Module header */}
      <div className="flex items-center gap-2 px-4 py-3" style={{ backgroundColor: "#0F172A" }}>
        <button onClick={() => setOpen(o => !o)} className="flex-shrink-0 p-0.5" style={{ color: "#6B7280" }}>
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>

        {editing ? (
          <input
            value={title} onChange={e => setTitle(e.target.value)} autoFocus
            className="flex-1 rounded-md px-3 py-1.5 text-sm border"
            style={{ backgroundColor: "#1E293B", borderColor: "#334155", color: "#F9FAFB" }}
            onKeyDown={e => { if (e.key === "Enter") save(); if (e.key === "Escape") setEditing(false); }}
          />
        ) : (
          <span className="flex-1 text-sm font-medium min-w-0" style={{ color: "#E2E8F0" }}>
            Module {mod.position}: {mod.title}
            <span className="ml-2 text-xs font-normal" style={{ color: "#4B5563" }}>
              {sortedLessons.length} lesson{sortedLessons.length !== 1 ? "s" : ""}
            </span>
          </span>
        )}

        <div className="flex items-center gap-1 flex-shrink-0">
          {editing ? (
            <>
              <button onClick={() => setEditing(false)} className="text-xs px-2 py-1 rounded" style={{ color: "#6B7280" }}>
                Cancel
              </button>
              <button onClick={save} disabled={saving} className="text-xs px-2.5 py-1 rounded font-medium"
                style={{ backgroundColor: "#2563EB", color: "#fff" }}>
                {saving ? "…" : "Save"}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(true)}
                className="flex items-center justify-center w-7 h-7 rounded hover:bg-[#1E293B]"
                style={{ color: "#6B7280" }}>
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button onClick={del} disabled={deleting}
                className="flex items-center justify-center w-7 h-7 rounded hover:bg-[#1E293B]"
                style={{ color: confirmDelete ? "#F87171" : "#6B7280" }}>
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Module body */}
      {open && (
        <div className="px-4 py-3 space-y-2" style={{ backgroundColor: "#070B14" }}>
          {editing && (
            <div className="mb-3">
              <label className="block text-xs mb-1" style={{ color: "#6B7280" }}>Description</label>
              <input value={description} onChange={e => setDescription(e.target.value)}
                className="w-full rounded-md px-3 py-2 text-sm border"
                style={{ backgroundColor: "#1E293B", borderColor: "#334155", color: "#F9FAFB" }} />
            </div>
          )}
          {!editing && mod.description && (
            <p className="text-xs mb-3" style={{ color: "#6B7280" }}>{mod.description}</p>
          )}

          {confirmDelete && (
            <div className="flex items-center gap-2 p-3 rounded-lg mb-2"
              style={{ backgroundColor: "#1f0a0a", border: "1px solid #7f1d1d" }}>
              <span className="text-xs flex-1" style={{ color: "#F87171" }}>
                Delete module + {sortedLessons.length} lesson{sortedLessons.length !== 1 ? "s" : ""}?
              </span>
              <button onClick={() => setConfirmDelete(false)} className="text-xs px-2 py-1" style={{ color: "#6B7280" }}>Cancel</button>
              <button onClick={del} disabled={deleting} className="text-xs px-2.5 py-1 rounded font-medium"
                style={{ backgroundColor: "#7f1d1d", color: "#FCA5A5" }}>
                {deleting ? "Deleting…" : "Confirm"}
              </button>
            </div>
          )}

          {sortedLessons.length === 0 && !editing && (
            <p className="text-xs py-2 text-center" style={{ color: "#4B5563" }}>No lessons yet</p>
          )}
          {sortedLessons.map(l => <LessonRow key={l.id} lesson={l} />)}
          <AddLessonForm moduleId={mod.id} />
        </div>
      )}
    </div>
  );
}
