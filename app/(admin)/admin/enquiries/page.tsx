import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { EnquiriesClient } from "@/components/admin/EnquiriesClient";

async function getData() {
  const db = createSupabaseAdminClient();

  const [
    { data: clinic },
    { data: academy },
    { data: partnership },
  ] = await Promise.all([
    db.from("clinic_enquiries")
      .select("id, full_name, email, clinic_slug, notes, status, created_at")
      .order("created_at", { ascending: false }),
    db.from("academy_enquiries")
      .select("id, full_name, email, programme_slug, notes, status, created_at")
      .order("created_at", { ascending: false }),
    db.from("partnership_enquiries")
      .select("id, contact_name, contact_email, institution, researcher_count, interest_area, message, status, created_at")
      .order("created_at", { ascending: false }),
  ]);

  return {
    clinic:      clinic      ?? [],
    academy:     academy     ?? [],
    partnership: partnership ?? [],
  };
}

export default async function EnquiriesPage() {
  const data = await getData();
  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>
          Admin Panel
        </p>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
          Enquiries
        </h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          Manage clinic, academy, and partnership enquiries
        </p>
      </div>
      <EnquiriesClient
        clinic={data.clinic}
        academy={data.academy}
        partnership={data.partnership}
      />
    </div>
  );
}
