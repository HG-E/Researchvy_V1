import Link from "next/link";
import { Award, ArrowRight, Shield } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { createSupabaseAdminClient, getServerUser } from "@/lib/auth/supabase";
import { CertificateView } from "@/components/certificates/CertificateView";

export const metadata = generatePageMetadata({ title: "My Certificates", noIndex: true });

interface Certificate {
  certificate_number: string;
  recipient_name:     string;
  programme:          string;
  issued_at:          string;
  clinic_slug?:       string;
}

async function getUserCertificates(userId: string): Promise<Certificate[]> {
  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from("certificates")
      .select("certificate_number, recipient_name, programme, issued_at, clinic_slug")
      .eq("user_id", userId)
      .order("issued_at", { ascending: false });

    if (error) return [];
    return (data ?? []) as Certificate[];
  } catch {
    return [];
  }
}

export default async function CertificatesPage() {
  const user = await getServerUser();
  const certificates = user ? await getUserCertificates(user.id) : [];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-1"
          style={{ color: "#2563EB" }}
        >
          Dashboard
        </p>
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
        >
          Certificates
        </h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          Your earned Researchvy programme certificates
        </p>
      </div>

      {certificates.length === 0 ? (
        <>
          {/* Empty state */}
          <div
            className="rounded-2xl border p-12 flex flex-col items-center text-center"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
              style={{ backgroundColor: "rgba(245,158,11,0.1)" }}
            >
              <Award className="h-10 w-10" style={{ color: "#F59E0B" }} />
            </div>
            <h2 className="text-lg font-bold mb-2" style={{ color: "#F9FAFB" }}>
              No certificates yet
            </h2>
            <p className="text-sm max-w-sm mb-8 leading-relaxed" style={{ color: "#6B7280" }}>
              Complete a Researchvy clinic or programme to earn your first certificate. Certificates
              are downloadable and shareable on LinkedIn.
            </p>
            <Link
              href="/clinics"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200"
              style={{ backgroundColor: "#2563EB" }}
            >
              Join a Clinic to Earn One <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Certificate info */}
          <div
            className="rounded-2xl border p-6"
            style={{ backgroundColor: "#0A0F1A", borderColor: "#1E293B" }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(37,99,235,0.1)" }}
              >
                <Shield className="h-5 w-5" style={{ color: "#2563EB" }} />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-2" style={{ color: "#F9FAFB" }}>
                  About Researchvy Certificates
                </h3>
                <ul className="space-y-1.5 text-xs" style={{ color: "#6B7280" }}>
                  <li>• Issued upon successful completion of a clinic or programme</li>
                  <li>• Verifiable with a unique certificate ID</li>
                  <li>• Downloadable as a PDF and shareable to LinkedIn</li>
                  <li>• Recognised by partner institutions in our network</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-10">
          {certificates.map((cert) => (
            <div key={cert.certificate_number}>
              <CertificateView cert={cert} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
