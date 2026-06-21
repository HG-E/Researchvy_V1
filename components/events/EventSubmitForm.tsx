"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import type { EventType, EventFormat, EventRegistrationType, EventTargetAudience } from "@/types/event";
import { useAnalytics } from "@/hooks/useAnalytics";
import { EVENTS } from "@/lib/analytics/events";

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: "conference",  label: "Conference"  },
  { value: "seminar",     label: "Seminar"     },
  { value: "workshop",    label: "Workshop"    },
  { value: "symposium",   label: "Symposium"   },
  { value: "webinar",     label: "Webinar"     },
  { value: "lecture",     label: "Lecture"     },
  { value: "panel",       label: "Panel"       },
  { value: "hackathon",   label: "Hackathon"   },
  { value: "other",       label: "Other"       },
];

const AUDIENCES: { value: EventTargetAudience; label: string }[] = [
  { value: "all",          label: "All researchers"    },
  { value: "early_career", label: "Early-career"       },
  { value: "mid",          label: "Mid-career"         },
  { value: "senior",       label: "Senior / Professor" },
];

const inputStyle: React.CSSProperties = {
  backgroundColor: "#0A0F1A",
  border:          "1px solid #1E293B",
  borderRadius:    "10px",
  color:           "#F9FAFB",
  fontSize:        "14px",
  padding:         "12px 14px",
  width:           "100%",
  outline:         "none",
};

const labelStyle: React.CSSProperties = {
  display:       "block",
  color:         "#9CA3AF",
  fontSize:      "12px",
  fontWeight:    600,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  marginBottom:  "6px",
};

