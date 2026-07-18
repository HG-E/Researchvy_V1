"use client";

import { useState, useEffect } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

type Prefs = {
  inapp_deadlines: boolean;
  inapp_events:    boolean;
  inapp_system:    boolean;
  email_deadlines: boolean;
  email_events:    boolean;
  push_deadlines:  boolean;
  push_events:     boolean;
};

interface ToggleProps {
  label:       string;
  description: string;
  checked:     boolean;
  onChange:    (val: boolean) => void;
  disabled?:   boolean;
}

function Toggle({ label, description, checked, onChange, disabled }: ToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b last:border-b-0" style={{ borderColor: "#E2E8F0" }}>
      <div className="min-w-0">
        <p className="text-sm font-medium" style={{ color: "#111827" }}>{label}</p>
        <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className="relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ backgroundColor: checked ? "#2563EB" : "#334155" }}
      >
        <span
          className="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out"
          style={{ transform: checked ? "translateX(16px)" : "translateX(0)" }}
        />
      </button>
    </div>
  );
}

interface Section {
  title:   string;
  items:   { key: keyof Prefs; label: string; description: string }[];
}

const SECTIONS: Section[] = [
  {
    title: "In-App Notifications",
    items: [
      { key: "inapp_deadlines", label: "Deadline reminders",      description: "7-day and 1-day warnings for saved opportunities" },
      { key: "inapp_events",    label: "Event reminders",         description: "Events starting tomorrow" },
      { key: "inapp_system",    label: "System notifications",    description: "Platform announcements and updates" },
    ],
  },
  {
    title: "Email Notifications",
    items: [
      { key: "email_deadlines", label: "Deadline reminder emails", description: "Resend email when a saved opportunity is closing soon" },
      { key: "email_events",    label: "Event reminder emails",    description: "Email for events starting tomorrow" },
    ],
  },
  {
    title: "Browser Push",
    items: [
      { key: "push_deadlines", label: "Deadline push notifications", description: "Push to your device for approaching deadlines" },
      { key: "push_events",    label: "Event push notifications",    description: "Push to your device for tomorrow's events" },
    ],
  },
];

export function NotificationPreferences() {
  const [prefs,   setPrefs]   = useState<Prefs | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  useEffect(() => {
    fetch("/api/notification-preferences")
      .then((r) => r.json())
      .then((j: { prefs: Prefs }) => setPrefs(j.prefs))
      .finally(() => setLoading(false));
  }, []);

  async function handleChange(key: keyof Prefs, val: boolean) {
    if (!prefs) return;
    const next = { ...prefs, [key]: val };
    setPrefs(next);
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/notification-preferences", {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ [key]: val }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin" style={{ color: "#6B7280" }} />
      </div>
    );
  }

  if (!prefs) return null;

  return (
    <div className="space-y-5">
      {SECTIONS.map((section) => (
        <div key={section.title} className="rounded-2xl border p-5" style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold" style={{ color: "#111827" }}>{section.title}</h3>
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" style={{ color: "#6B7280" }} />}
            {saved  && !saving && <CheckCircle2 className="h-3.5 w-3.5" style={{ color: "#10B981" }} />}
          </div>
          <div>
            {section.items.map(({ key, label, description }) => (
              <Toggle
                key={key}
                label={label}
                description={description}
                checked={prefs[key]}
                onChange={(val) => handleChange(key, val)}
                disabled={saving}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
