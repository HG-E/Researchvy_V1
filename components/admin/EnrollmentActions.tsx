"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, XCircle } from "lucide-react";

export function EnrollmentActions({ enrollmentId }: { enrollmentId: string }) {
  const router  = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);

  async function revoke() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/enrollments", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ enrollment_id: enrollmentId }),
      });
      if (res.ok) router.refresh();
    } finally {
      setLoading(false);
      setConfirm(false);
    }
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={revoke}
          disabled={loading}
          className="text-[10px] font-bold px-2 py-1 rounded-lg"
          style={{ backgroundColor: "rgba(239,68,68,0.15)", color: "#F87171" }}
        >
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Confirm"}
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="text-[10px]"
          style={{ color: "#4B5563" }}
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="flex items-center gap-1 text-[10px] font-medium transition-colors hover:text-red-400"
      style={{ color: "#4B5563" }}
      title="Revoke enrollment"
    >
      <XCircle className="h-3.5 w-3.5" />
      Revoke
    </button>
  );
}
