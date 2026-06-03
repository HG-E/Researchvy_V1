"use client";

import { useState } from "react";
import { Printer, Share2, CheckCircle2, Check } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getProgramme } from "@/lib/certificates/programmes";

interface Certificate {
  certificate_number: string;
  recipient_name:     string;
  programme:          string;
  issued_at:          string;
  clinic_slug?:       string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export function CertificateView({ cert }: { cert: Certificate }) {
  const [copied, setCopied] = useState(false);

  const prog      = getProgramme(cert.clinic_slug ?? "digital-visibility-clinic");
  const verifyUrl = `${siteConfig.url}/verify/${cert.certificate_number}`;

  const linkedInUrl = [
    "https://www.linkedin.com/profile/add",
    `?startTask=CERTIFICATION_NAME`,
    `&name=${encodeURIComponent(prog.certificateType)}`,
    `&organizationName=${encodeURIComponent(siteConfig.name)}`,
    `&issueYear=${new Date(cert.issued_at).getFullYear()}`,
    `&issueMonth=${new Date(cert.issued_at).getMonth() + 1}`,
    `&certUrl=${encodeURIComponent(verifyUrl)}`,
    `&certId=${encodeURIComponent(cert.certificate_number)}`,
  ].join("");

  const qrUrl = [
    "https://api.qrserver.com/v1/create-qr-code/",
    `?data=${encodeURIComponent(verifyUrl)}`,
    `&size=120x120&format=png`,
    `&color=15-23-42&bgcolor=255-255-255&margin=4`,
  ].join("");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(verifyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <>
      {/* ── Print CSS ───────────────────────────────────────────────────────── */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #cert-printable, #cert-printable * { visibility: visible !important; }
          #cert-printable {
            position: fixed !important;
            inset: 0 !important;
            width: 100vw !important;
            height: 100dvh !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: white !important;
            padding: 20px !important;
            box-sizing: border-box !important;
          }
          .cert-document {
            background: white !important;
            color: #0F172A !important;
            border: 1.5px solid #CBD5E1 !important;
            box-shadow: none !important;
            width: 100% !important;
            max-width: 760px !important;
          }
          .cert-top-bar    { background: linear-gradient(90deg,#1D4ED8,#7C3AED,#D97706) !important; }
          .cert-btm-bar    { background: linear-gradient(90deg,#D97706,#7C3AED,#1D4ED8) !important; }
          .cert-divider    { background: #CBD5E1 !important; }
          .cert-dot-green  { background: #10B981 !important; }
          .cert-dot-blue   { background: #2563EB !important; }
          .cert-logo-text  { color: #0F172A !important; }
          .cert-logo-dot   { color: #2563EB !important; }
          .cert-type-label { color: #4B5563 !important; }
          .cert-label      { color: #6B7280 !important; }
          .cert-name       { color: #0F172A !important; }
          .cert-programme  { color: #7C3AED !important; }
          .cert-number     { color: #6B7280 !important; }
          .cert-meta-label { color: #9CA3AF !important; }
          .cert-meta-value { color: #374151 !important; }
          .cert-verify     { color: #6B7280 !important; }
          .cert-sig-name   { color: #374151 !important; }
          .cert-sig-title  { color: #9CA3AF !important; }
          .cert-sig-line   { border-color: #CBD5E1 !important; }
          .cert-sig path   { stroke: #94A3B8 !important; }
          .cert-seal circle, .cert-seal path { stroke: #CBD5E1 !important; }
          .cert-seal text  { fill: #CBD5E1 !important; }
          .cert-seal-center { fill: #94A3B8 !important; }
          .cert-wm         { opacity: 0.07 !important; }
          .cert-wm circle, .cert-wm path { stroke: #64748B !important; }
          .cert-wm text    { fill: #64748B !important; }
          .cert-wm-center  { fill: #64748B !important; }
          .no-print        { display: none !important; }
        }
      `}</style>

      {/* ── Action bar ──────────────────────────────────────────────────────── */}
      <div className="no-print flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all active:scale-[0.97]"
          style={{ backgroundColor: "#2563EB" }}
        >
          <Printer className="h-4 w-4" />
          Print / Save PDF
        </button>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all active:scale-[0.97]"
          style={{ backgroundColor: "#1E293B", color: copied ? "#10B981" : "#9CA3AF", border: "1px solid #334155" }}
        >
          {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy Verification Link"}
        </button>
        <a
          href={linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all active:scale-[0.97]"
          style={{ backgroundColor: "#0A66C2" }}
        >
          Add to LinkedIn
        </a>
      </div>

      {/* ── Certificate document ─────────────────────────────────────────────── */}
      <div id="cert-printable">
        <div
          className="cert-document rounded-3xl overflow-hidden relative w-full"
          style={{ backgroundColor: "#080E1A", border: "1px solid #1E293B", maxWidth: "760px" }}
        >
          {/* Top gradient bar */}
          <div
            className="cert-top-bar h-2 w-full"
            style={{ background: "linear-gradient(90deg, #1D4ED8, #7C3AED, #D97706)" }}
          />

          {/* Watermark seal — positioned absolute, center of document */}
          <div
            className="cert-wm absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            style={{ opacity: 0.04 }}
            aria-hidden="true"
          >
            <svg width="320" height="320" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="47" stroke="white" strokeWidth="0.6" strokeDasharray="2 1.5" />
              <circle cx="50" cy="50" r="41" stroke="white" strokeWidth="1.2" />
              <circle cx="50" cy="50" r="35" stroke="white" strokeWidth="0.4" />
              <defs>
                <path id="wm-arc" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
              </defs>
              <text fontSize="5.8" letterSpacing="3.8" fill="white" fontFamily="Arial, sans-serif" fontWeight="700">
                <textPath href="#wm-arc" startOffset="1%">
                  RESEARCHVY • VERIFIED • AUTHENTIC • SCHOLARLY •
                </textPath>
              </text>
              <text x="50" y="60" textAnchor="middle" className="cert-wm-center" fill="white" fontSize="28" fontWeight="800" fontFamily="Georgia, serif">
                R
              </text>
            </svg>
          </div>

          <div className="relative px-8 sm:px-16 py-12 sm:py-16">

            {/* Logo + credential type */}
            <div className="text-center mb-10">
              <div className="mb-3">
                <span className="cert-logo-text text-2xl font-bold tracking-tight" style={{ color: "#F9FAFB", fontFamily: "var(--font-serif)" }}>
                  Researchvy
                </span>
                <span className="cert-logo-dot text-2xl font-bold" style={{ color: "#D97706" }}>.</span>
              </div>
              <p
                className="cert-type-label text-xs font-bold tracking-[0.22em] uppercase"
                style={{ color: "#6B7280" }}
              >
                {prog.certificateType}
              </p>
            </div>

            {/* Decorative divider */}
            <div className="flex items-center gap-4 mb-10">
              <div
                className="cert-divider flex-1 h-px"
                style={{ background: "linear-gradient(90deg, transparent, #1E293B)" }}
              />
              <div className="cert-dot-green w-2 h-2 rounded-full" style={{ backgroundColor: "#10B981" }} />
              <div
                className="cert-divider flex-1 h-px"
                style={{ background: "linear-gradient(90deg, #1E293B, transparent)" }}
              />
            </div>

            {/* Core certification statement */}
            <div className="text-center mb-10">
              <p className="cert-label text-sm mb-5 tracking-wide" style={{ color: "#6B7280" }}>
                This certifies that
              </p>
              <h1
                className="cert-name text-4xl sm:text-5xl font-bold leading-tight mb-5"
                style={{
                  fontFamily: "var(--font-serif)",
                  color: "#F9FAFB",
                  letterSpacing: "-0.02em",
                }}
              >
                {cert.recipient_name}
              </h1>
              <p className="cert-label text-sm mb-4" style={{ color: "#6B7280" }}>
                has successfully completed the
              </p>
              <p
                className="cert-programme text-xl font-bold tracking-wide"
                style={{ color: "#A78BFA", letterSpacing: "0.04em" }}
              >
                {prog.displayName}
              </p>
            </div>

            {/* Decorative divider */}
            <div className="flex items-center gap-4 mb-10">
              <div
                className="cert-divider flex-1 h-px"
                style={{ background: "linear-gradient(90deg, transparent, #1E293B)" }}
              />
              <div className="cert-dot-blue w-2 h-2 rounded-full" style={{ backgroundColor: "#2563EB" }} />
              <div
                className="cert-divider flex-1 h-px"
                style={{ background: "linear-gradient(90deg, #1E293B, transparent)" }}
              />
            </div>

            {/* Bottom section: meta + QR */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-8 mb-10">

              {/* Left — certificate meta */}
              <div className="space-y-4 text-center sm:text-left">
                <div>
                  <p className="cert-meta-label text-[10px] font-bold tracking-[0.18em] uppercase mb-1" style={{ color: "#4B5563" }}>
                    Certificate Number
                  </p>
                  <p className="cert-number font-mono text-sm font-bold" style={{ color: "#9CA3AF" }}>
                    {cert.certificate_number}
                  </p>
                </div>
                <div>
                  <p className="cert-meta-label text-[10px] font-bold tracking-[0.18em] uppercase mb-1" style={{ color: "#4B5563" }}>
                    Date of Issue
                  </p>
                  <p className="cert-meta-value text-sm" style={{ color: "#9CA3AF" }}>
                    {formatDate(cert.issued_at)}
                  </p>
                </div>
                <div>
                  <p className="cert-meta-label text-[10px] font-bold tracking-[0.18em] uppercase mb-1" style={{ color: "#4B5563" }}>
                    Verify at
                  </p>
                  <p className="cert-verify text-xs font-mono" style={{ color: "#6B7280" }}>
                    researchvy.com/verify/{cert.certificate_number}
                  </p>
                </div>
              </div>

              {/* Right — QR code */}
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div className="p-2 rounded-xl" style={{ backgroundColor: "#ffffff" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrUrl}
                    alt={`QR code to verify certificate ${cert.certificate_number}`}
                    width={100}
                    height={100}
                    style={{ display: "block" }}
                  />
                </div>
                <p className="text-[10px]" style={{ color: "#374151" }}>Scan to verify</p>
              </div>
            </div>

            {/* Signature block */}
            <div
              className="cert-sig-line flex items-end justify-between pt-8 border-t"
              style={{ borderColor: "#1E293B" }}
            >
              {/* Left — signatory */}
              <div>
                {/* Signature SVG */}
                <div className="cert-sig mb-2 opacity-70">
                  <svg width="150" height="48" viewBox="0 0 150 48" fill="none" aria-hidden="true">
                    <path
                      d="M6 36 C12 22,22 40,34 28 C42 20,47 37,60 29 C68 23,72 37,88 30 C96 26,100 17,114 21 C122 24,127 33,138 28 C142 25,145 20,148 22"
                      stroke="#4B5563"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="cert-sig-line border-t pt-2" style={{ borderColor: "#1E293B", width: "200px" }}>
                  <p className="cert-sig-name text-sm font-semibold" style={{ color: "#9CA3AF" }}>
                    {siteConfig.certificates.signatory.name}
                  </p>
                  <p className="cert-sig-title text-xs mt-0.5" style={{ color: "#4B5563" }}>
                    {siteConfig.certificates.signatory.title}
                  </p>
                </div>
              </div>

              {/* Right — circular seal */}
              <div className="cert-seal" style={{ color: "#1E3A8A", opacity: 0.6 }}>
                <svg width="84" height="84" viewBox="0 0 100 100" fill="none" aria-label="Researchvy verification seal">
                  <circle cx="50" cy="50" r="47" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1.5" />
                  <defs>
                    <path id="seal-arc" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
                  </defs>
                  <text
                    fontSize="6.2"
                    letterSpacing="3.2"
                    fill="currentColor"
                    fontFamily="Arial, sans-serif"
                    fontWeight="700"
                  >
                    <textPath href="#seal-arc" startOffset="4%">
                      RESEARCHVY • VERIFIED •
                    </textPath>
                  </text>
                  <text
                    x="50"
                    y="58"
                    textAnchor="middle"
                    className="cert-seal-center"
                    fill="currentColor"
                    fontSize="24"
                    fontWeight="800"
                    fontFamily="Georgia, serif"
                  >
                    R
                  </text>
                </svg>
              </div>
            </div>

          </div>

          {/* Bottom gradient bar */}
          <div
            className="cert-btm-bar h-2 w-full"
            style={{ background: "linear-gradient(90deg, #D97706, #7C3AED, #1D4ED8)" }}
          />
        </div>
      </div>

      {/* ── Verification badge (screen only) ─────────────────────────────────── */}
      <div
        className="no-print mt-4 flex items-center gap-2 rounded-xl px-4 py-3"
        style={{ backgroundColor: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}
      >
        <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: "#10B981" }} />
        <p className="text-xs" style={{ color: "#6B7280" }}>
          Publicly verifiable at{" "}
          <a
            href={verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium"
            style={{ color: "#10B981" }}
          >
            researchvy.com/verify/{cert.certificate_number}
          </a>
        </p>
      </div>
    </>
  );
}
