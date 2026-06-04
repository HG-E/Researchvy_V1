"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function OppDeleteButton({ oppId }: { oppId: string }) {
  const router  = useRouter();
  const [loading, setLoading] = useState(false);

  async function remove() {
    if (!confirm("Delete this opportunity?")) return;
    setLoading(true);
    await fetch(`/api/admin/opportunities/${oppId}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={remove}
      disabled={loading}
      className="inline-flex items-center gap-1 text-[11px] disabled:opacity-60"
      style={{ color: "#374151" }}
    >
      {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
      Delete
    </button>
  );
}
