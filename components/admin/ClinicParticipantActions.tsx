"use client";

import { useState } from "react";
import { CheckCircle2, RotateCcw, XCircle, Loader2, Link2 } from "lucide-react";

export type ParticipantStatus = "pending" | "active" | "revoked";

interface Props {
  id:                  string;
  currentStatus:       ParticipantStatus;
  whatsappGroupUrl:    string | null;
  onStatusChange:      (id: string, status: ParticipantStatus) => void;
}

export function ClinicParticipantActions({ id, currentStatus, whatsappGroupUrl, onStatusChange }: Props) {
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [url,      setUrl]      = useState(whatsappGroupUrl ?? "");
  const [savingUrl, setSavingUrl] = useState(false);

  async function patch(updates: Record<string, unknown>) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/clinic-participants/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(updates),
      });
      const json = await res.json();
      if (!res.ok) {
        setError((json as { error?: string }).error ?? "Failed");
      } else {
        if (updates.status) onStatusChange(id, updates.status as ParticipantStatus);
      }
    } catch {
      setError("Network error");
    }
    setLoading(false);
  }

  async function saveUrl() {
    setSavingUrl(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/clinic-participants/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ whatsapp_group_url: url.trim() || null }),
      });
      if (!res.ok) {
        const json = await res.json();
        setError((json as { error?: string }).error ?? "Failed to save URL");
      }
    } catch {
      setError("Network error");
    }
    setSavingUrl(false);
  }

  return (
    <div className="space-y-2">
      {/* Status actions */}
      <div className="flex items-center gap-2 flex-wrap">
        {currentStatus === "pending" && (
          <button
            onClick={() => patch({ status: "active" })}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: "#10B981" }}
          >
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
            Grant Access
          </button>
        )}
        {currentStatus === "active" && (
          <button
            onClick={() => patch({ status: "revoked" })}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
            style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#F87171" }}
          >
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3" />}
            Revoke
          </button>
        )}
        {currentStatus === "revoked" && (
          <button
            onClick={() => patch({ status: "pending" })}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
            style={{ backgroundColor: "rgba(245,158,11,0.12)", color: "#FCD34D" }}
          >
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RotateCcw className="h-3 w-3" />}
            Reinstate
          </button>
        )}
      </div>

      {/* WhatsApp group URL */}
      <div className="flex items-center gap-1.5">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="WhatsApp group link…"
          className="flex-1 min-w-0 rounded-lg border px-2 py-1 text-xs bg-transparent outline-none"
          style={{ borderColor: "#1E293B", color: "#9CA3AF" }}
        />
        <button
          onClick={saveUrl}
          disabled={savingUrl}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold disabled:opacity-50"
          style={{ backgroundColor: "rgba(37,99,235,0.15)", color: "#60A5FA" }}
        >
          {savingUrl ? <Loader2 className="h-3 w-3 animate-spin" /> : <Link2 className="h-3 w-3" />}
          Save
        </button>
      </div>

      {error && <p className="text-[11px]" style={{ color: "#F87171" }}>{error}</p>}
    </div>
  );
}