export function EventSubmitForm() {
  const router = useRouter();
  const { track } = useAnalytics();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title:                    "",
    short_description:        "",
    description:              "",
    event_type:               "conference" as EventType,
    format:                   "in-person" as EventFormat,
    location:                 "",
    venue:                    "",
    start_date:               "",
    end_date:                 "",
    registration_deadline:    "",
    organizer_name:           "",
    organizer_email:          "",
    website_url:              "",
    registration_url:         "",
    registration_type:        "external" as EventRegistrationType,
    is_free:                  true,
    fee_amount:               "",
    fee_currency:             "NGN",
    call_for_papers_url:      "",
    call_for_papers_deadline: "",
    target_audience:          "all" as EventTargetAudience,
    disciplines:              "",
    tags:                     "",
    // Funding + competitive admission (migration 027)
    has_travel_funding:       false,
    funding_description:      "",
    is_competitive_admission: false,
    application_url:          "",
  });

  function set(key: string, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...form,
        is_free:    form.is_free,
        fee_amount: form.fee_amount ? parseFloat(form.fee_amount) : undefined,
        disciplines: form.disciplines ? form.disciplines.split(",").map((s) => s.trim()).filter(Boolean) : [],
        tags:        form.tags        ? form.tags.split(",").map((s) => s.trim()).filter(Boolean)        : [],
        end_date:                 form.end_date || undefined,
        registration_deadline:    form.registration_deadline || undefined,
        call_for_papers_url:      form.call_for_papers_url || undefined,
        call_for_papers_deadline: form.call_for_papers_deadline || undefined,
        website_url:              form.website_url || undefined,
        registration_url:         form.registration_url || undefined,
        has_travel_funding:       form.has_travel_funding,
        funding_description:      form.funding_description || undefined,
        is_competitive_admission: form.is_competitive_admission,
        application_url:          form.application_url || undefined,
      };

      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const j = await res.json().catch(() => ({}));
      if (!res.ok) { setError(j.error ?? "Submission failed."); return; }
      track(EVENTS.EVENT_SUBMITTED, { event_type: form.event_type, format: form.format });
      setSuccess(true);
    } catch {
      setError("Connection error. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border p-10 text-center" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ backgroundColor: "rgba(16,185,129,0.12)" }}>
          <CheckCircle className="h-7 w-7" style={{ color: "#10B981" }} />
        </div>
        <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
          Event submitted for review
        </h2>
        <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: "#6B7280" }}>
          We&apos;ll review your event within 2 business days. You&apos;ll receive an email when it goes live on the board.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => router.push("/events")}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
            style={{ backgroundColor: "#2563EB" }}
          >
            Browse Events
          </button>
          <button
            onClick={() => router.push("/dashboard/events")}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold border"
            style={{ borderColor: "#1E293B", color: "#9CA3AF" }}
          >
            My Submissions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
              style={{
                backgroundColor: step >= s ? "#2563EB" : "#1E293B",
                color:           step >= s ? "#fff"    : "#4B5563",
              }}
            >
              {s}
            </div>
            {s < 3 && <div className="w-8 h-px" style={{ backgroundColor: step > s ? "#2563EB" : "#1E293B" }} />}
          </div>
        ))}
        <span className="ml-2 text-xs" style={{ color: "#6B7280" }}>
          {step === 1 ? "Event basics" : step === 2 ? "Dates & registration" : "Review & submit"}
        </span>
      </div>

      {/* Step 1 — Event basics */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label style={labelStyle}>Event title *</label>
            <input style={inputStyle} value={form.title} onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. 3rd Annual African Science Communication Symposium" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Event type *</label>
              <select style={inputStyle} value={form.event_type} onChange={(e) => set("event_type", e.target.value)}>
                {EVENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Format *</label>
              <select style={inputStyle} value={form.format} onChange={(e) => set("format", e.target.value)}>
                <option value="in-person">In-Person</option>
                <option value="virtual">Virtual</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>One-line summary</label>
            <input style={inputStyle} value={form.short_description} onChange={(e) => set("short_description", e.target.value)}
              placeholder="Brief description shown on event cards (max 160 chars)" maxLength={160} />
          </div>

          <div>
            <label style={labelStyle}>Full description *</label>
            <textarea
              style={{ ...inputStyle, minHeight: "140px", resize: "vertical" }}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Who is this event for? What will attendees learn or experience? Include agenda highlights, speakers, themes."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Location / City</label>
              <input style={inputStyle} value={form.location} onChange={(e) => set("location", e.target.value)}
                placeholder={form.format === "virtual" ? "Online" : "e.g. Abuja, Nigeria"} />
            </div>
            <div>
              <label style={labelStyle}>Venue / Platform</label>
              <input style={inputStyle} value={form.venue} onChange={(e) => set("venue", e.target.value)}
                placeholder={form.format === "virtual" ? "e.g. Zoom, Google Meet" : "e.g. University Auditorium"} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Target audience</label>
            <select style={inputStyle} value={form.target_audience} onChange={(e) => set("target_audience", e.target.value)}>
              {AUDIENCES.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Organizer name *</label>
              <input style={inputStyle} value={form.organizer_name} onChange={(e) => set("organizer_name", e.target.value)}
                placeholder="Your institution or organization" />
            </div>
            <div>
              <label style={labelStyle}>Organizer email</label>
              <input type="email" style={inputStyle} value={form.organizer_email} onChange={(e) => set("organizer_email", e.target.value)}
                placeholder="contact@organization.com" />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Disciplines (comma-separated)</label>
            <input style={inputStyle} value={form.disciplines} onChange={(e) => set("disciplines", e.target.value)}
              placeholder="e.g. Public Health, Epidemiology, Molecular Biology" />
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => {
                if (!form.title.trim())          { setError("Event title is required."); return; }
                if (!form.description.trim())    { setError("Description is required."); return; }
                if (!form.organizer_name.trim()) { setError("Organizer name is required."); return; }
                setError(null);
                setStep(2);
              }}
              className="rounded-xl px-6 py-3 text-sm font-bold text-white"
              style={{ backgroundColor: "#2563EB" }}
            >
              Next: Dates & Registration →
            </button>
          </div>
        </div>
      )}

      {/* Step 2 — Dates & registration */}
      {step === 2 && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Start date *</label>
              <input type="datetime-local" style={inputStyle} value={form.start_date} onChange={(e) => set("start_date", e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>End date</label>
              <input type="datetime-local" style={inputStyle} value={form.end_date} onChange={(e) => set("end_date", e.target.value)} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Registration deadline</label>
            <input type="datetime-local" style={inputStyle} value={form.registration_deadline}
              onChange={(e) => set("registration_deadline", e.target.value)} />
          </div>

          <div className="rounded-xl border p-4 space-y-4" style={{ borderColor: "#1E293B", backgroundColor: "#080E1A" }}>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#4B5563" }}>Registration type</p>
            <div className="flex gap-3">
              {[
                { value: "external", label: "External link", desc: "Direct to your own registration page" },
                { value: "internal", label: "Internal RSVP", desc: "Researchers register directly on Researchvy" },
                { value: "none",     label: "Awareness only", desc: "No registration — just visibility" },
              ].map((opt) => (
                <label key={opt.value} className="flex-1 cursor-pointer">
                  <input type="radio" name="reg_type" value={opt.value} checked={form.registration_type === opt.value}
                    onChange={(e) => set("registration_type", e.target.value)} className="sr-only" />
                  <div className="rounded-xl border p-3 transition-all" style={{
                    borderColor: form.registration_type === opt.value ? "#2563EB" : "#1E293B",
                    backgroundColor: form.registration_type === opt.value ? "rgba(37,99,235,0.06)" : "transparent",
                  }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: "#F9FAFB" }}>{opt.label}</p>
                    <p className="text-[11px] leading-relaxed" style={{ color: "#4B5563" }}>{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {form.registration_type === "external" && (
            <div>
              <label style={labelStyle}>Registration URL *</label>
              <input type="url" style={inputStyle} value={form.registration_url} onChange={(e) => set("registration_url", e.target.value)}
                placeholder="https://eventbrite.com/..." />
            </div>
          )}

          <div>
            <label style={labelStyle}>Event website</label>
            <input type="url" style={inputStyle} value={form.website_url} onChange={(e) => set("website_url", e.target.value)}
              placeholder="https://yourconference.com" />
          </div>

          <div className="rounded-xl border p-4 space-y-4" style={{ borderColor: "#1E293B", backgroundColor: "#080E1A" }}>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="is_free" checked={form.is_free}
                onChange={(e) => set("is_free", e.target.checked)}
                className="w-4 h-4 rounded" />
              <label htmlFor="is_free" className="text-sm cursor-pointer" style={{ color: "#D1D5DB" }}>
                This event is free to attend
              </label>
            </div>
            {!form.is_free && (
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label style={labelStyle}>Fee amount</label>
                  <input type="number" style={inputStyle} value={form.fee_amount} onChange={(e) => set("fee_amount", e.target.value)} placeholder="0" min="0" />
                </div>
                <div>
                  <label style={labelStyle}>Currency</label>
                  <select style={inputStyle} value={form.fee_currency} onChange={(e) => set("fee_currency", e.target.value)}>
                    <option value="NGN">NGN</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Call for Papers URL</label>
              <input type="url" style={inputStyle} value={form.call_for_papers_url} onChange={(e) => set("call_for_papers_url", e.target.value)}
                placeholder="https://easychair.org/..." />
            </div>
            <div>
              <label style={labelStyle}>CFP Deadline</label>
              <input type="datetime-local" style={inputStyle} value={form.call_for_papers_deadline}
                onChange={(e) => set("call_for_papers_deadline", e.target.value)} />
            </div>
          </div>

          {/* Funding + competitive admission */}
          <div className="rounded-xl border p-4 space-y-4" style={{ borderColor: "#1E293B", backgroundColor: "#080E1A" }}>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#4B5563" }}>Funding &amp; Admission</p>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={form.has_travel_funding}
                onChange={(e) => set("has_travel_funding", e.target.checked)}
                className="w-4 h-4 rounded mt-0.5" />
              <div>
                <p className="text-sm font-medium" style={{ color: "#D1D5DB" }}>Travel funding / bursary is available for this event</p>
                <p className="text-[11px] mt-0.5" style={{ color: "#4B5563" }}>A badge will appear on the event card so researchers can spot funded opportunities immediately.</p>
              </div>
            </label>
            {form.has_travel_funding && (
              <div>
                <label style={labelStyle}>Funding details (optional)</label>
                <input style={inputStyle} value={form.funding_description} onChange={(e) => set("funding_description", e.target.value)}
                  placeholder="e.g. Full travel + accommodation for early-career researchers from LMICs" />
              </div>
            )}
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={form.is_competitive_admission}
                onChange={(e) => set("is_competitive_admission", e.target.checked)}
                className="w-4 h-4 rounded mt-0.5" />
              <div>
                <p className="text-sm font-medium" style={{ color: "#D1D5DB" }}>Attendance is competitive (application required)</p>
                <p className="text-[11px] mt-0.5" style={{ color: "#4B5563" }}>For workshops, training programmes, or residencies where attendees must be selected.</p>
              </div>
            </label>
            {form.is_competitive_admission && (
              <div>
                <label style={labelStyle}>Application URL</label>
                <input type="url" style={inputStyle} value={form.application_url} onChange={(e) => set("application_url", e.target.value)}
                  placeholder="https://forms.example.com/apply" />
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button onClick={() => setStep(1)} className="rounded-xl px-5 py-2.5 text-sm font-semibold border"
              style={{ borderColor: "#1E293B", color: "#9CA3AF" }}>
              ← Back
            </button>
            <button
              onClick={() => {
                if (!form.start_date) { setError("Start date is required."); return; }
                if (form.registration_type === "external" && !form.registration_url && !form.is_competitive_admission) {
                  setError("Registration URL is required for external registration."); return;
                }
                setError(null);
                setStep(3);
              }}
              className="rounded-xl px-6 py-3 text-sm font-bold text-white"
              style={{ backgroundColor: "#2563EB" }}
            >
              Next: Review & Submit →
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Review & submit */}
      {step === 3 && (
        <div className="space-y-5">
          <div className="rounded-2xl border p-6" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#4B5563" }}>Review your submission</p>
            <dl className="space-y-3">
              {[
                ["Title",         form.title],
                ["Type",          form.event_type],
                ["Format",        form.format],
                ["Location",      form.location || "—"],
                ["Start date",    form.start_date ? new Date(form.start_date).toLocaleString("en-GB") : "—"],
                ["Organizer",     form.organizer_name],
                ["Registration",  form.registration_type],
                ["Fee",           form.is_free ? "Free" : `${form.fee_currency} ${form.fee_amount}`],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-4">
                  <dt className="w-28 text-xs font-semibold shrink-0" style={{ color: "#6B7280" }}>{k}</dt>
                  <dd className="text-sm capitalize" style={{ color: "#D1D5DB" }}>{String(v)}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-xl border px-4 py-3 text-xs leading-relaxed" style={{ borderColor: "rgba(37,99,235,0.2)", backgroundColor: "rgba(37,99,235,0.04)", color: "#6B7280" }}>
            By submitting, you confirm this is an academic event and all information is accurate.
            Researchvy reserves the right to decline submissions that don&apos;t meet our community guidelines.
          </div>

          {error && (
            <div className="rounded-xl border px-4 py-3 text-sm" style={{ borderColor: "rgba(239,68,68,0.3)", backgroundColor: "rgba(239,68,68,0.06)", color: "#F87171" }}>
              {error}
            </div>
          )}

          <div className="flex justify-between">
            <button onClick={() => setStep(2)} className="rounded-xl px-5 py-2.5 text-sm font-semibold border"
              style={{ borderColor: "#1E293B", color: "#9CA3AF" }}>
              ← Back
            </button>
            <button
              onClick={submit}
              disabled={loading}
              className="rounded-xl px-6 py-3 text-sm font-bold text-white"
              style={{ backgroundColor: "#10B981", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Submitting…" : "Submit Event for Review"}
            </button>
          </div>
        </div>
      )}

      {error && step < 3 && (
        <div className="mt-4 rounded-xl border px-4 py-3 text-sm" style={{ borderColor: "rgba(239,68,68,0.3)", backgroundColor: "rgba(239,68,68,0.06)", color: "#F87171" }}>
          {error}
        </div>
      )}
    </div>
  );
}
