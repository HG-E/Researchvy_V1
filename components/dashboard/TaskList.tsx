"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Lock, ChevronDown, ChevronUp, Loader2, BookOpen, Zap } from "lucide-react";

export interface TaskItem {
  id:           string;
  title:        string;
  description:  string | null;
  task_type:    "action" | "reflection";
  task_order:   number;
  is_completed: boolean;
  reflection:   string | null;
}

export interface SessionData {
  session_number: number;
  title:          string;
  is_unlocked:    boolean;
  unlocked_at:    string | null;
  tasks:          TaskItem[];
}

interface Props {
  sessions:   SessionData[];
  totalTasks: number;
  doneTasks:  number;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function SessionRow({ session, defaultOpen }: { session: SessionData; defaultOpen: boolean }) {
  const [open,    setOpen]    = useState(defaultOpen);
  const [tasks,   setTasks]   = useState<TaskItem[]>(session.tasks);
  const [loading, setLoading] = useState<string | null>(null);
  const [reflections, setReflections] = useState<Record<string, string>>(
    Object.fromEntries(session.tasks.map((t) => [t.id, t.reflection ?? ""]))
  );

  const doneTasks  = tasks.filter((t) => t.is_completed).length;
  const totalTasks = tasks.length;
  const allDone    = doneTasks === totalTasks;

  async function toggleAction(task: TaskItem) {
    setLoading(task.id);
    const newCompleted = !task.is_completed;
    setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, is_completed: newCompleted } : t));

    try {
      await fetch("/api/clinic-tasks/complete", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ task_id: task.id, completed: newCompleted }),
      });
    } catch {
      setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, is_completed: task.is_completed } : t));
    }
    setLoading(null);
  }

  async function saveReflection(task: TaskItem) {
    const text = reflections[task.id] ?? "";
    setLoading(task.id);
    setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, is_completed: true, reflection: text } : t));

    try {
      await fetch("/api/clinic-tasks/complete", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ task_id: task.id, completed: true, reflection: text }),
      });
    } catch {
      setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, is_completed: false } : t));
    }
    setLoading(null);
  }

  async function clearReflection(task: TaskItem) {
    setLoading(task.id);
    setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, is_completed: false, reflection: null } : t));
    setReflections((prev) => ({ ...prev, [task.id]: "" }));
    try {
      await fetch("/api/clinic-tasks/complete", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ task_id: task.id, completed: false }),
      });
    } catch {
      setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, is_completed: true } : t));
    }
    setLoading(null);
  }

  if (!session.is_unlocked) {
    return (
      <div
        className="rounded-2xl border p-5 flex items-center gap-4"
        style={{ backgroundColor: "#0A0F1A", borderColor: "#1E293B", opacity: 0.6 }}
      >
        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#1E293B" }}>
          <Lock className="h-4 w-4" style={{ color: "#4B5563" }} />
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: "#6B7280" }}>
            Session {session.session_number}: {session.title}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#374151" }}>
            Unlocks after your Session {session.session_number} live class
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ backgroundColor: "#0F172A", borderColor: allDone ? "rgba(16,185,129,0.3)" : "#1E293B" }}
    >
      {/* Session header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
            style={{
              backgroundColor: allDone ? "rgba(16,185,129,0.15)" : "rgba(37,99,235,0.12)",
              color:           allDone ? "#10B981" : "#60A5FA",
            }}
          >
            {allDone ? <CheckCircle2 className="h-4 w-4" /> : session.session_number}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: "#F9FAFB" }}>
              Session {session.session_number}: {session.title}
            </p>
            <p className="text-xs mt-0.5" style={{ color: allDone ? "#10B981" : "#6B7280" }}>
              {doneTasks}/{totalTasks} tasks done
              {session.unlocked_at && ` · Unlocked ${formatDate(session.unlocked_at)}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Progress bar */}
          <div className="hidden sm:flex w-24 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#1E293B" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width:           `${(doneTasks / totalTasks) * 100}%`,
                backgroundColor: allDone ? "#10B981" : "#2563EB",
              }}
            />
          </div>
          {open ? <ChevronUp className="h-4 w-4" style={{ color: "#4B5563" }} /> : <ChevronDown className="h-4 w-4" style={{ color: "#4B5563" }} />}
        </div>
      </button>

      {/* Task list */}
      {open && (
        <div className="border-t" style={{ borderColor: "#1E293B" }}>
          {tasks.map((task, i) => (
            <div
              key={task.id}
              className="px-6 py-4 border-b last:border-0"
              style={{ borderColor: "#1E293B" }}
            >
              <div className="flex items-start gap-3">
                {/* Type icon */}
                <div className="mt-0.5 flex-shrink-0">
                  {task.task_type === "reflection"
                    ? <BookOpen className="h-4 w-4" style={{ color: "#8B5CF6" }} />
                    : <Zap       className="h-4 w-4" style={{ color: "#F59E0B" }} />
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold" style={{ color: task.is_completed ? "#6B7280" : "#F9FAFB" }}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs mt-1 leading-relaxed" style={{ color: "#4B5563" }}>
                          {task.description}
                        </p>
                      )}
                    </div>

                    {/* Action task toggle */}
                    {task.task_type === "action" && (
                      <button
                        onClick={() => toggleAction(task)}
                        disabled={loading === task.id}
                        className="flex-shrink-0 mt-0.5"
                        title={task.is_completed ? "Mark as not done" : "Mark as done"}
                      >
                        {loading === task.id ? (
                          <Loader2 className="h-5 w-5 animate-spin" style={{ color: "#4B5563" }} />
                        ) : task.is_completed ? (
                          <CheckCircle2 className="h-5 w-5" style={{ color: "#10B981" }} />
                        ) : (
                          <Circle className="h-5 w-5" style={{ color: "#374151" }} />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Reflection task */}
                  {task.task_type === "reflection" && (
                    <div className="mt-3">
                      {task.is_completed ? (
                        <div
                          className="rounded-xl border p-3"
                          style={{ backgroundColor: "rgba(139,92,246,0.05)", borderColor: "rgba(139,92,246,0.2)" }}
                        >
                          {task.reflection && (
                            <p className="text-xs leading-relaxed mb-2 whitespace-pre-wrap" style={{ color: "#C4B5FD" }}>
                              {task.reflection}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-semibold flex items-center gap-1" style={{ color: "#8B5CF6" }}>
                              <CheckCircle2 className="h-3 w-3" />Saved
                            </span>
                            <button
                              onClick={() => clearReflection(task)}
                              disabled={loading === task.id}
                              className="text-[10px]"
                              style={{ color: "#4B5563" }}
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <textarea
                            rows={3}
                            placeholder="Write your response here…"
                            value={reflections[task.id] ?? ""}
                            onChange={(e) => setReflections((prev) => ({ ...prev, [task.id]: e.target.value }))}
                            className="w-full rounded-xl border px-3 py-2.5 text-sm resize-none"
                            style={{
                              backgroundColor: "#0A0F1A",
                              borderColor:     "#1E293B",
                              color:           "#F9FAFB",
                              outline:         "none",
                            }}
                          />
                          <button
                            onClick={() => saveReflection(task)}
                            disabled={loading === task.id || !(reflections[task.id] ?? "").trim()}
                            className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white disabled:opacity-40"
                            style={{ backgroundColor: "#8B5CF6" }}
                          >
                            {loading === task.id ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                            Save Reflection
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function TaskList({ sessions, totalTasks, doneTasks }: Props) {
  const progressPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const currentSessionIndex = sessions.findIndex(
    (s) => s.is_unlocked && s.tasks.some((t) => !t.is_completed)
  );

  return (
    <div className="space-y-4">
      {/* Overall progress */}
      <div
        className="rounded-2xl border p-5"
        style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold" style={{ color: "#F9FAFB" }}>Overall Progress</p>
          <p className="text-sm font-bold" style={{ color: progressPct === 100 ? "#10B981" : "#60A5FA" }}>
            {doneTasks}/{totalTasks} tasks · {progressPct}%
          </p>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#1E293B" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width:           `${progressPct}%`,
              backgroundColor: progressPct === 100 ? "#10B981" : "#2563EB",
            }}
          />
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: "#4B5563" }}>
          <span className="flex items-center gap-1.5">
            <Zap className="h-3 w-3" style={{ color: "#F59E0B" }} />Action tasks
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-3 w-3" style={{ color: "#8B5CF6" }} />Reflection tasks
          </span>
        </div>
      </div>

      {/* Sessions */}
      {sessions.map((session, i) => (
        <SessionRow
          key={session.session_number}
          session={session}
          defaultOpen={i === currentSessionIndex}
        />
      ))}
    </div>
  );
}
