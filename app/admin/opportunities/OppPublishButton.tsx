"use client";

import { useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  oppId: string;
  isPublished: boolean;
  submittedBy?: string | null;
}

export function OppPublishButton({ oppId, isPublished, submittedBy }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    if (!isPublished) {
      // Publishing: use the review route so submission_status is updated
      // and submitter gets an email notification
      await fetch(`/api/admin/opportunities/${oppId}/review`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ action: "publish" }),
      });
    } else {
      // Unpublishing: just set is_published via the standard PATCH
      await fetch(`/api/admin/opportunities/${oppId}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ is_published: false }),
      });
    }
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold min-h-[36px] disabled:opacity-60"
      style={{
        backgroundColor: isPublished ? "rgba(239,68,68,0.08)" : "rgba(16,185,129,0.1)",
        color:           isPublished ? "#F87171" : "#10B981",
      }}
    >
      {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : isPublished ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
      {isPublished ? "Unpublish" : "Publish"}
    </button>
  );
}
