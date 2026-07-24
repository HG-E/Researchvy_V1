import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { Award, ExternalLink, Search } from "lucide-react";

export const dynamic  = "force-dynamic";
export const metadata = generatePageMetadata({ title: "Certificates" });

type Cert = {
  id: string;
  certificate_number: string;
  recipient_name: string;
  recipient_email: string;
  programme: string;
  clinic_slug: string;
  issued_at: string;
  issued_by: string | null;
};

export default async function AdminCertificatesPage() {
  const admin = createSupabaseAdminClient();

  const { data } = await admin
    .from("certificates")
    .select("id,certificate_number,recipient_name,recipient_email,programme,clinic_slug,issued_at,issued_by")
    .order("issued_at", { ascending: false })
    .limit(200);

  const certs = (data ?? []) as Cert[];

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>Admin › Certificates</p>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>Certificates</h1>
          <p className="mt-1 text-sm" style={{ color: "#6B7280" }}>
            {certs.length} issued
          </p>
        </div>
      </div>

      {certs.length === 0 ? (
        <div className="rounded-2xl border p-12 text-center" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
          <Award className="h-10 w-10 mx-auto mb-4" style={{ color: "#4B5563" }} />
          <p className="text-sm" style={{ color: "#4B5563" }}>No certificates issued yet.</p>
          <p className="text-xs mt-1" style={{ color: "#374151" }}>Certificates are issued from the Clinics or Enrollments admin page.</p>
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs font-semibold tracking-wider uppercase" style={{ borderColor: "#1E293B", color: "#4B5563" }}>
                  <th className="text-left px-5 py-3">Recipient</th>
                  <th className="text-left px-5 py-3">Programme</th>
                  <th className="text-left px-5 py-3">Certificate #</th>
                  <th className="text-left px-5 py-3">Issued</th>
                  <th className="text-left px-5 py-3">Issued By</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {certs.map((cert) => (
                  <tr key={cert.id} className="border-b" style={{ borderColor: "#1E293B" }}>
                    <td className="px-5 py-4">
                      <p className="text-xs font-semibold" style={{ color: "#F9FAFB" }}>{cert.recipient_name}</p>
                      <p className="text-[11px]" style={{ color: "#4B5563" }}>{cert.recipient_email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: "rgba(245,158,11,0.1)", color: "#F59E0B" }}>
                        {cert.programme}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <code className="text-[11px] font-mono" style={{ color: "#9CA3AF" }}>
                        {cert.certificate_number}
                      </code>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-xs" style={{ color: "#6B7280" }}>
                        {new Date(cert.issued_at).toLocaleDateString("en-GB", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[11px]" style={{ color: "#4B5563" }}>
                        {cert.issued_by ?? "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/verify/${cert.certificate_number}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-[11px] font-medium"
                          style={{ color: "#4B5563" }}
                        >
                          <ExternalLink className="h-3 w-3" /> View
                        </Link>
                        <Link
                          href={`/api/certificates?number=${cert.certificate_number}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-[11px] font-medium"
                          style={{ color: "#4B5563" }}
                        >
                          <Search className="h-3 w-3" /> Verify
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
