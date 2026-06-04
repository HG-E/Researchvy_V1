import { generatePageMetadata } from "@/lib/seo/metadata";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { CheckCircle2, XCircle, Shield, Award, Calendar, BookOpen } from "lucide-react";
import Link from "next/link";
import { CertificateView } from "@/components/certificates/CertificateView";
import { CertShareButtons } from "@/components/certificates/CertShareButtons";

interface Props {
  params: Promise<{ id: string }>;
}

// ── Clinic certificate (from `certificates` table) ────────────────────────────

interface ClinicCert {
  certificate_number: string;
  recipient_name:     string;
  programme:          string;
  issued_at:          string;
  clinic_slug?:       string;
}

async function getClinicCert(number: string): Promise<ClinicCert | null> {
  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from("certificates")
      .select("certificate_number, recipient_name, programme, issued_at, clinic_slug")
      .eq("certificate_number", number)
      .single();
    if (error || !data) return null;
    return data as ClinicCert;
  } catch {
    return null;
  }
}

// ── Academy certificate (from enrollments UUID prefix) ────────────────────────

interface AcademyCert {
  certId:        string;
  researcherName: string;
  courseTitle:   string;
  courseSlug:    string;
  courseLevel:   number;
  completedAt:   string;
}

const LEVEL_LABELS: Record<number, string> = {
  1: "Foundations", 2: "Intermediate", 3: "Advanced", 4: "Expert", 5: "Master",
};

async function getAcademyCert(certId: string): Promise<AcademyCert | null> {
  const match = certId.toUpperCase().match(/^RVY-([A-Z0-9]{8})$/);
  if (!match) return null;
  const code = match[1].toLowerCase();

  const admin = createSupabaseAdminClient();
  const { data: enrollments } = await admin
    .from("enrollments")
    .select("id, completed_at, user_id, course_id")
    .filter("id::text", "ilike", `${code}%`)
    .not("completed_at", "is", null)
    .limit(1);

  const enrollment = enrollments?.[0];
  if (!enrollment) return null;

  const [{ data: course }, { data: profile }] = await Promise.all([
    admin.from("courses").select("title, slug, level").eq("id", enrollment.course_id).single(),
    admin.from("users").select("full_name").eq("id", enrollment.user_id).maybeSingle(),
  ]);

  if (!course) return null;

  return {
    certId:         `RVY-${code.toUpperCase()}`,
    researcherName: (profile?.full_name as string | null) || "Researcher",
    courseTitle:    course.title as string,
    courseSlug:     course.slug as string,
    courseLevel:    course.level as number,
    completedAt:    enrollment.completed_at as string,
  };
}

// ── Shared helpers ────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const number = id.toUpperCase();
  return generatePageMetadata({
    title:       `Verify Certificate ${number}`,
    description: `Verify the authenticity of Researchvy certificate ${number}.`,
  });
}

// ── Academy cert card ─────────────────────────────────────────────────────────

