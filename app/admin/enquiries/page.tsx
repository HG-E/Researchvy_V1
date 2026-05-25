import { generatePageMetadata } from "@/lib/seo/metadata";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { EnquiryStatusSelect } from "@/components/admin/EnquiryStatusSelect";
import { IssueCertificateButton } from "@/components/admin/IssueCertificateButton";
import { format } from "date-fns";
import { GraduationCap, BookOpen, AlertCircle } from "lucide-react";

export const metadata = generatePageMetadata({ title: "Manage Enquiries" });

type EnquiryStatus = "pending" | "contacted" | "enrolled" | "declined";

interface ClinicEnquiry {
  id:              string;
  user_id:         string | null;
  email:           string;
  full_name:       string;
  clinic_slug:     string;
  status:          EnquiryStatus;
  created_at:      string;
  notes:           string | null;
  preferred_track: "wednesday" | "saturday" | null;
}

interface AcademyEnquiry {
  id:             string;
  email:          string;
  full_name:      string;
  programme_slug: string;
  status:         EnquiryStatus;
  created_at:     string;
  notes:          string | null;
}

async function getData(): Promise<{
  clinics:         ClinicEnquiry[];
  academy:         AcademyEnquiry[];
  issuedEnquiryIds: Set<string>;
  error:           boolean;
}> {
  try {
    const admin = createSupabaseAdminClient();

    const [
      { data: clinics,  error: e1 },
      { data: academy,  error: e2 },
      { data: certs,    error: e3 },
    ] = await Promise.all([
      admin
        .from("clinic_enquiries")
        .select("id, user_id, email, full_name, clinic_slug, status, created_at, notes, preferred_track")
        .order("created_at", { ascending: false }),
      admin
        .from("academy_enquiries")
        .select("id, email, full_name, programme_slug, status, created_at, notes")
        .order("created_at", { ascending: false }),
      admin
        .from("certificates")
        .select("enquiry_id")
        .not("enquiry_id", "is", null),
    ]);

    if (e1 || e2) return { clinics: [], academy: [], issuedEnquiryIds: new Set(), error: true };

    const issuedEnquiryIds = new Set<string>(
      (certs ?? []).map((c: { enquiry_id: string }) => c.enquiry_id).filter(Boolean)
    );

    return {
      clinics:  (clinics ?? []) as ClinicEnquiry[],
      academy:  (academy ?? []) as AcademyEnquiry[],
      issuedEnquiryIds,
      error:    false,
    };
  } catch {
    return { clinics: [], academy: [], issuedEnquiryIds: new Set(), error: true };
  }
}

const STATUS_DOT: Record<EnquiryStatus, string> = {
  pending:   "#F59E0B",
  contacted: "#2563EB",
  enrolled:  "#10B981",
  declined:  "#6B7280",
};

