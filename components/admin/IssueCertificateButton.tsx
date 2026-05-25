"use client";

import { useState } from "react";
import { Award, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface Props {
  enquiryId:      string;
  recipientName:  string;
  recipientEmail: string;
  userId?:        string;
  clinicSlug:     string;
  alreadyIssued?: boolean;
}

export function IssueCertificateButton({
  enquiryId,
  recipientName,
  recipientEmail,
  userId,
  clinicSlug,
  alreadyIssued = false,
}: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    alreadyIssued ? "done" : "idle"
  );
  const [certNumber, setCertNumber] = useState<string | null>(null);

  async function handleIssue() {
    if (!confirm(`Issue certificate to ${recipientName} (${recipientEmail})?`)) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/certificates", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          enquiry_id:      enquiryId,
          recipient_name:  recipientName,
          recipient_email: recipientEmail,
          user_id:         userId,
          clinic_slug:     clinicSlug,
        }),
      });

      const data = await res.json();

      if (res.status === 409) {
        // Already issued — show the existing number
        setCertNumber(data.certificate?.certificate_number ?? null);
        setStatus("done");
        return;
      }

      if (!res.ok) throw new Error(data.error ?? "Failed");

      setCertNumber(data.certificate?.certificate_number ?? null);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "#10B981" }}>
          <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
          Certificate issued
        </span>
        {certNumber && (
          <span className="text-[10px] font-mono pl-5" style={{ color: "#4B5563" }}>
            {certNumber}
          </span>
        )}
      </div>
    );
  }

  if (status === "error") {
    return (
      <button
        onClick={handleIssue}
        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
        style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#F87171", border: "1px solid rgba(239,68,68,0.25)" }}
      >
        <AlertCircle className="h-3 w-3" />
        Retry
      </button>
    );
  }

  return (
    <button
      onClick={handleIssue}
      disabled={status === "loading"}
      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
      style={{
        backgroundColor: "rgba(245,158,11,0.1)",
        color: "#FCD34D",
        border: "1px solid rgba(245,158,11,0.25)",
      }}
    >
      {status === "loading" ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Award className="h-3 w-3" />
      )}
      {status === "loading" ? "Issuing…" : "Issue Certificate"}
    </button>
  );
}
