export const dynamic = "force-dynamic";
import Link from "next/link";
import {
  GraduationCap, ArrowRight, CheckCircle2, Clock, ListChecks,
  MessageCircle, ClipboardList, BookOpen, Lock, Unlock,
} from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { getServerUser } from "@/lib/auth/supabase";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/auth/supabase";
import { ClinicEnrollButton } from "@/components/dashboard/ClinicEnrollButton";
import { digitalVisibilityClinic } from "@/constants/clinics";

export const metadata = generatePageMetadata({ title: "My Clinics", noIndex: true });

const CLINIC_SLUG = "digital-visibility-clinic";
const COHORT_ID   = "cohort-2026-august";

const CLINIC = {
  slug:    CLINIC_SLUG,
  name:    "Digital Visibility Clinic",
  tagline: "5 core sessions. ORCID · LinkedIn · WordPress.",
  href:    "/clinics/digital-visibility-clinic",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

type ParticipantStatus = "pending" | "active" | "revoked";

interface ClinicParticipant {
  id:                 string;
  full_name:          string;
  bundle:             string;
  track:              string | null;
  mode:               string;
  status:             ParticipantStatus;
  whatsapp_group_url: string | null;
  approved_at:        string | null;
}

async function getParticipant(email: string): Promise<ClinicParticipant | null> {
  try {
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("clinic_participants")
      .select("id, full_name, bundle, track, mode, status, whatsapp_group_url, approved_at")
      .eq("email", email.toLowerCase())
      .eq("clinic_id", CLINIC_SLUG)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return (data as ClinicParticipant) ?? null;
  } catch {
    return null;
  }
}

async function getUnlockedSessions(): Promise<Set<number>> {
  try {
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("clinic_session_unlocks")
      .select("session_number")
      .eq("clinic_slug", CLINIC_SLUG)
      .eq("cohort_id", COHORT_ID);
    return new Set((data ?? []).map((r: { session_number: number }) => r.session_number));
  } catch {
    return new Set();
  }
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

const BUNDLE_COLORS: Record<string, string> = { solo: "#10B981", core: "#2563EB", pro: "#8B5CF6" };

const STATUS_LABELS: Record<string, string> = {
  pending:   "Interest Registered, we'll be in touch",
  contacted: "Contacted, check your inbox",
  enrolled:  "Enrolled",
};

// ── Enrolled portal view ─────────────────────────────────────────────────────

function EnrolledPortal({
  participant,
  unlockedSessions,
  sessions,
  cohort,
}: {
  participant:      ClinicParticipant;
  unlockedSessions: Set<number>;
  sessions:         typeof digitalVisibilityClinic.sessions;
  cohort:           typeof digitalVisibilityClinic.nextCohort;
}) {
  const bundleColor = BUNDLE_COLORS[participant.bundle] ?? "#2563EB";
  const track       = participant.track ? cohort.tracks[participant.track as "wednesday" | "sunday"] : null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#10B981" }}>
          Clinic Dashboard
        </p>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "#111827" }}>
          {participant.full_name
            ? `Welcome, ${participant.full_name.split(" ")[0]}.`
            : "Welcome."}
        </h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          August 2026 Cohort · {participant.mode === "offline" ? "In-person" : "Online Live"}
        </p>
      </div>

      {/* Enrollment card */}
      <div
        className="rounded-2xl border p-6"
        style={{ backgroundColor: "#FFFFFF", borderColor: bundleColor + "40" }}
      >
        <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: bundleColor + "12" }}
            >
              <GraduationCap className="h-6 w-6" style={{ color: bundleColor }} />
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: "#111827" }}>{CLINIC.name}</p>
              <p className="text-xs" style={{ color: "#6B7280" }}>August 2026 Cohort</p>
            </div>
          </div>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold"
            style={{ backgroundColor: bundleColor + "14", color: bundleColor }}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {participant.bundle.charAt(0).toUpperCase() + participant.bundle.slice(1)} Bundle · Access Granted
          </span>
        </div>

        {/* Track schedule */}
        {track && (
          <div
            className="rounded-xl border p-4 mb-4 flex flex-col sm:flex-row sm:items-center gap-3"
            style={{ backgroundColor: "#F8FAFC", borderColor: "#E2E8F0" }}
          >
            <Clock className="h-4 w-4 flex-shrink-0" style={{ color: "#2563EB" }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: "#111827" }}>
                {track.label} — {track.day}s at {cohort.sessionTime}
              </p>
              <p className="text-xs" style={{ color: "#6B7280" }}>
                Starts {formatDate(track.startDate)} · 5 sessions · 2 hrs each
              </p>
            </div>
          </div>
        )}

        {!track && (
          <div
            className="rounded-xl border p-4 mb-4"
            style={{ backgroundColor: "#F8FAFC", borderColor: "#E2E8F0" }}
          >
            <p className="text-xs" style={{ color: "#6B7280" }}>
              Your track (Wednesday or Sunday) will be confirmed by the admin shortly.
            </p>
          </div>
        )}

        {/* WhatsApp group */}
        <div
          className="rounded-xl border p-4 flex items-center justify-between gap-4"
          style={{
            backgroundColor: participant.whatsapp_group_url ? "rgba(16,185,129,0.04)" : "#F8FAFC",
            borderColor:     participant.whatsapp_group_url ? "rgba(16,185,129,0.2)"   : "#E2E8F0",
          }}
        >
          <div className="flex items-center gap-3">
            <MessageCircle className="h-4 w-4 flex-shrink-0" style={{ color: participant.whatsapp_group_url ? "#10B981" : "#9CA3AF" }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: "#111827" }}>Cohort WhatsApp Group</p>
              <p className="text-xs" style={{ color: "#6B7280" }}>
                {participant.whatsapp_group_url
                  ? "Your cohort group is ready — join now"
                  : "Link will be shared here before the first session"}
              </p>
            </div>
          </div>
          {participant.whatsapp_group_url ? (
            <a
              href={participant.whatsapp_group_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white flex-shrink-0"
              style={{ backgroundColor: "#10B981" }}
            >
              Join Group
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          ) : (
            <span className="text-xs font-semibold flex-shrink-0" style={{ color: "#9CA3AF" }}>Coming soon</span>
          )}
        </div>
      </div>

      {/* Baseline scorecard */}
      <div
        className="rounded-2xl border p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        style={{ backgroundColor: "rgba(37,99,235,0.03)", borderColor: "rgba(37,99,235,0.18)" }}
      >
        <ClipboardList className="h-6 w-6 flex-shrink-0" style={{ color: "#2563EB" }} />
        <div className="flex-1">
          <p className="text-sm font-bold mb-0.5" style={{ color: "#111827" }}>Take Your Baseline Scorecard</p>
          <p className="text-xs leading-relaxed" style={{ color: "#6B7280" }}>
            Before Session 1 begins, complete the free 12-point Researcher Visibility Scorecard.
            This is your &quot;before&quot; score — you&apos;ll take it again after the clinic to see exactly what improved.
          </p>
        </div>
        <Link
          href="/resources/visibility-scorecard"
          className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white whitespace-nowrap flex-shrink-0"
          style={{ backgroundColor: "#2563EB" }}
        >
          Start Scorecard
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Sessions */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-4 w-4" style={{ color: "#2563EB" }} />
          <p className="text-sm font-semibold" style={{ color: "#111827" }}>Your 5 Sessions</p>
        </div>
        <div className="space-y-2">
          {sessions.map((s) => {
            const isUnlocked = unlockedSessions.has(s.number);
            return (
              <div
                key={s.number}
                className="flex items-center gap-4 rounded-2xl border px-5 py-4"
                style={{
                  backgroundColor: isUnlocked ? "#FFFFFF" : "#F8FAFC",
                  borderColor:     isUnlocked ? "#E2E8F0" : "#F1F5F9",
                }}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold"
                  style={{
                    backgroundColor: isUnlocked ? "rgba(37,99,235,0.1)" : "#E2E8F0",
                    color:           isUnlocked ? "#2563EB"              : "#9CA3AF",
                  }}
                >
                  {s.number}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold truncate"
                    style={{ color: isUnlocked ? "#111827" : "#9CA3AF" }}
                  >
                    {s.name}
                  </p>
                  {s.description && (
                    <p className="text-xs truncate" style={{ color: "#9CA3AF" }}>{s.description}</p>
                  )}
                </div>
                {isUnlocked ? (
                  <Link
                    href="/dashboard/clinics/tasks"
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold"
                    style={{ backgroundColor: "rgba(37,99,235,0.08)", color: "#2563EB" }}
                  >
                    <Unlock className="h-3 w-3" />
                    Open
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs" style={{ color: "#9CA3AF" }}>
                    <Lock className="h-3 w-3" />
                    Locked
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Pending access view ───────────────────────────────────────────────────────

function PendingAccessView({ participant }: { participant: ClinicParticipant }) {
  const bundleColor = BUNDLE_COLORS[participant.bundle] ?? "#2563EB";
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#F59E0B" }}>
          Access Pending
        </p>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "#111827" }}>
          You&apos;re on the list.
        </h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          Your enrollment has been received. The admin will grant your dashboard access shortly.
        </p>
      </div>
      <div
        className="rounded-2xl border p-6"
        style={{ backgroundColor: "#FFFFFF", borderColor: "rgba(245,158,11,0.3)" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(245,158,11,0.1)" }}>
            <Clock className="h-5 w-5" style={{ color: "#F59E0B" }} />
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: "#111827" }}>Awaiting admin approval</p>
            <p className="text-xs" style={{ color: "#6B7280" }}>
              {participant.bundle.charAt(0).toUpperCase() + participant.bundle.slice(1)} Bundle · August 2026 Cohort
            </p>
          </div>
          <span
            className="ml-auto inline-block px-2.5 py-1 rounded-full text-[10px] font-bold"
            style={{ backgroundColor: bundleColor + "14", color: bundleColor }}
          >
            {participant.bundle.toUpperCase()}
          </span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "#4B5563" }}>
          While you wait, take the free Researcher Visibility Scorecard — your result will become your
          pre-clinic baseline once your access is granted.
        </p>
        <Link
          href="/resources/visibility-scorecard"
          className="inline-flex items-center gap-1.5 mt-4 rounded-xl px-4 py-2.5 text-sm font-bold text-white"
          style={{ backgroundColor: "#2563EB" }}
        >
          Take Free Scorecard Now
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default async function MyClinicsPage() {
  const user = await getServerUser();
  if (!user) return null;

  const [participant, unlockedSessions, enquiryStatus, spotsTaken] = await Promise.all([
    getParticipant(user.email ?? ""),
    getUnlockedSessions(),
    getEnquiryStatus(user.id),
    getSpotsTaken(),
  ]);

  // Active participant → full portal
  if (participant?.status === "active") {
    return (
      <EnrolledPortal
        participant={participant}
        unlockedSessions={unlockedSessions}
        sessions={digitalVisibilityClinic.sessions}
        cohort={digitalVisibilityClinic.nextCohort}
      />
    );
  }

  // Pending participant → access waiting view
  if (participant?.status === "pending") {
    return <PendingAccessView participant={participant} />;
  }

  // No participant record → existing interest / checkout flow
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

      {/* Private Consulting */}
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

      {/* Coming soon */}
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
