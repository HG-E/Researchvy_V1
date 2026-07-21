"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, Trash2, Video, FileText, ChevronUp } from "lucide-react";

type Lesson = {
  id: string; title: string; slug: string; lesson_type: string;
  video_provider: string | null; video_id: string | null; video_url: string | null;
  content_md: string | null; duration_seconds: number; is_free_preview: boolean;
  is_published: boolean; position: number;
};

interface Props {
  lesson: Lesson;
  isFirst?: boolean;
  isLast?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export function LessonRow({ lesson, isFirst, isLast, onMoveUp, onMoveDown }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [form, setForm] = useState({
    title: lesson.title,
    slug: lesson.slug,
    lesson_type: lesson.lesson_type,
    video_provider: lesson.video_provider ?? "youtube",
    video_id: lesson.video_id ?? "",
    video_url: lesson.video_url ?? "",
    content_md: lesson.content_md ?? "",
    duration_seconds: String(lesson.duration_seconds ?? ""),
    is_free_preview: lesson.is_free_preview,
    is_published: lesson.is_published,
  });

  function set(k: string, v: unknown) {
    setForm(p => ({ ...p, [k]: v }));
  }

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/admin/academy/lessons/${lesson.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        duration_seconds: Number(form.duration_seconds) || 0,
        content_md: form.content_md || null,
        video_id: form.video_id || null,
        video_url: form.video_url || null,
      }),
    });
    setSaving(false);
    if (res.ok) { setOpen(false); router.refresh(); }
  }

  async function del() {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    const res = await fetch(`/api/admin/academy/lessons/${lesson.id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else setDeleting(false);
  }

  const inp = "w-full rounded-md px-3 py-2 text-sm border";
  const inpStyle = { backgroundColor: "#1E293B", borderColor: "#334155", color: "#F9FAFB" };

  return (
    <div className="border rounded-lg overflow-hidden" style={{ borderColor: "#334155" }}>
      <div className="flex items-center gap-2 px-3 py-2.5" style={{ backgroundColor: "#0F172A" }}>
        {/* Reorder */}
        {onMoveUp && (
          <div className="flex flex-col flex-shrink-0">
            <button onClick={onMoveUp} disabled={isFirst}
              className="flex items-center justify-center w-5 h-4 disabled:opacity-20"
              style={{ color: "#4B5563" }}>
              <ChevronUp className="h-3 w-3" />
            </button>
            <button onClick={onMoveDown} disabled={isLast}
              className="flex items-center justify-center w-5 h-4 disabled:opacity-20"
              style={{ color: "#4B5563" }}>
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        )}

        <button onClick={() => setOpen(o => !o)} className="flex-1 flex items-center gap-2 text-left min-w-0">
          {open
            ? <ChevronDown className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#4B5563" }} />
            : <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#4B5563" }} />}
          {lesson.lesson_type === "video"
            ? <Video className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#60A5FA" }} />
            : <FileText className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#34D399" }} />}
          <span className="text-sm truncate" style={{ color: "#D1D5DB" }}>{lesson.title}</span>
          {lesson.is_free_preview && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#1d4ed8", color: "#bfdbfe" }}>preview</span>
          )}
          {!lesson.is_published && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#1E293B", color: "#4B5563" }}>draft</span>
          )}
        </button>
        <span className="text-[10px] font-mono flex-shrink-0" style={{ color: "#4B5563" }}>#{lesson.position}</span>
      </div>

      {open && (
        <div className="border-t px-3 py-3 space-y-3" style={{ borderColor: "#334155", backgroundColor: "#070B14" }}>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs mb-1" style={{ color: "#4B5563" }}>Title</label>
              <input className={inp} style={inpStyle} value={form.title} onChange={e => set("title", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: "#4B5563" }}>Slug</label>
              <input className={`${inp} font-mono`} style={inpStyle} value={form.slug} onChange={e => set("slug", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: "#4B5563" }}>Type</label>
              <select className={inp} style={inpStyle} value={form.lesson_type} onChange={e => set("lesson_type", e.target.value)}>
                <option value="video">Video</option>
                <option value="article">Article</option>
              </select>
            </div>

            {form.lesson_type === "video" && (
              <>
                <div>
                  <label className="block text-xs mb-1" style={{ color: "#4B5563" }}>Provider</label>
                  <select className={inp} style={inpStyle} value={form.video_provider} onChange={e => set("video_provider", e.target.value)}>
                    <option value="youtube">YouTube</option>
                    <option value="bunny">Bunny</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs mb-1" style={{ color: "#4B5563" }}>
                    {form.video_provider === "youtube" ? "YouTube Video ID" : "Bunny Video ID"}
                  </label>
                  <input className={`${inp} font-mono`} style={inpStyle} value={form.video_id}
                    onChange={e => set("video_id", e.target.value)}
                    placeholder={form.video_provider === "youtube" ? "dQw4w9WgXcQ" : "uuid-here"} />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs mb-1" style={{ color: "#4B5563" }}>Duration (seconds)</label>
              <input className={inp} style={inpStyle} type="number" value={form.duration_seconds}
                onChange={e => set("duration_seconds", e.target.value)}
                placeholder="e.g. 900 for 15 min" />
            </div>
            <div className="flex items-center gap-4 pt-4">
              <label className="flex items-center gap-1.5 text-xs cursor-pointer" style={{ color: "#D1D5DB" }}>
                <input type="checkbox" checked={form.is_free_preview} onChange={e => set("is_free_preview", e.target.checked)} />
                Free preview
              </label>
              <label className="flex items-center gap-1.5 text-xs cursor-pointer" style={{ color: "#D1D5DB" }}>
                <input type="checkbox" checked={form.is_published} onChange={e => set("is_published", e.target.checked)} />
                Published
              </label>
            </div>

            {/* Lesson body content editor */}
            <div className="col-span-2">
              <label className="block text-xs mb-1" style={{ color: "#4B5563" }}>
                Lesson Content (Markdown)
                <span className="ml-2 font-normal" style={{ color: "#4B5563" }}>optional — shown below the video</span>
              </label>
              <textarea
                className={`${inp} resize-y font-mono text-xs leading-relaxed`} style={{ ...inpStyle, minHeight: "120px" }}
                value={form.content_md}
                onChange={e => set("content_md", e.target.value)}
                placeholder={`## Lesson Notes\n\nWrite any supplementary content, key takeaways, or resources here.\n\nSupports **markdown** formatting.`}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button onClick={del} disabled={deleting}
              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md"
              style={{
                color: confirmDelete ? "#F87171" : "#6B7280",
                backgroundColor: confirmDelete ? "#1f0a0a" : "transparent",
              }}>
              <Trash2 className="h-3.5 w-3.5" />
              {confirmDelete ? "Confirm delete?" : "Delete"}
            </button>
            <div className="flex gap-2">
              <button onClick={() => { setOpen(false); setConfirmDelete(false); }}
                className="px-3 py-1.5 text-xs rounded-md" style={{ color: "#4B5563" }}>
                Cancel
              </button>
              <button onClick={save} disabled={saving}
                className="px-3 py-1.5 text-xs rounded-md font-medium"
                style={{ backgroundColor: "#2563EB", color: "#fff" }}>
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