function AcademyCertCard({ cert }: { cert: AcademyCert }) {
  const levelLabel = LEVEL_LABELS[cert.courseLevel] ?? `Level ${cert.courseLevel}`;
  return (
    <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
      <div className="px-8 pt-8 pb-6 text-center border-b" style={{ borderColor: "#1E293B" }}>
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "#1E293B" }}>
            <Award className="h-8 w-8" style={{ color: "#60A5FA" }} />
          </div>
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#4B5563" }}>
          Certificate of Completion
        </p>
        <h1 className="text-2xl font-bold mb-1" style={{ color: "#F9FAFB" }}>{cert.researcherName}</h1>
        <p className="text-sm" style={{ color: "#6B7280" }}>has successfully completed</p>
      </div>

      <div className="px-8 py-6 text-center border-b" style={{ borderColor: "#1E293B" }}>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider"
          style={{ backgroundColor: "#1E293B", color: "#94A3B8" }}>
          {levelLabel}
        </span>
        <h2 className="text-xl font-bold mt-2" style={{ color: "#E2E8F0" }}>{cert.courseTitle}</h2>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>Researchvy Academy</p>
      </div>

      <div className="px-8 py-5 grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "#6B7280" }}>
            <Calendar className="h-3.5 w-3.5" /> Completed
          </div>
          <p className="text-sm font-medium" style={{ color: "#D1D5DB" }}>{formatDate(cert.completedAt)}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "#6B7280" }}>
            <Shield className="h-3.5 w-3.5" /> Certificate ID
          </div>
          <p className="text-sm font-mono font-medium" style={{ color: "#D1D5DB" }}>{cert.certId}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "#6B7280" }}>
            <BookOpen className="h-3.5 w-3.5" /> Issued by
          </div>
          <p className="text-sm font-medium" style={{ color: "#D1D5DB" }}>Researchvy Academy</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "#6B7280" }}>
            <CheckCircle2 className="h-3.5 w-3.5" /> Status
          </div>
          <p className="text-sm font-medium" style={{ color: "#86efac" }}>Valid &amp; Authentic</p>
        </div>
      </div>

      <div className="px-8 py-4 border-t" style={{ borderColor: "#1E293B", backgroundColor: "#070B14" }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs" style={{ color: "#4B5563" }}>researchvy.com/verify/{cert.certId}</p>
          <Link href={`/academy/courses/${cert.courseSlug}`}
            className="text-xs px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: "#1E293B", color: "#94A3B8" }}>
            View course
          </Link>
        </div>
        <CertShareButtons
          certificateNumber={cert.certId}
          recipientName={cert.researcherName}
          programme={`${cert.courseTitle} — Researchvy Academy`}
          issuedAt={cert.completedAt}
        />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function VerifyPage({ params }: Props) {
  const { id } = await params;
  const number = id.toUpperCase().trim();

  // Detect cert type by prefix
  const isAcademy = number.startsWith("RVY-");

  const [clinicCert, academyCert] = await Promise.all([
    isAcademy ? Promise.resolve(null) : getClinicCert(number),
    isAcademy ? getAcademyCert(number) : Promise.resolve(null),
  ]);

  const valid = !!(clinicCert || academyCert);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080E1A" }}>
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">

        <p className="text-xs font-semibold tracking-widest uppercase mb-8" style={{ color: "#4B5563" }}>
          <Link href="/" className="hover:underline" style={{ color: "#4B5563" }}>Researchvy</Link>
          {" › "}Verify Certificate
        </p>

        {/* Status badge */}
        <div className="flex items-center gap-3 rounded-2xl border px-5 py-4 mb-8"
          style={{
            backgroundColor: valid ? "rgba(16,185,129,0.06)" : "rgba(239,68,68,0.05)",
            borderColor:     valid ? "rgba(16,185,129,0.2)"  : "rgba(239,68,68,0.2)",
          }}>
          {valid
            ? <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: "#10B981" }} />
            : <XCircle      className="h-5 w-5 flex-shrink-0" style={{ color: "#F87171" }} />}
          <div>
            <p className="text-sm font-semibold" style={{ color: valid ? "#10B981" : "#F87171" }}>
              {valid ? "Certificate Verified" : "Certificate Not Found"}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
              {valid
                ? `This certificate is authentic and was issued by Researchvy.`
                : `No certificate matching ${number} was found in our records.`}
            </p>
          </div>
        </div>

        {/* Cert display */}
        {clinicCert && (
          <div>
            <CertificateView cert={clinicCert} />
            <div className="mt-4">
              <CertShareButtons
                certificateNumber={clinicCert.certificate_number}
                recipientName={clinicCert.recipient_name}
                programme={clinicCert.programme}
                issuedAt={clinicCert.issued_at}
              />
            </div>
          </div>
        )}
        {academyCert && <AcademyCertCard cert={academyCert} />}

        {/* Not found state */}
        {!valid && (
          <>
            <div className="rounded-2xl border p-10 text-center" style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ backgroundColor: "rgba(37,99,235,0.1)" }}>
                <Shield className="h-8 w-8" style={{ color: "#2563EB" }} />
              </div>
              <h1 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
                Certificate Not Found
              </h1>
              <p className="text-sm max-w-sm mx-auto mb-6 leading-relaxed" style={{ color: "#6B7280" }}>
                The certificate <span className="font-mono font-semibold" style={{ color: "#9CA3AF" }}>{number}</span> does not
                match any record. Please check the number and try again.
              </p>
              <Link href="/" className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
                style={{ backgroundColor: "#2563EB" }}>
                Back to Researchvy
              </Link>
            </div>
            <p className="text-center text-xs mt-6" style={{ color: "#4B5563" }}>
              If you believe this is an error, contact{" "}
              <a href="mailto:info@researchvy.com" className="underline" style={{ color: "#6B7280" }}>
                info@researchvy.com
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
