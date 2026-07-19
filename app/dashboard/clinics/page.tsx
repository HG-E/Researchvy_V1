export const dynamic = "force-dynamic";
import Link from "next/link";
import { GraduationCap, ArrowRight, CheckCircle2, Clock, ListChecks } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { getServerUser } from "@/lib/auth/supabase";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/auth/supabase";
import { ClinicEnrollButton } from "@/components/dashboard/ClinicEnrollButton";
import { digitalVisibilityClinic } from "@/constants/clinics";

export const metadata = generatePageMetadata({ title: "My Clinics", noIndex: true });

const CLINIC = {
  slug:    "digital-visibility-clinic",
  name:    "Digital Visibility Clinic",
  tagline: "5 core sessions. ORCID · LinkedIn · WordPress.",
  href:    "/clinics/digital-visibility-clinic",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

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
  pending:   "Interest Registered, we'll be in touch",
  contacted: "Contacted, check your inbox",
  enrolled:  "Enrolled",
};

async function getSpotsTaken(): Promise<number> {
  try {
    const admin = createSupabaseAdminClient();
    const { count } = await admin
      .from("clinic_enquiries")
      .select("*", { count: "exact", head: true })
      .eq("clinic_slug", CLINIC.slug)
      .neq("status", "declined");
    return count ?? 0;
  } catch {
    return 0;
  }
}

export default async function MyClinicsPage() {
  const user = await getServerUser();
  if (!user) return null;

  const [enquiryStatus, spotsTaken] = await Promise.all([
    getEnquiryStatus(user.id),
    getSpotsTaken(),
  ]);

  const cohort        = digitalVisibilityClinic.nextCohort;
  const spotsLeft     = Math.max(0, digitalVisibilityClinic.capacity - spotsTaken);
  const isClosingSoon = spotsLeft <= 8;
  const isFull        = cohort.status === "full" || spotsLeft === 0;
  const hasRegistered  = enquiryStatus !== null;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>
          Dashboard
        </p>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "#111827" }}>
          My Clinics
        </h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          Your registered clinics and participation history
        </p>
      </div>

      {/* Clinic card */}
      <div
        className="rounded-2xl border p-8"
        style={{ backgroundColor: "#FFFFFF", borderColor: hasRegistered ? "#2563EB" : "#1E293B" }}
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

        <h2 className="text-lg font-bold mb-1" style={{ color: "#111827" }}>{CLINIC.name}</h2>
        <p className="text-sm mb-6 leading-relaxed" style={{ color: "#6B7280" }}>{CLINIC.tagline}</p>

        {enquiryStatus === "enrolled" && (
          <Link
            href="/dashboard/clinics/tasks"
            className="flex items-center justify-between gap-4 rounded-xl border p-4 mb-4 transition-colors hover:border-[#2563EB]"
            style={{ backgroundColor: "rgba(37,99,235,0.05)", borderColor: "rgba(37,99,235,0.2)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(37,99,235,0.12)" }}
              >
                <ListChecks className="h-5 w-5" style={{ color: "#2563EB" }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#111827" }}>My Tasks</p>
                <p className="text-xs" style={{ color: "#6B7280" }}>Weekly clinic tasks &amp; reflections</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 flex-shrink-0" style={{ color: "#6B7280" }} />
          </Link>
        )}

        {hasRegistered && enquiryStatus !== "enrolled" ? (
          <div
            className="rounded-xl border p-5 mb-4"
            style={{ backgroundColor: "rgba(37,99,235,0.05)", borderColor: "rgba(37,99,235,0.2)" }}
          >
            <p className="text-sm leading-relaxed" style={{ color: "#93C5FD" }}>
              Your interest has been registered. Our team will reach out to{" "}
              <strong style={{ color: "#BFDBFE" }}>{user.email}</strong> with cohort details and scheduling.
              Spots are limited, we typically contact registered members within 3–5 business days.
            </p>
          </div>
        ) : !hasRegistered ? (
          <p className="text-sm mb-6 leading-relaxed" style={{ color: "#6B7280" }}>
            Cohorts are forming now. Register your interest below and we&apos;ll reach out to you
            directly when a spot becomes available.
          </p>
        ) : null}

        {/* Next cohort info */}
        {cohort.status !== "tba" && !hasRegistered && (
          <div className="rounded-xl border p-4 mb-5 space-y-3" style={{ backgroundColor: "rgba(16,185,129,0.04)", borderColor: "rgba(16,185,129,0.15)" }}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <p className="text-xs font-bold" style={{ color: "#111827" }}>August 2026 Cohort</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: isFull ? "rgba(239,68,68,0.15)" : isClosingSoon ? "rgba(245,158,11,0.15)" : "rgba(16,185,129,0.12)", color: isFull ? "#F87171" : isClosingSoon ? "#FCD34D" : "#10B981" }}>
                {isFull ? "Full" : `${spotsLeft} spots left`}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(["wednesday", "sunday"] as const).map((key) => {
                const track = cohort.tracks[key];
                return (
                  <div key={key} className="rounded-lg border px-3 py-2" style={{ backgroundColor: "#F8FAFC", borderColor: "#E2E8F0" }}>
                    <p className="text-[9px] font-bold tracking-widest uppercase" style={{ color: "#6B7280" }}>{track.label}</p>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: "#111827" }}>{track.day}s</p>
                    <p className="text-[10px]" style={{ color: "#6B7280" }}>{cohort.sessionTime}</p>
                    <p className="text-[10px]" style={{ color: "#6B7280" }}>Starts {formatDate(track.startDate)}</p>
                  </div>
                );
              })}
            </div>
            <p className="text-[10px]" style={{ color: "#6B7280" }}>
              2 hrs/session · platform activities between sessions · Registration closes {formatDate(cohort.registrationDeadline)}
            </p>
          </div>
        )}

        <div className="flex items-center gap-3 flex-wrap">
          {!hasRegistered && !isFull && <ClinicEnrollButton clinicSlug={CLINIC.slug} />}
          {!hasRegistered && isFull && (
            <span className="text-xs font-semibold px-4 py-2.5 rounded-xl" style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#F87171" }}>
              This cohort is full, check back for the next one
            </span>
          )}
          <Link
            href={CLINIC.href}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200"
            style={{ color: "#2563EB" }}
          >
            View Full Programme <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Private Consulting — available now, no cohort wait */}
      <div
        className="rounded-2xl border p-5"
        style={{ backgroundColor: "rgba(139,92,246,0.04)", borderColor: "rgba(139,92,246,0.2)" }}
      >
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#A78BFA" }}>Available now · No cohort</p>
        <p className="text-sm font-semibold mb-1" style={{ color: "#111827" }}>Private Consulting — 1-on-1, done for you</p>
        <p className="text-xs leading-relaxed mb-3" style={{ color: "#6B7280" }}>
          Rather than waiting for a cohort, Private Consulting delivers a bespoke audit, optimised profiles, and a 12-month strategy built around your specific gaps — from $209.
        </p>
        <Link href="/clinics/private-consulting" className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: "#A78BFA" }}>
          View Private Consulting → <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Coming soon teaser */}
      <div>
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: "#6B7280" }}>
          <Clock className="h-4 w-4" />
          More clinics coming soon
        </h2>
        <div
          className="rounded-2xl border p-5"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
        >
          <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>
            More clinic programmes, intensive workshops, and institution-level cohorts are in development.
            Registered members are notified first.
          </p>
        </div>
      </div>
    </div>
  );
}
