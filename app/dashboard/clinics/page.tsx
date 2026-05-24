import Link from "next/link";
import { GraduationCap, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { getServerUser } from "@/lib/auth/supabase";
import { createSupabaseServerClient } from "@/lib/auth/supabase";
import { ClinicEnrollButton } from "@/components/dashboard/ClinicEnrollButton";

export const metadata = generatePageMetadata({ title: "My Clinics", noIndex: true });

const CLINIC = {
  slug:    "digital-visibility-clinic",
  name:    "Digital Visibility Clinic",
  tagline: "6 sessions. One complete scholarly visibility transformation.",
  href:    "/clinics/digital-visibility-clinic",
};

async function getEnquiryStatus(userId: string): Promise<"pending" | "contacted" | "enrolled" | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("clinic_enquiries")
    .select("status")
    .eq("user_id", userId)
    .eq("clinic_slug", CLINIC.slug)
    .maybeSingle();
  return (data?.status as "pending" | "contacted" | "enrolled") ?? null;
}

const STATUS_LABELS: Record<string, string> = {
  pending:   "Interest Registered — we'll be in touch",
  contacted: "Contacted — check your inbox",
  enrolled:  "Enrolled",
};

export default async function MyClinicsPage() {
  const user = await getServerUser();
  if (!user) return null;

  const enquiryStatus = await getEnquiryStatus(user.id);
  const hasRegistered  = enquiryStatus !== null;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>
          Dashboard
        </p>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
          My Clinics
        </h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          Your registered clinics and participation history
        </p>
      </div>

      {/* Clinic card */}
      <div
        className="rounded-2xl border p-8"
        style={{ backgroundColor: "#0F172A", borderColor: hasRegistered ? "#2563EB" : "#1E293B" }}
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "rgba(37,99,235,0.1)" }}
          >
            <GraduationCap className="h-7 w-7" style={{ color: "#2563EB" }} />
          </div>
          {hasRegistered && (
            <span
              className="text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5"
              style={{ backgroundColor: "rgba(34,197,94,0.1)", color: "#22C55E" }}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {STATUS_LABELS[enquiryStatus!] ?? "Registered"}
            </span>
          )}
        </div>

        <h2 className="text-lg font-bold mb-1" style={{ color: "#F9FAFB" }}>{CLINIC.name}</h2>
        <p className="text-sm mb-6 leading-relaxed" style={{ color: "#6B7280" }}>{CLINIC.tagline}</p>

        {hasRegistered ? (
          <div
            className="rounded-xl border p-5 mb-4"
            style={{ backgroundColor: "rgba(37,99,235,0.05)", borderColor: "rgba(37,99,235,0.2)" }}
          >
            <p className="text-sm leading-relaxed" style={{ color: "#93C5FD" }}>
              Your interest has been registered. Our team will reach out to{" "}
              <strong style={{ color: "#BFDBFE" }}>{user.email}</strong> with cohort details and scheduling.
              Spots are limited — we typically contact registered members within 3–5 business days.
            </p>
          </div>
        ) : (
          <p className="text-sm mb-6 leading-relaxed" style={{ color: "#4B5563" }}>
            Cohorts are forming now. Register your interest below and we&apos;ll reach out to you
            directly when a spot becomes available.
          </p>
        )}

        <div className="flex items-center gap-3 flex-wrap">
          {!hasRegistered && <ClinicEnrollButton clinicSlug={CLINIC.slug} />}
          <Link
            href={CLINIC.href}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200"
            style={{ color: "#60A5FA" }}
          >
            View Full Programme <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Coming soon teaser */}
      <div>
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: "#9CA3AF" }}>
          <Clock className="h-4 w-4" />
          More clinics coming soon
        </h2>
        <div
          className="rounded-2xl border p-5"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <p className="text-xs leading-relaxed" style={{ color: "#4B5563" }}>
            Academy cohorts, Intelligence workshops, and specialised institution-level programmes are in development.
            Registered members will be notified first.
          </p>
        </div>
      </div>
    </div>
  );
}
