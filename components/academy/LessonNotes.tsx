"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { BookOpen, Check, Loader2 } from "lucide-react";

const DEBOUNCE_MS = 1_500;

interface LessonNotesProps {
  lessonId:    string;
  initialNote: string;
}

export function LessonNotes({ lessonId, initialNote }: LessonNotesProps) {
  const [open, setOpen]     = useState(!!initialNote);
  const [text, setText]     = useState(initialNote);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback(async (content: string) => {
    setStatus("saving");
    await fetch("/api/academy/notes", {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ lesson_id: lessonId, content }),
    });
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2000);
  }, [lessonId]);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    setText(value);
    setStatus("idle");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => save(value), DEBOUNCE_MS);
  }

  // Flush on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="border-t mt-10 pt-6" style={{ borderColor: "#1E293B" }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 text-sm font-medium mb-3"
        style={{ color: open ? "#E2E8F0" : "#6B7280" }}
      >
        <BookOpen className="h-4 w-4" />
        Lesson Notes
        <span className="text-xs ml-1" style={{ color: "#4B5563" }}>
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div className="relative">
          <textarea
            value={text}
            onChange={handleChange}
            placeholder="Type your notes here… they're saved automatically."
            rows={6}
            className="w-full rounded-xl px-4 py-3 text-sm resize-none leading-relaxed"
            style={{
              backgroundColor: "#0A0F1A",
              border:          "1px solid #1E293B",
              color:           "#D1D5DB",
              outline:         "none",
            }}
            onFocus={e => { e.currentTarget.style.borderColor = "#334155"; }}
            onBlur={e => { e.currentTarget.style.borderColor = "#1E293B"; }}
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-1 text-xs"
            style={{ color: "#4B5563" }}>
            {status === "saving" && (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Saving…
              </>
            )}
            {status === "saved" && (
              <>
                <Check className="h-3 w-3" style={{ color: "#34D399" }} />
                <span style={{ color: "#34D399" }}>Saved</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
