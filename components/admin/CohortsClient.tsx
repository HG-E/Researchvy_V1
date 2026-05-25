"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Unlock, Loader2, CheckCircle2 } from "lucide-react";

type SessionUnlock = {
  id: string; clinic_slug: string; cohort_id: string;
  session_number: number; unlocked_at: string; unlocked_by: string | null;
};

const INPUT = "w-full rounded-xl px-4 py-2.5 text-sm border outline-none transition-colors";
const INPUT_STYLE = { backgroundColor: "#1E293B", borderColor: "#334155", color: "#F9FAFB" };

function fmt(d: string) {
  return new Date(d).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function CohortsClient({ unlocks, totalSessions }: { unlocks: SessionUnlock[]; totalSessions: number }) {
  const router          = useRouter();
  const [cohortId, setCohortId]     = useState("");
  const [session, setSession]       = useState(1);
  const [loading, setLoading]       = useState(false);
  const [result, setResult]         = useState<{ ok: boolean; error?: string } | null>(null);

  // Group unlocks by cohort for summary view
  const cohortMap = unlocks.reduce<Record<string, number[]>>((acc, u) => {
    if (!acc[u.cohort_id]) acc[u.cohort_id] = [];
    acc[u.cohort_id].push(u.session_number);
    return acc;
  }, {});

  async function handleUnlock() {
    if (!cohortId.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/clinic-tasks/unlock", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          clinic_slug:    "digital-visibility-clinic",
          cohort_id:      cohortId.trim(),
          session_number: session,
        }),
      });
      const json = await res.json();
      setResult(res.ok ? { ok: true } : { ok: false, error: json.error });
      if (res.ok) router.refresh();
    } catch {
      setResult({ ok: false, error: "Network error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Unlock form */}
      <div className="max-w-md">
        <div
          className="rounded-2xl border p-6 space-y-4"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <h2 className="text-sm font-semibold" style={{ color: "#F9FAFB" }}>
            Unlock a Session
          </h2>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#6B7280" }}>
              Cohort ID
            </label>
            <input
              type="text"
              value={cohortId}
              onChange={(e) => setCohortId(e.target.value)}
              placeholder="e.g. july-2026"
              className={INPUT}
              style={INPUT_STYLE}
            />
            <p className="text-[11px] mt-1" style={{ color: "#4B5563" }}>
              Use a consistent ID for each cohort (e.g. july-2026, cohort-01)
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#6B7280" }}>
              Session Number
            </label>
            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: totalSessions }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setSession(n)}
                  className="w-10 h-10 rounded-xl text-sm font-bold transition-colors"
                  style={{
                    backgroundColor: session === n ? "#2563EB" : "#1E293B",
                    color:           session === n ? "#fff" : "#6B7280",
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {result && (
            <div
              className="rounded-xl px-4 py-3 text-sm flex items-center gap-2"
              style={{
                backgroundColor: result.ok ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
                border:          `1px solid ${result.ok ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
                color:           result.ok ? "#10B981" : "#F87171",
              }}
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {result.ok ? `Session ${session} unlocked for cohort "${cohortId}".` : result.error}
            </div>
          )}

          <button
            onClick={handleUnlock}
            disabled={loading || !cohortId.trim()}
            className="w-full rounded-xl py-3 text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 transition-opacity"
            style={{ backgroundColor: "#2563EB" }}
          >
            {loading
              ? <><Loader2 className="h-4 w-4 animate-spin" /> Unlocking…</>
              : <><Unlock className="h-4 w-4" /> Unlock Session {session}</>}
          </button>
        </div>
      </div>

      {/* Cohort summary */}
      {Object.keys(cohortMap).length > 0 && (
        <div>
          <h2 className="text-sm font-semibold mb-4" style={{ color: "#F9FAFB" }}>
            Cohort Progress
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(cohortMap).map(([id, sessions]) => {
              const pct = Math.round((sessions.length / totalSessions) * 100);
              return (
                <div
                  key={id}
                  className="rounded-2xl border p-5"
                  style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
                >
                  <p className="text-sm font-semibold mb-1" style={{ color: "#F9FAFB" }}>
                    {id}
                  </p>
                  <p className="text-xs mb-3" style={{ color: "#6B7280" }}>
                    {sessions.length} of {totalSessions} sessions unlocked
                  </p>
                  {/* Progress bar */}
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#1E293B" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: pct === 100 ? "#10B981" : "#2563EB",
                      }}
                    />
                  </div>
                  {/* Session dots */}
                  <div className="flex gap-1.5 mt-3 flex-wrap">
                    {Array.from({ length: totalSessions }, (_, i) => i + 1).map((n) => (
                      <span
                        key={n}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                        style={{
                          backgroundColor: sessions.includes(n) ? "rgba(37,99,235,0.2)" : "#1E293B",
                          color:           sessions.includes(n) ? "#60A5FA" : "#374151",
                        }}
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Unlock log */}
      {unlocks.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold mb-4" style={{ color: "#F9FAFB" }}>
            Unlock Log
          </h2>
          <div
            className="rounded-2xl border overflow-hidden"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            <table className="w-full text-sm">
              <thead style={{ borderBottom: "1px solid #1E293B" }}>
                <tr>
                  {["Cohort", "Session", "Unlocked By", "Date"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold tracking-wide" style={{ color: "#4B5563" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {unlocks.map((u, i) => (
                  <tr key={u.id} style={{ borderTop: i === 0 ? "none" : "1px solid #1E293B" }}>
                    <td className="px-4 py-3 font-medium" style={{ color: "#F9FAFB" }}>{u.cohort_id}</td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-[11px] font-bold"
                        style={{ backgroundColor: "rgba(37,99,235,0.12)", color: "#60A5FA" }}
                      >
                        Session {u.session_number}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "#6B7280" }}>{u.unlocked_by ?? "—"}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: "#4B5563" }}>{fmt(u.unlocked_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
