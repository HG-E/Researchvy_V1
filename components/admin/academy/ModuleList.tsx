"use client";

import { useState } from "react";
import { ModuleSection } from "./ModuleSection";
import { AddModuleForm } from "./AddModuleForm";

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

export function ModuleList({ modules: initialModules, courseId }: {
  modules: Module[];
  courseId: string;
}) {
  const [modules, setModules] = useState(() =>
    [...initialModules].sort((a, b) => a.position - b.position)
  );

  function move(id: string, dir: "up" | "down") {
    const idx = modules.findIndex(m => m.id === id);
    if (dir === "up" && idx === 0) return;
    if (dir === "down" && idx === modules.length - 1) return;

    const next = [...modules];
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
    const sorted = next.map((m, i) => ({ ...m, position: i + 1 }));

    setModules(sorted);

    fetch("/api/admin/academy/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "module", items: sorted.map(m => ({ id: m.id, position: m.position })) }),
    }).catch(console.error);
  }

  return (
    <div className="space-y-3">
      {modules.length === 0 && (
        <p className="text-sm py-6 text-center rounded-xl border"
          style={{ color: "#4B5563", borderColor: "#1E293B", borderStyle: "dashed" }}>
          No modules yet — add your first module below
        </p>
      )}
      {modules.map((mod, idx) => (
        <ModuleSection
          key={mod.id}
          mod={mod}
          isFirst={idx === 0}
          isLast={idx === modules.length - 1}
          onMoveUp={() => move(mod.id, "up")}
          onMoveDown={() => move(mod.id, "down")}
        />
      ))}
      <AddModuleForm courseId={courseId} />
    </div>
  );
}
