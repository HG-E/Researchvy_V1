import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { digitalVisibilityClinic } from "@/constants/clinics";
import { ClinicFeature } from "./ClinicFeature";

async function getSpotsTaken(): Promise<number> {
  try {
    const admin = createSupabaseAdminClient();
    const { count } = await admin
      .from("clinic_enquiries")
      .select("*", { count: "exact", head: true })
      .eq("clinic_slug", "digital-visibility-clinic")
      .neq("status", "declined");
    return count ?? 0;
  } catch {
    return 0;
  }
}

export async function ClinicFeatureWithSpots() {
  const spotsTaken = await getSpotsTaken();
  const spotsLeft  = Math.max(0, digitalVisibilityClinic.capacity - spotsTaken);
  return <ClinicFeature spotsLeft={spotsLeft} />;
}
