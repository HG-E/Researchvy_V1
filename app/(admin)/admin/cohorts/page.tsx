import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { CohortsClient } from "@/components/admin/CohortsClient";
import { digitalVisibilityClinic } from "@/constants/clinics";

async function getData() {
  const db = createSupabaseAdminClient();

  const { data: unlocks } = await db
    .from("clinic_session_unlocks")
    .select("id, clinic_slug, cohort_id, session_number, unlocked_at, unlocked_by")
    .order("unlocked_at", { ascending: false });

  return { unlocks: unlocks ?? [] };
}

export default async function CohortsPage() {
  const { unlocks } = await getData();
  const totalSessions = digitalVisibilityClinic.sessions.length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>
          Admin Panel
        </p>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
          Session Unlocks
        </h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          Unlock clinic sessions for each cohort as they progress
        </p>
      </div>
      <CohortsClient unlocks={unlocks} totalSessions={totalSessions} />
    </div>
  );
}
