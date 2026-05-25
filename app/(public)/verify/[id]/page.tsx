import { generatePageMetadata } from "@/lib/seo/metadata";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { CheckCircle2, XCircle, Shield } from "lucide-react";
import Link from "next/link";
import { CertificateView } from "@/components/certificates/CertificateView";

interface Props {
  params: Promise<{ id: string }>;
}

interface Certificate {
  certificate_number: string;
  recipient_name:     string;
  programme:          string;
  issued_at:          string;
  clinic_slug?:       string;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const number = id.toUpperCase();
  return generatePageMetadata({
    title:       `Verify Certificate ${number}`,
    description: `Verify the authenticity of Researchvy certificate ${number}.`,
  });
}

async function getCertificate(number: string): Promise<Certificate | null> {
  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from("certificates")
      .select("certificate_number, recipient_name, programme, issued_at, clinic_slug")
      .eq("certificate_number", number)
      .single();

    if (error || !data) return null;
    return data as Certificate;
  } catch {
    return null;
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default async function VerifyPage({ params }: Props) {
  const { id } = await params;
  const number = id.toUpperCase().trim();
  const cert   = await getCertificate(number);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080E1A" }}>
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">

        {/* Breadcrumb */}
        <p className="text-xs font-semibold tracking-widest uppercase mb-8" style={{ color: "#4B5563" }}>
          <Link href="/" className="hover:underline" style={{ color: "#4B5563" }}>Researchvy</Link>
          {" › "}Verify Certificate
        </p>

        {cert ? (
          <>
            {/* Valid badge */}
            <div
              className="flex items-center gap-3 rounded-2xl border px-5 py-4 mb-8"
              style={{ backgroundColor: "rgba(16,185,129,0.06)", borderColor: "rgba(16,185,129,0.2)" }}
            >
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: "#10B981" }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: "#10B981" }}>
                  Certificate Verified
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
                  This certificate is authentic and was issued by Researchvy on {formatDate(cert.issued_at)}.
                </p>
              </div>
            </div>

            {/* Certificate */}
            <CertificateView cert={cert} />
          </>
        ) : (
          <>
            {/* Invalid state */}
            <div
              className="flex items-center gap-3 rounded-2xl border px-5 py-4 mb-8"
              style={{ backgroundColor: "rgba(239,68,68,0.05)", borderColor: "rgba(239,68,68,0.2)" }}
            >
              <XCircle className="h-5 w-5 flex-shrink-0" style={{ color: "#F87171" }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: "#F87171" }}>
                  Certificate Not Found
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
                  No certificate matching <span className="font-mono">{number}</span> was found in our records.
                </p>
              </div>
            </div>

            <div
              className="rounded-2xl border p-10 text-center"
              style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ backgroundColor: "rgba(37,99,235,0.1)" }}
              >
                <Shield className="h-8 w-8" style={{ color: "#2563EB" }} />
              </div>
              <h1
                className="text-xl font-bold mb-2"
                style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
              >
                Certificate Not Found
              </h1>
              <p className="text-sm max-w-sm mx-auto mb-6 leading-relaxed" style={{ color: "#6B7280" }}>
                The certificate number <span className="font-mono font-semibold" style={{ color: "#9CA3AF" }}>{number}</span> does not
                match any record. Please check the certificate number and try again.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
                style={{ backgroundColor: "#2563EB" }}
              >
                Back to Researchvy
              </Link>
            </div>

            <p className="text-center text-xs mt-6" style={{ color: "#4B5563" }}>
              If you believe this is an error, contact{" "}
              <a
                href="mailto:info@researchvy.com"
                className="underline"
                style={{ color: "#6B7280" }}
              >
                info@researchvy.com
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
