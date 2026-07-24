"use client";

import { useState } from "react";
import { UserPlus, Loader2 } from "lucide-react";
import type { ParticipantRow } from "./ClinicParticipantsTable";

interface Props {
  onAdded: (row: ParticipantRow) => void;
}

const inputStyle = {
  backgroundColor: "#0F172A",
  borderColor:     "#1E293B",
  color:           "#F9FAFB",
};

export function AddClinicParticipantForm({ onAdded }: Props) {
  const [open,    setOpen]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [form,    setForm]    = useState({
    full_name:   "",
    email:       "",
    phone:       "",
    bundle:      "core",
    track:       "",
    mode:        "online",
    payment_ref: "",
    notes:       "",
  });

  function set(k: string, v: string) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/clinic-participants", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        setError((json as { error?: string }).error ?? "Failed");
      } else {
        onAdded(json as ParticipantRow);
        setForm({ full_name: "", email: "", phone: "", bundle: "core", track: "", mode: "online", payment_ref: "", notes: "" });
        setOpen(false);
      }
    } catch {
      setError("Network error");
    }
    setLoading(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
        style={{ backgroundColor: "#2563EB" }}
      >
        <UserPlus className="h-4 w-4" />
        Add Participant Manually
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border p-5 space-y-4"
      style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
    >
      <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#2563EB" }}>
        Add Participant
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Full name */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "#4B5563" }}>
            Full Name *
          </label>
          <input
            required
            type="text"
            value={form.full_name}
            onChange={(e) => set("full_name", e.target.value)}
            placeholder="Dr. Amaka Okonkwo"
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
            style={inputStyle}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "#4B5563" }}>
            Email *
          </label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="amaka@university.edu.ng"
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
            style={inputStyle}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "#4B5563" }}>
            Phone (optional)
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+234 800 000 0000"
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
            style={inputStyle}
          />
        </div>

        {/* Payment ref */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "#4B5563" }}>
            Payment Ref (optional)
          </label>
          <input
            type="text"
            value={form.payment_ref}
            onChange={(e) => set("payment_ref", e.target.value)}
            placeholder="Order ID or bank transfer ref"
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
            style={inputStyle}
          />
        </div>

        {/* Bundle */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "#4B5563" }}>
            Bundle *
          </label>
          <select
            required
            value={form.bundle}
            onChange={(e) => set("bundle", e.target.value)}
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
            style={inputStyle}
          >
            <option value="solo">Solo</option>
            <option value="core">Core</option>
            <option value="pro">Pro</option>
          </select>
        </div>

        {/* Track */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "#4B5563" }}>
            Track
          </label>
          <select
            value={form.track}
            onChange={(e) => set("track", e.target.value)}
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
            style={inputStyle}
          >
            <option value="">Not yet assigned</option>
            <option value="wednesday">Wednesday</option>
            <option value="sunday">Sunday</option>
          </select>
        </div>

        {/* Mode */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "#4B5563" }}>
            Mode
          </label>
          <select
            value={form.mode}
            onChange={(e) => set("mode", e.target.value)}
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
            style={inputStyle}
          >
            <option value="online">Online (Live)</option>
            <option value="offline">In-person</option>
          </select>
        </div>

        {/* Notes */}
        <div className="sm:col-span-2">
          <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "#4B5563" }}>
            Admin Notes (optional)
          </label>
          <input
            type="text"
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Internal note — not visible to participant"
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
            style={inputStyle}
          />
        </div>
      </div>

      {error && <p className="text-xs" style={{ color: "#F87171" }}>{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          style={{ backgroundColor: "#2563EB" }}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          Add — status will be Pending
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm"
          style={{ color: "#4B5563" }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
