"use client";

import { useState } from "react";
import { Award, Loader2, ExternalLink } from "lucide-react";

interface Props {
  fullName:       string;
  email:          string;
  clinicSlug:     string;
  initialCertNum: string | null;
}

export function IssueCertButton({ fullName, email, clinicSlug, initialCertNum }: Props) {
  const [certNum, setCertNum] = useState(initialCertNum);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  if (certNum) {
    return (
      <a
        href={`/verify/${certNum}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold"
        style={{ backgroundColor: "rgba(245,158,11,0.1)", color: "#F59E0B" }}
      >
        <Award className="h-3 w-3" />
        {certNum}
        <ExternalLink className="h-2.5 w-2.5" />
      </a>
    );
  }

  async function issue() {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch("/api/certificates", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ recipient_name: fullName, recipient_email: email, clinic_slug: clinicSlug }),
      });
      const json = await res.json() as { error?: string; certificate?: { certificate_number: string } };
      if (res.status === 409 && json.certificate?.certificate_number) {
        setCertNum(json.certificate.certificate_number);
      } else if (!res.ok) {
        setError(json.error ?? "Failed to issue");
      } else {
        setCertNum(json.certificate?.certificate_number ?? null);
      }
    } catch {
      setError("Network error");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-1">
      <button
        onClick={issue}
        disabled={loading}
        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
        style={{ backgroundColor: "#F59E0B" }}
      >
        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Award className="h-3 w-3" />}
        Issue Certificate
      </button>
      {error && <p className="text-[10px]" style={{ color: "#F87171" }}>{error}</p>}
    </div>
  );
}
