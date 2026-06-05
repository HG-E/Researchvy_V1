"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, CheckCircle } from "lucide-react";
import type { EventType, EventFormat, EventRegistrationType, EventTargetAudience } from "@/types/event";

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

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: "conference", label: "Conference" }, { value: "seminar", label: "Seminar" },
  { value: "workshop", label: "Workshop" },    { value: "symposium", label: "Symposium" },
  { value: "webinar", label: "Webinar" },      { value: "lecture", label: "Lecture" },
  { value: "panel", label: "Panel" },          { value: "hackathon", label: "Hackathon" },
  { value: "other", label: "Other" },
];

export default function AdminCreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
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
    organizer_name:           "Researchvy",
    organizer_email:          "events@researchvy.com",
    organizer_type:           "researchvy",
    website_url:              "",
    registration_url:         "",
    registration_type:        "external" as EventRegistrationType,
    capacity:                 "",
    is_free:                  true,
    fee_amount:               "",
    fee_currency:             "NGN",
    call_for_papers_url:      "",
    call_for_papers_deadline: "",
    target_audience:          "all" as EventTargetAudience,
    disciplines:              "",
    tags:                     "",
    is_featured:              false,
    has_travel_funding:       false,
    funding_description:      "",
    is_competitive_admission: false,
    application_url:          "",
  });

  function set(key: string, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit() {
    if (!form.title?.trim())       { setError("Title is required."); return; }
    if (!form.description?.trim()) { setError("Description is required."); return; }
    if (!form.start_date)          { setError("Start date is required."); return; }
    if (!form.organizer_name)      { setError("Organizer name is required."); return; }

    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...form,
        capacity:   form.capacity   ? parseInt(form.capacity)        : undefined,
        fee_amount: form.fee_amount ? parseFloat(form.fee_amount)    : undefined,
        disciplines: form.disciplines ? form.disciplines.split(",").map((s) => s.trim()).filter(Boolean) : [],
        tags:        form.tags        ? form.tags.split(",").map((s) => s.trim()).filter(Boolean)        : [],
        end_date:                 form.end_date || undefined,
        registration_deadline:    form.registration_deadline || undefined,
        call_for_papers_url:      form.call_for_papers_url || undefined,
        call_for_papers_deadline: form.call_for_papers_deadline || undefined,
        website_url:              form.website_url || undefined,
        registration_url:         form.registration_url || undefined,
      };

      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const j = await res.json().catch(() => ({}));
      if (!res.ok) { setError(j.error ?? "Failed to create event."); return; }
      setSuccess(true);
      setTimeout(() => router.push("/admin/events"), 1500);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <CheckCircle className="h-12 w-12 mx-auto mb-4" style={{ color: "#10B981" }} />
          <p className="text-lg font-bold" style={{ color: "#F9FAFB" }}>Event created and published.</p>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>Redirecting to events list…</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/events" className="flex items-center gap-1.5 text-xs font-semibold mb-4"
          style={{ color: "#4B5563" }}>
          <ChevronLeft className="h-3.5 w-3.5" />
          Back to Events
        </Link>
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>Admin › Events › New</p>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>Create Event</h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          Admin-created events are published immediately (no review queue).
        </p>
      </div>

      <div className="max-w-2xl space-y-5">
        <div>
          <label style={labelStyle}>Title *</label>
          <input style={inputStyle} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Event title" />
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
            placeholder="Shown on event cards" />
        </div>

        <div>
          <label style={labelStyle}>Full description *</label>
          <textarea style={{ ...inputStyle, minHeight: "120px", resize: "vertical" }}
            value={form.description} onChange={(e) => set("description", e.target.value)}
            placeholder="Full event description (markdown supported)" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Location</label>
            <input style={inputStyle} value={form.location} onChange={(e) => set("location", e.target.value)}
              placeholder="City, Country or Online" />
          </div>
          <div>
            <label style={labelStyle}>Venue / Platform</label>
            <input style={inputStyle} value={form.venue} onChange={(e) => set("venue", e.target.value)} />
          </div>
        </div>

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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Registration deadline</label>
            <input type="datetime-local" style={inputStyle} value={form.registration_deadline} onChange={(e) => set("registration_deadline", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Capacity</label>
            <input type="number" style={inputStyle} value={form.capacity} onChange={(e) => set("capacity", e.target.value)} placeholder="Leave blank for unlimited" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Organizer name *</label>
            <input style={inputStyle} value={form.organizer_name} onChange={(e) => set("organizer_name", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Organizer type</label>
            <select style={inputStyle} value={form.organizer_type} onChange={(e) => set("organizer_type", e.target.value)}>
              <option value="researchvy">Researchvy</option>
              <option value="partner">Partner</option>
              <option value="external">External</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Registration type</label>
            <select style={inputStyle} value={form.registration_type} onChange={(e) => set("registration_type", e.target.value)}>
              <option value="external">External link</option>
              <option value="internal">Internal RSVP</option>
              <option value="none">Awareness only</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Registration URL</label>
            <input type="url" style={inputStyle} value={form.registration_url} onChange={(e) => set("registration_url", e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Event website</label>
            <input type="url" style={inputStyle} value={form.website_url} onChange={(e) => set("website_url", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Target audience</label>
            <select style={inputStyle} value={form.target_audience} onChange={(e) => set("target_audience", e.target.value)}>
              <option value="all">All researchers</option>
              <option value="early_career">Early-career</option>
              <option value="mid">Mid-career</option>
              <option value="senior">Senior / Professor</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" id="is_free_admin" checked={form.is_free} onChange={(e) => set("is_free", e.target.checked)} className="w-4 h-4 rounded" />
          <label htmlFor="is_free_admin" className="text-sm cursor-pointer" style={{ color: "#D1D5DB" }}>Free to attend</label>
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

        <div>
          <label style={labelStyle}>Disciplines (comma-separated)</label>
          <input style={inputStyle} value={form.disciplines} onChange={(e) => set("disciplines", e.target.value)}
            placeholder="e.g. Public Health, Microbiology" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>CFP URL</label>
            <input type="url" style={inputStyle} value={form.call_for_papers_url} onChange={(e) => set("call_for_papers_url", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>CFP deadline</label>
            <input type="datetime-local" style={inputStyle} value={form.call_for_papers_deadline} onChange={(e) => set("call_for_papers_deadline", e.target.value)} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" id="is_featured_admin" checked={form.is_featured} onChange={(e) => set("is_featured", e.target.checked)} className="w-4 h-4 rounded" />
          <label htmlFor="is_featured_admin" className="text-sm cursor-pointer" style={{ color: "#D1D5DB" }}>★ Feature this event (shown prominently on the board)</label>
        </div>

        {error && (
          <div className="rounded-xl border px-4 py-3 text-sm" style={{ borderColor: "rgba(239,68,68,0.3)", backgroundColor: "rgba(239,68,68,0.06)", color: "#F87171" }}>
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={submit}
            disabled={loading}
            className="rounded-xl px-6 py-3 text-sm font-bold text-white"
            style={{ backgroundColor: "#10B981", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Creating…" : "Create & Publish Event"}
          </button>
          <Link href="/admin/events" className="rounded-xl px-5 py-3 text-sm font-semibold border"
            style={{ borderColor: "#1E293B", color: "#9CA3AF" }}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
