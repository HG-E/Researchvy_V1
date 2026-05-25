"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Award, Loader2, CheckCircle2, ExternalLink } from "lucide-react";

type Cert = {
  id: string; certificate_number: string;
  recipient_name: string; recipient_email: string;
  programme: string; clinic_slug: string;
  issued_by: string | null; issued_at: string;
};
type EnrolledEnquiry = {
  id: string; full_name: string; email: string;
  clinic_slug: string; status: string;
};

const INPUT = "w-full rounded-xl px-4 py-2.5 text-sm border outline-none transition-colors";
const INPUT_STYLE = { backgroundColor: "#1E293B", borderColor: "#334155", color: "#F9FAFB" };

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function CertificatesClient({
  certs, enrolledEnquiries,
}: { certs: Cert[]; enrolledEnquiries: EnrolledEnquiry[] }) {
  const router = useRouter();
  const [tab, setTab]             = useState<"issue" | "history">("issue");
  const [recipientName, setName]  = useState("");
  const [recipientEmail, setEmail]= useState("");
  const [enquiryId, setEnquiryId] = useState("");
  const [clinicSlug, setSlug]     = useState("digital-visibility-clinic");
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState<{ ok: boolean; number?: string; error?: string } | null>(null);

  function prefillFromEnquiry(id: string) {
    setEnquiryId(id);
    const e = enrolledEnquiries.find((x) => x.id === id);
    if (e) {
      setName(e.full_name);
      setEmail(e.email);
      setSlug(e.clinic_slug);
    }
  }

  async function handleIssue() {
    if (!recipientName || !recipientEmail) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/certificates", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          recipient_name:  recipientName,
          recipient_email: recipientEmail,
          enquiry_id:      enquiryId || undefined,
          clinic_slug:     clinicSlug,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        setResult({ ok: true, number: json.certificate?.certificate_number });
        setName(""); setEmail(""); setEnquiryId("");
        router.refresh();
      } else {
        setResult({ ok: false, error: json.error });
      }
    } catch {
      setResult({ ok: false, error: "Network error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b" style={{ borderColor: "#1E293B" }}>
        {(["issue", "history"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2.5 text-sm font-medium capitalize transition-colors -mb-px border-b-2"
            style={{
              color:       tab === t ? "#60A5FA" : "#6B7280",
              borderColor: tab === t ? "#2563EB" : "transparent",
            }}
          >
            {t === "issue" ? "Issue Certificate" : `History (${certs.length})`}
          </button>
        ))}
      </div>

      {/* Issue form */}
      {tab === "issue" && (
        <div className="max-w-xl">
          <div
            className="rounded-2xl border p-6 space-y-4"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            {/* Quick-fill from enrolled */}
            {enrolledEnquiries.length > 0 && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#6B7280" }}>
                  Quick-fill from enrolled enquiry
                </label>
                <select
                  value={enquiryId}
                  onChange={(e) => prefillFromEnquiry(e.target.value)}
                  className={INPUT}
                  style={INPUT_STYLE}
                >
                  <option value="">— Select an enrolled participant —</option>
                  {enrolledEnquiries.map((e) => (
                    <option key={e.id} value={e.id} style={{ backgroundColor: "#0F172A" }}>
                      {e.full_name} — {e.email}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#6B7280" }}>
                Recipient Full Name *
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Jane Researcher"
                className={INPUT}
                style={INPUT_STYLE}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#6B7280" }}>
                Recipient Email *
              </label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="researcher@university.edu"
                className={INPUT}
                style={INPUT_STYLE}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#6B7280" }}>
                Clinic
              </label>
              <select
                value={clinicSlug}
                onChange={(e) => setSlug(e.target.value)}
                className={INPUT}
                style={INPUT_STYLE}
              >
                <option value="digital-visibility-clinic" style={{ backgroundColor: "#0F172A" }}>
                  Digital Visibility Clinic
                </option>
              </select>
            </div>

            {result && (
              <div
                className="rounded-xl px-4 py-3 text-sm flex items-start gap-2"
                style={{
                  backgroundColor: result.ok ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
                  border:          `1px solid ${result.ok ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
                  color:           result.ok ? "#10B981" : "#F87171",
                }}
              >
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                {result.ok
                  ? `Certificate issued: ${result.number}. Email sent to recipient.`
                  : result.error}
              </div>
            )}

            <button
              onClick={handleIssue}
              disabled={loading || !recipientName || !recipientEmail}
              className="w-full rounded-xl py-3 text-sm font-semibold text-white flex items-center justify-center gap-2 transition-opacity disabled:opacity-50"
              style={{ backgroundColor: "#2563EB" }}
            >
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Issuing…</> : <><Award className="h-4 w-4" /> Issue Certificate</>}
            </button>

            <p className="text-xs text-center" style={{ color: "#4B5563" }}>
              Certificate email is sent automatically to the recipient upon issuance.
            </p>
          </div>
        </div>
      )}

      {/* History */}
      {tab === "history" && (
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <table className="w-full text-sm">
            <thead style={{ borderBottom: "1px solid #1E293B" }}>
              <tr>
                {["Certificate No.", "Recipient", "Email", "Programme", "Issued By", "Date", "Verify"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold tracking-wide" style={{ color: "#4B5563" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {certs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm" style={{ color: "#4B5563" }}>
                    No certificates issued yet
                  </td>
                </tr>
              ) : certs.map((c, i) => (
                <tr key={c.id} style={{ borderTop: i === 0 ? "none" : "1px solid #1E293B" }}>
                  <td className="px-4 py-3 font-mono text-xs font-semibold" style={{ color: "#60A5FA" }}>
                    {c.certificate_number}
                  </td>
                  <td className="px-4 py-3 font-medium" style={{ color: "#F9FAFB" }}>{c.recipient_name}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#6B7280" }}>{c.recipient_email}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#9CA3AF" }}>
                    {c.programme.length > 30 ? c.programme.slice(0, 30) + "…" : c.programme}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#6B7280" }}>{c.issued_by ?? "—"}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#4B5563" }}>{fmt(c.issued_at)}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`/verify/${c.certificate_number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs transition-colors hover:text-white"
                      style={{ color: "#2563EB" }}
                    >
                      View <ExternalLink className="h-3 w-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