export default async function EnquiriesPage() {
  const { clinics, academy, issuedEnquiryIds, error } = await getData();

  const clinicPending  = clinics.filter((c) => c.status === "pending").length;
  const academyPending = academy.filter((a) => a.status === "pending").length;
  const totalPending   = clinicPending + academyPending;

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>
          Admin › Enquiries
        </p>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
            Enquiries
          </h1>
          {totalPending > 0 && (
            <span
              className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold"
              style={{ backgroundColor: "rgba(245,158,11,0.15)", color: "#FCD34D" }}
            >
              {totalPending} pending
            </span>
          )}
        </div>
        <p className="mt-1 text-sm" style={{ color: "#6B7280" }}>
          {clinics.length + academy.length} total registrations. Update status inline · Issue certificates for enrolled participants.
        </p>
      </div>

      {error && (
        <div
          className="flex items-start gap-3 rounded-xl border px-5 py-4 mb-6"
          style={{ backgroundColor: "rgba(239,68,68,0.05)", borderColor: "rgba(239,68,68,0.2)" }}
        >
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#FCA5A5" }} />
          <p className="text-sm" style={{ color: "#9CA3AF" }}>
            Could not load enquiries. Check Supabase configuration and confirm migrations 003 and 004 have been run.
          </p>
        </div>
      )}

      {!error && (
        <div className="space-y-10">

          {/* Clinic enquiries */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-4 w-4" style={{ color: "#2563EB" }} />
              <h2 className="text-sm font-semibold" style={{ color: "#9CA3AF" }}>
                Clinic Interest ({clinics.length})
              </h2>
              {clinicPending > 0 && (
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "rgba(245,158,11,0.12)", color: "#FCD34D" }}
                >
                  {clinicPending} pending
                </span>
              )}
            </div>

            {clinics.length === 0 ? (
              <div
                className="rounded-2xl border p-10 text-center"
                style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
              >
                <p className="text-sm" style={{ color: "#4B5563" }}>No enquiries yet.</p>
              </div>
            ) : (
              <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "#1E293B" }}>
                <div
                  className="grid gap-4 px-6 py-3 text-xs font-semibold tracking-wider uppercase border-b"
                  style={{
                    gridTemplateColumns: "1fr auto auto auto",
                    backgroundColor: "#0F172A",
                    borderColor: "#1E293B",
                    color: "#4B5563",
                  }}
                >
                  <span>Contact</span>
                  <span className="hidden md:block">Clinic</span>
                  <span>Status</span>
                  <span>Date</span>
                </div>
                <div style={{ backgroundColor: "#0F172A" }}>
                  {clinics.map((row, i) => (
                    <div
                      key={row.id}
                      className="grid gap-4 items-start px-6 py-4 border-b last:border-0"
                      style={{
                        gridTemplateColumns: "1fr auto auto auto",
                        borderColor: "#1E293B",
                        backgroundColor: i % 2 === 0 ? "#0F172A" : "#0A1120",
                      }}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: STATUS_DOT[row.status] }}
                          />
                          <p className="text-sm font-medium truncate" style={{ color: "#F9FAFB" }}>
                            {row.email}
                          </p>
                        </div>
                        {row.full_name && (
                          <p className="text-xs mt-0.5 pl-4" style={{ color: "#4B5563" }}>
                            {row.full_name}
                          </p>
                        )}
                        {row.preferred_track && (
                          <span
                            className="inline-flex items-center mt-1 ml-4 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: row.preferred_track === "wednesday" ? "rgba(37,99,235,0.12)" : "rgba(139,92,246,0.12)",
                              color:           row.preferred_track === "wednesday" ? "#60A5FA"               : "#A78BFA",
                            }}
                          >
                            {row.preferred_track === "wednesday" ? "Wed track" : "Sat track"}
                          </span>
                        )}
                        {/* Issue certificate button — only for enrolled */}
                        {row.status === "enrolled" && (
                          <div className="mt-2 pl-4">
                            <IssueCertificateButton
                              enquiryId={row.id}
                              recipientName={row.full_name || row.email}
                              recipientEmail={row.email}
                              userId={row.user_id ?? undefined}
                              clinicSlug={row.clinic_slug}
                              alreadyIssued={issuedEnquiryIds.has(row.id)}
                            />
                          </div>
                        )}
                      </div>
                      <span className="hidden md:block text-xs truncate max-w-[140px]" style={{ color: "#6B7280" }}>
                        {row.clinic_slug}
                      </span>
                      <EnquiryStatusSelect id={row.id} table="clinic_enquiries" current={row.status} />
                      <span className="text-xs whitespace-nowrap" style={{ color: "#6B7280" }}>
                        {format(new Date(row.created_at), "MMM d, yyyy")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Academy enquiries */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-4 w-4" style={{ color: "#8B5CF6" }} />
              <h2 className="text-sm font-semibold" style={{ color: "#9CA3AF" }}>
                Academy Interest ({academy.length})
              </h2>
              {academyPending > 0 && (
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "rgba(245,158,11,0.12)", color: "#FCD34D" }}
                >
                  {academyPending} pending
                </span>
              )}
            </div>

            {academy.length === 0 ? (
              <div
                className="rounded-2xl border p-10 text-center"
                style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
              >
                <p className="text-sm" style={{ color: "#4B5563" }}>No enquiries yet.</p>
              </div>
            ) : (
              <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "#1E293B" }}>
                <div
                  className="grid gap-4 px-6 py-3 text-xs font-semibold tracking-wider uppercase border-b"
                  style={{
                    gridTemplateColumns: "1fr auto auto auto",
                    backgroundColor: "#0F172A",
                    borderColor: "#1E293B",
                    color: "#4B5563",
                  }}
                >
                  <span>Contact</span>
                  <span className="hidden md:block">Programme</span>
                  <span>Status</span>
                  <span>Date</span>
                </div>
                <div style={{ backgroundColor: "#0F172A" }}>
                  {academy.map((row, i) => (
                    <div
                      key={row.id}
                      className="grid gap-4 items-center px-6 py-4 border-b last:border-0"
                      style={{
                        gridTemplateColumns: "1fr auto auto auto",
                        borderColor: "#1E293B",
                        backgroundColor: i % 2 === 0 ? "#0F172A" : "#0A1120",
                      }}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: STATUS_DOT[row.status] }}
                          />
                          <p className="text-sm font-medium truncate" style={{ color: "#F9FAFB" }}>
                            {row.email}
                          </p>
                        </div>
                        {row.full_name && (
                          <p className="text-xs mt-0.5 pl-4" style={{ color: "#4B5563" }}>
                            {row.full_name}
                          </p>
                        )}
                      </div>
                      <span className="hidden md:block text-xs truncate max-w-[140px]" style={{ color: "#6B7280" }}>
                        {row.programme_slug}
                      </span>
                      <EnquiryStatusSelect id={row.id} table="academy_enquiries" current={row.status} />
                      <span className="text-xs whitespace-nowrap" style={{ color: "#6B7280" }}>
                        {format(new Date(row.created_at), "MMM d, yyyy")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
