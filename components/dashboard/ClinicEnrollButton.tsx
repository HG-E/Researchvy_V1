"use client";

import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";

interface Props {
  clinicSlug: string;
}

export function ClinicEnrollButton({ clinicSlug }: Props) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleClick() {
    setState("loading");
    try {
      const res = await fetch("/api/clinics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinic_slug: clinicSlug }),
      });
      if (!res.ok) throw new Error("Request failed");
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold" style={{ backgroundColor: "rgba(34,197,94,0.1)", color: "#22C55E" }}>
        <CheckCircle className="h-4 w-4" />
        Interest Registered
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={state === "loading"}
      className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60"
      style={{ backgroundColor: "#2563EB" }}
    >
      {state === "loading" ? (
        <><Loader2 className="h-4 w-4 animate-spin" /> Registering…</>
      ) : state === "error" ? (
        "Try Again"
      ) : (
        "Register My Interest"
      )}
    </button>
  );
}
