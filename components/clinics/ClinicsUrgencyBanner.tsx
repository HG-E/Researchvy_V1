import Link from "next/link";
import { MessageCircle, Clock, Users, Calendar, AlertTriangle, ArrowRight } from "lucide-react";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { digitalVisibilityClinic } from "@/constants/clinics";
import { buildWhatsAppUrl } from "@/config/site";
import { WaitlistForm } from "@/components/clinics/WaitlistForm";

function formatCohortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

async function getSpotsTaken(): Promise<number> {
  try {
    const admin = createSupabaseAdminClient();
    const { count } = await admin
      .from("clinic_enquiries")
      .select("*", { count: "exact", head: true })
      .eq("clinic_slug", digitalVisibilityClinic.slug)
      .neq("status", "declined");
    return count ?? 0;
  } catch {
    return 0;
  }
}

export async function ClinicsUrgencyBanner({
  isEarlyBird,
  earlyBirdDate,
}: {
  isEarlyBird: boolean;
  earlyBirdDate: string;
}) {
  const cohort      = digitalVisibilityClinic.nextCohort;
  if (cohort.status === "tba") return null;

  const spotsTaken       = await getSpotsTaken();
  const spotsLeft        = Math.max(0, digitalVisibilityClinic.capacity - spotsTaken - cohort.spotsAlreadyFilled);
  const msToDeadline     = new Date(cohort.registrationDeadline + "T23:59:59").getTime() - Date.now();
  const daysToDeadline   = Math.ceil(msToDeadline / (1000 * 60 * 60 * 24));
  const isDeadlineClose  = daysToDeadline > 0 && daysToDeadline <= 5;
  const isClosingSoon    = spotsLeft <= 5 || isDeadlineClose;
  const isFull           = cohort.status === "full" || spotsLeft === 0 || msToDeadline <= 0;

  return (
    <div
      className="rounded-2xl border p-6 sm:p-8 mb-12"
      style={{
        backgroundColor: isFull ? "rgba(239,68,68,0.05)" : isDeadlineClose ? "rgba(245,158,11,0.06)" : "rgba(16,185,129,0.04)",
        borderColor:     isFull ? "rgba(239,68,68,0.2)"  : isDeadlineClose ? "rgba(245,158,11,0.25)"  : "rgba(16,185,129,0.18)",
      }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

        {/* Left — headline + tracks */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <p className="text-base font-bold" style={{ color: "#111827" }}>
              {isFull ? "August 2026 Cohort: Registration Closed" : "August 2026 Cohort: Now Open"}
            </p>
            <span
              className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: isFull ? "rgba(239,68,68,0.15)" : isClosingSoon ? "rgba(245,158,11,0.15)" : "rgba(16,185,129,0.15)",
                color: isFull ? "#EF4444" : isClosingSoon ? "#F59E0B" : "#10B981",
              }}
            >
              {isFull
                ? "Registration Closed"
                : spotsLeft <= 5
                ? `${spotsLeft} spot${spotsLeft === 1 ? "" : "s"} left`
                : isDeadlineClose
                ? `Closes in ${daysToDeadline} day${daysToDeadline === 1 ? "" : "s"}`
                : `${spotsLeft} spots remaining`}
            </span>
            {isDeadlineClose && !isFull && (
              <span
                className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                style={{ backgroundColor: "rgba(239,68,68,0.12)", color: "#EF4444" }}
              >
                <AlertTriangle className="h-2.5 w-2.5" />
                Registration closes {formatCohortDate(cohort.registrationDeadline)}
              </span>
            )}
            {isEarlyBird && (
              <span
                className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                style={{ backgroundColor: "rgba(245,158,11,0.12)", color: "#F59E0B" }}
              >
                Early bird ends {earlyBirdDate}
              </span>
            )}
          </div>

          {/* Two tracks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {(["wednesday", "sunday"] as const).map((key) => {
              const track = cohort.tracks[key];
              return (
                <div
                  key={key}
                  className="rounded-xl border px-4 py-3.5"
                  style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
                >
                  <p className="text-[10px] font-bold tracking-widest uppercase mb-1.5" style={{ color: "#4B5563" }}>
                    {track.label} Track
                  </p>
                  <p className="text-sm font-semibold" style={{ color: "#111827" }}>
                    {track.day}s · {cohort.sessionTime}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#4B5563" }}>
                    Starts {formatCohortDate(track.startDate)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs" style={{ color: "#4B5563" }}>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 flex-shrink-0" />
              2 hrs/session · platform activities between sessions
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 flex-shrink-0" />
              ≤ {digitalVisibilityClinic.capacity} per cohort
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
              Registration closes {formatCohortDate(cohort.registrationDeadline)}
            </span>
          </div>
        </div>

        {/* Right — CTA or Waitlist */}
        {isFull ? (
          <WaitlistForm clinicSlug={digitalVisibilityClinic.slug} />
        ) : isDeadlineClose ? (
          <div className="shrink-0 flex flex-col items-start lg:items-end gap-2">
            <Link
              href="/clinics/checkout?bundle=core"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white whitespace-nowrap transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#DC2626" }}
            >
              Enroll Before Registration Closes
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={buildWhatsAppUrl("Digital Visibility Clinic August 2026 cohort")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-75"
              style={{ color: "#4B5563" }}
            >
              <MessageCircle className="h-3.5 w-3.5" />
              or message us on WhatsApp
            </a>
          </div>
        ) : (
          <div className="shrink-0 flex flex-col items-start lg:items-end gap-2">
            <a
              href={buildWhatsAppUrl("Digital Visibility Clinic August 2026 cohort")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white whitespace-nowrap transition-opacity hover:opacity-90"
              style={{ backgroundColor: isClosingSoon ? "#D97706" : "#2563EB" }}
            >
              <MessageCircle className="h-4 w-4" />
              {isClosingSoon ? "Reserve My Spot Now" : "Join August Cohort"}
            </a>
            <p className="text-xs" style={{ color: "#4B5563" }}>
              Choose your track after sign-up
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
