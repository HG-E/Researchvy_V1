export const dynamic = "force-dynamic";

import { generatePageMetadata } from "@/lib/seo/metadata";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { ClinicParticipantsClient } from "@/components/admin/ClinicParticipantsClient";
import type { ParticipantRow } from "@/components/admin/ClinicParticipantsTable";
import { AlertCircle } from "lucide-react";

export const metadata = generatePageMetadata({ title: "Clinic Participants — Admin" });

async function getParticipants(): Promise<{ rows: ParticipantRow[]; error: boolean }> {
  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from("clinic_participants")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return { rows: (data ?? []) as ParticipantRow[], error: false };
  } catch {
    return { rows: [], error: true };
  }
}

export default async function ClinicParticipantsPage() {
  const { rows, error } = await getParticipants();

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>
          Admin › Clinics › Participants
        </p>
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
        >
          Clinic Participants
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#6B7280" }}>
          August 2026 cohort · Admin assigns access — every participant is Pending until you grant it
        </p>
      </div>

      {error && (
        <div
          className="flex items-start gap-3 rounded-xl border px-5 py-4 mb-6"
          style={{ backgroundColor: "rgba(239,68,68,0.05)", borderColor: "rgba(239,68,68,0.2)" }}
        >
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#FCA5A5" }} />
          <p className="text-sm" style={{ color: "#9CA3AF" }}>
            Could not load participants — check that{" "}
            <code className="text-xs px-1 rounded" style={{ backgroundColor: "#1E293B", color: "#60A5FA" }}>
              clinic_participants
            </code>{" "}
            table exists and{" "}
            <code className="text-xs px-1 rounded" style={{ backgroundColor: "#1E293B", color: "#60A5FA" }}>
              SUPABASE_SERVICE_ROLE_KEY
            </code>{" "}
            is set.
          </p>
        </div>
      )}

      <ClinicParticipantsClient initial={rows} />
    </div>
  );
}
