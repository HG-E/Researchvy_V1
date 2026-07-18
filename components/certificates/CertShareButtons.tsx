"use client";

import { useState } from "react";
import { Linkedin, Copy, Check, ExternalLink } from "lucide-react";

interface Props {
  certificateNumber: string;
  recipientName:     string;
  programme:         string;
  issuedAt:          string;   // ISO date string
}

function buildLinkedInUrl(p: Props): string {
  const issued   = new Date(p.issuedAt);
  const year     = issued.getFullYear();
  const month    = issued.getMonth() + 1;
  const verifyUrl = `https://researchvy.com/verify/${encodeURIComponent(p.certificateNumber)}`;

  const params = new URLSearchParams({
    startTask:        "CERTIFICATION_NAME",
    name:             p.programme,
    organizationName: "Researchvy",
    issueYear:        String(year),
    issueMonth:       String(month),
    certUrl:          verifyUrl,
    certId:           p.certificateNumber,
  });

  return `https://www.linkedin.com/profile/add?${params.toString()}`;
}

function buildOrcidText(p: Props): string {
  const issued = new Date(p.issuedAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  return `Title: ${p.programme}
Organisation: Researchvy
Type: Certification
Date: ${issued}
Certificate ID: ${p.certificateNumber}
Verification URL: https://researchvy.com/verify/${p.certificateNumber}`;
}

export function CertShareButtons({ certificateNumber, recipientName, programme, issuedAt }: Props) {
  const [copied,       setCopied]       = useState(false);
  const [orcidOpen,    setOrcidOpen]    = useState(false);

  const linkedInUrl = buildLinkedInUrl({ certificateNumber, recipientName, programme, issuedAt });
  const orcidText   = buildOrcidText   ({ certificateNumber, recipientName, programme, issuedAt });

  async function copyOrcid() {
    try {
      await navigator.clipboard.writeText(orcidText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback: select the textarea
    }
  }

  return (
    <div className="mt-6 space-y-3">
      <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#6B7280" }}>
        Add to your profiles
      </p>

      <div className="flex flex-wrap gap-3">
        {/* LinkedIn — direct deep-link */}
        <a
          href={linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 active:opacity-70 min-h-[44px]"
          style={{ backgroundColor: "#0A66C2" }}
        >
          <Linkedin className="h-4 w-4" />
          Add to LinkedIn
          <ExternalLink className="h-3 w-3 opacity-70" />
        </a>

        {/* ORCID — show copy-paste modal */}
        <button
          type="button"
          onClick={() => setOrcidOpen((o) => !o)}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 active:opacity-70 min-h-[44px]"
          style={{ backgroundColor: "rgba(166,209,57,0.12)", color: "#A6D139", border: "1px solid rgba(166,209,57,0.25)" }}
        >
          {/* ORCID SVG logo */}
          <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
            <path d="M128 0C57.3 0 0 57.3 0 128s57.3 128 128 128 128-57.3 128-128S198.7 0 128 0zm-28.3 70.2h15.6v115.6H99.7V70.2zm52.6 0h-26.5v115.6h26.5c31.2 0 54.9-23.7 54.9-57.8 0-34.1-23.7-57.8-54.9-57.8zm0 100.7h-10.9V85.1h10.9c22.6 0 39.2 15.1 39.2 42.9 0 27.8-16.6 42.9-39.2 42.9zM91.9 50.5c0 5.7-4.6 10.3-10.3 10.3-5.7 0-10.3-4.6-10.3-10.3 0-5.7 4.6-10.3 10.3-10.3 5.7 0 10.3 4.6 10.3 10.3z" />
          </svg>
          Add to ORCID
        </button>
      </div>

      {/* ORCID instructions panel */}
      {orcidOpen && (
        <div
          className="rounded-2xl border p-5 space-y-4 mt-2"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
        >
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: "#A6D139" }}>
              How to add to ORCID
            </p>
            <ol className="text-xs space-y-1.5 list-decimal list-inside" style={{ color: "#6B7280" }}>
              <li>Go to <a href="https://orcid.org" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "#60A5FA" }}>orcid.org</a> and sign in</li>
              <li>Click <strong style={{ color: "#374151" }}>Add Works</strong> → <strong style={{ color: "#374151" }}>Add manually</strong></li>
              <li>Choose work type <strong style={{ color: "#374151" }}>Qualification</strong></li>
              <li>Paste the details below into the relevant fields</li>
              <li>Click <strong style={{ color: "#374151" }}>Save changes</strong></li>
            </ol>
          </div>

          <div className="relative">
            <pre
              className="text-xs rounded-xl p-4 leading-relaxed whitespace-pre-wrap overflow-x-auto"
              style={{ backgroundColor: "#FFFFFF", color: "#6B7280", border: "1px solid #E2E8F0" }}
            >
              {orcidText}
            </pre>
            <button
              type="button"
              onClick={copyOrcid}
              className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors min-h-[44px]"
              style={{ backgroundColor: copied ? "rgba(16,185,129,0.15)" : "#1E293B", color: copied ? "#10B981" : "#9CA3AF" }}
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <p className="text-xs" style={{ color: "#374151" }}>
            Your certificate is publicly verifiable at{" "}
            <a
              href={`https://researchvy.com/verify/${certificateNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: "#60A5FA" }}
            >
              researchvy.com/verify/{certificateNumber}
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
