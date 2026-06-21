"use client";

import { useState } from "react";
import { CheckCircle, Loader2, Calendar } from "lucide-react";
import { digitalVisibilityClinic } from "@/constants/clinics";

type Track = "wednesday" | "sunday";

interface Props {
  clinicSlug: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long" });
}

export function ClinicEnrollButton({ clinicSlug }: Props) {
  const [selected, setSelected] = useState<Track | null>(null);
  const [state,    setState]    = useState<"idle" | "loading" | "done" | "error">("idle");

  const cohort = digitalVisibilityClinic.nextCohort;
  const tracks = cohort.tracks;

  async function handleRegister() {
    if (!selected) return;
    setState("loading");
    try {
      const res = await fetch("/api/clinics", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ clinic_slug: clinicSlug, preferred_track: selected }),
      });
      if (!res.ok) throw new Error("Request failed");
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    const track = selected ? tracks[selected] : null;
    return (
      <div
        className="rounded-xl border p-4 flex items-start gap-3"
        style={{ backgroundColor: "rgba(34,197,94,0.08)", borderColor: "rgba(34,197,94,0.2)" }}
      >
        <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: "#22C55E" }} />
        <div>
          <p className="text-sm font-semibold" style={{ color: "#22C55E" }}>Interest Registered</p>
          {track && (
            <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
              {track.day} track · starts {formatDate(track.startDate)} · 5:00–7:00 PM EST / 10:00 PM WAT
            </p>
          )}
          <p className="text-xs mt-1" style={{ color: "#4B5563" }}>
            We&apos;ll reach out to confirm your place and send joining details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      {/* Track selection */}
      <div>
        <p className="text-xs font-semibold mb-3 flex items-center gap-2" style={{ color: "#9CA3AF" }}>
          <Calendar className="h-3.5 w-3.5" />
          Choose your schedule track
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(["wednesday", "sunday"] as Track[]).map((key) => {
            const track     = tracks[key];
            const isChosen  = selected === key;
            return (
              <button
                key={key}
                onClick={() => setSelected(key)}
                className="text-left rounded-xl border p-4 transition-all"
                style={{
                  backgroundColor: isChosen ? "rgba(37,99,235,0.1)"  : "#0F172A",
                  borderColor:     isChosen ? "#2563EB"               : "#1E293B",
                }}
              >
                <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: isChosen ? "#60A5FA" : "#4B5563" }}>
                  {track.label}
                </p>
                <p className="text-sm font-semibold mb-1" style={{ color: "#F9FAFB" }}>
                  {track.day}s
                </p>
                <p className="text-xs" style={{ color: "#6B7280" }}>
                  {cohort.sessionTime}
                </p>
                <p className="text-xs mt-1" style={{ color: "#4B5563" }}>
                  Starts {formatDate(track.startDate)}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Commitment summary */}
      {selected && (
        <div
          className="rounded-xl border px-4 py-3 text-xs"
          style={{ backgroundColor: "rgba(37,99,235,0.05)", borderColor: "rgba(37,99,235,0.15)" }}
        >
          <p style={{ color: "#93C5FD" }}>
            <strong style={{ color: "#BFDBFE" }}>5 core sessions</strong> · live, interactive, ≤20 per cohort.
            Recordings included for all sessions.
          </p>
        </div>
      )}

      {/* Register button */}
      <button
        onClick={handleRegister}
        disabled={!selected || state === "loading"}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all duration-200 disabled:opacity-40"
        style={{ backgroundColor: selected ? "#2563EB" : "#1E293B" }}
      >
        {state === "loading" ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Registering…</>
        ) : state === "error" ? (
          "Something went wrong, try again"
        ) : selected ? (
          `Register for ${tracks[selected].label} Track`
        ) : (
          "Select a track to register"
        )}
      </button>
    </div>
  );
}
