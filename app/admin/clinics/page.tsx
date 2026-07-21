import Link from "next/link";
import { ExternalLink, Clock, Monitor, Users, CheckCircle, Award, BookOpen } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { digitalVisibilityClinic } from "@/constants/clinics";
import { buildWhatsAppUrl } from "@/config/site";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { UnlockSessionButton } from "@/components/admin/UnlockSessionButton";

export const dynamic  = "force-dynamic";
export const metadata = generatePageMetadata({ title: "Manage Clinics" });

const CLINIC_SLUG = "digital-visibility-clinic";
const COHORT_ID   = "cohort-2026-july";
const CLINICS = [digitalVisibilityClinic];

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

export default async function ManageClinicsPage() {
  const unlockedSessions = await getUnlockedSessions();
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#2563EB" }}>
          Admin › Clinics
        </p>
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
        >
          Clinics
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#6B7280" }}>
          {CLINICS.length} programme{CLINICS.length !== 1 ? "s" : ""}, managed via <code className="text-xs px-1 py-0.5 rounded" style={{ backgroundColor: "#1E293B", color: "#60A5FA" }}>constants/clinics.ts</code>
        </p>
      </div>

      <div className="space-y-6">
        {CLINICS.map((clinic) => (
          <div
            key={clinic.id}
            className="rounded-2xl border overflow-hidden"
            style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
          >
            {/* Clinic header */}
            <div className="px-6 py-5 border-b" style={{ borderColor: "#1E293B" }}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-lg font-bold" style={{ color: "#F9FAFB" }}>{clinic.name}</h2>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                      style={{ backgroundColor: "rgba(16,185,129,0.12)", color: "#10B981" }}
                    >
                      Active
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: "#6B7280" }}>{clinic.tagline}</p>
                </div>
                <Link
                  href={`/clinics/${clinic.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors hover:bg-[#2563EB] border"
                  style={{ color: "#60A5FA", borderColor: "#1D4ED8", backgroundColor: "rgba(37,99,235,0.1)" }}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View Live
                </Link>
              </div>

              {/* Stat pills */}
              <div className="flex flex-wrap gap-3 mt-4">
                {[
                  { Icon: Clock,   text: clinic.duration },
                  { Icon: Monitor, text: clinic.format },
                  { Icon: Users,   text: `Max ${clinic.capacity} participants` },
                  { Icon: Award,   text: "Certificate included" },
                ].map(({ Icon, text }) => (
                  <span
                    key={text}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs"
                    style={{ backgroundColor: "#1E293B", color: "#9CA3AF" }}
                  >
                    <Icon className="h-3 w-3" style={{ color: "#60A5FA" }} />
                    {text}
                  </span>
                ))}
              </div>
            </div>

            {/* Outcomes + sessions summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x" style={{ borderColor: "#1E293B" }}>

              <div className="px-6 py-5">
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#4B5563" }}>
                  Outcomes ({clinic.outcomes.length})
                </p>
                <div className="space-y-1.5">
                  {clinic.outcomes.slice(0, 4).map((o, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs" style={{ color: "#9CA3AF" }}>
                      <CheckCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: "#10B981" }} />
                      <span>{o}</span>
                    </div>
                  ))}
                  {clinic.outcomes.length > 4 && (
                    <p className="text-xs pl-5" style={{ color: "#4B5563" }}>
                      +{clinic.outcomes.length - 4} more
                    </p>
                  )}
                </div>
              </div>

              <div className="px-6 py-5">
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#4B5563" }}>
                  Modules ({clinic.sessions.length})
                </p>
                <div className="space-y-1.5">
                  {clinic.sessions.map((s) => (
                    <div key={s.number} className="flex items-center gap-2 text-xs" style={{ color: "#9CA3AF" }}>
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold"
                        style={{ backgroundColor: "#1E293B", color: "#60A5FA" }}
                      >
                        {s.number}
                      </span>
                      <span className="truncate">{s.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Session unlock controls */}
            <div className="px-6 py-5 border-t" style={{ borderColor: "#1E293B" }}>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-4 w-4" style={{ color: "#8B5CF6" }} />
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#4B5563" }}>
                  Session Unlocks: August 2026 Cohort
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {clinic.sessions.map((s) => (
                    <div
                      key={s.number}
                      className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3"
                      style={{
                        backgroundColor: unlockedSessions.has(s.number) ? "rgba(16,185,129,0.04)" : "#080E1A",
                        borderColor:     unlockedSessions.has(s.number) ? "rgba(16,185,129,0.2)"  : "#1E293B",
                      }}
                    >
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: "#4B5563" }}>
                          {`Module ${s.number}`}
                        </p>
                        <p className="text-xs font-semibold truncate" style={{ color: "#F9FAFB" }}>
                          {s.name}
                        </p>
                      </div>
                      <UnlockSessionButton
                        clinicSlug={CLINIC_SLUG}
                        cohortId={COHORT_ID}
                        sessionNumber={s.number}
                        isUnlocked={unlockedSessions.has(s.number)}
                      />
                    </div>
                ))}
              </div>
            </div>

            {/* Enquiry link */}
            <div
              className="px-6 py-3 border-t flex items-center justify-between"
              style={{ borderColor: "#1E293B", backgroundColor: "#080E1A" }}
            >
              <p className="text-xs" style={{ color: "#4B5563" }}>
                Pricing: enquiry-only via WhatsApp
              </p>
              <a
                href={buildWhatsAppUrl(clinic.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium transition-colors hover:text-[#4ADE80]"
                style={{ color: "#22C55E" }}
              >
                Open WhatsApp →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
