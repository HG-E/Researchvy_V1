import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { CertificatesClient } from "@/components/admin/CertificatesClient";

async function getData() {
  const db = createSupabaseAdminClient();

  const { data: certs } = await db
    .from("certificates")
    .select("id, certificate_number, recipient_name, recipient_email, programme, clinic_slug, issued_by, issued_at")
    .order("issued_at", { ascending: false });

  const { data: enquiries } = await db
    .from("clinic_enquiries")
    .select("id, full_name, email, clinic_slug, status")
    .eq("status", "enrolled")
    .order("created_at", { ascending: false });

  return {
    certs:     certs     ?? [],
    enquiries: enquiries ?? [],
  };
}

export default async function CertificatesPage() {
  const data = await getData();
  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>
          Admin Panel
        </p>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
          Certificates
        </h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          Issue completion certificates and view history
        </p>
      </div>
      <CertificatesClient certs={data.certs} enrolledEnquiries={data.enquiries} />
    </div>
  );
}
