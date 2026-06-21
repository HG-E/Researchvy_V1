import { notFound } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/config/site";
import { OpportunityCard } from "@/components/opportunities/OpportunityCard";
import { EventCard } from "@/components/events/EventCard";
import { ProfileShareButton } from "@/components/profile/ProfileShareButton";
import { BadgeCheck, ExternalLink, BookOpen, GraduationCap, Calendar } from "lucide-react";
import type { ResearchOpportunity } from "@/types/opportunity";
import type { AcademicEvent } from "@/types/event";
import type { PublicUser } from "@/types/user";

export const revalidate = 60;

// ── Types ─────────────────────────────────────────────────────────────────────

interface Certificate {
  id: string;
  certificate_number: string;
  recipient_name: string;
  programme: string;
  clinic_slug: string;
  issued_at: string;
}

interface ProfileData {
  profile: PublicUser;
  certificates: Certificate[];
  opportunities: ResearchOpportunity[];
  events: AcademicEvent[];
}

// ── Data fetching ─────────────────────────────────────────────────────────────

async function getProfileData(username: string): Promise<ProfileData | null> {
  try {
    const admin = createSupabaseAdminClient();

    const { data: profile } = await admin
      .from("users")
      .select(
        "id, full_name, avatar_url, bio, orcid, google_scholar, institutional_affiliation, role, username, created_at"
      )
      .eq("username", username.toLowerCase())
      .eq("profile_public", true)
      .maybeSingle();

    if (!profile) return null;

    const [{ data: certificates }, { data: opportunities }, { data: events }] = await Promise.all([
      admin
        .from("certificates")
        .select("id, certificate_number, recipient_name, programme, clinic_slug, issued_at")
        .eq("user_id", profile.id)
        .order("issued_at", { ascending: false })
        .limit(20),

      admin
        .from("research_opportunities")
        .select("id, title, body, category, funder, value, deadline, apply_url, target_level, is_featured, linked_event_id")
        .eq("submitted_by", profile.id)
        .eq("is_published", true)
        .eq("submission_status", "published")
        .order("created_at", { ascending: false })
        .limit(12),

      admin
        .from("events")
        .select("id, title, slug, short_description, event_type, format, location, start_date, end_date, registration_deadline, featured_image, is_free, fee_amount, fee_currency, organizer_name, organizer_type, target_audience, disciplines, tags, status, is_featured, views_count, call_for_papers_deadline, capacity, has_travel_funding, is_competitive_admission, registration_type")
        .eq("submitted_by", profile.id)
        .in("status", ["published", "featured"])
        .order("start_date", { ascending: false })
        .limit(12),
    ]);

    return {
      profile: profile as PublicUser,
      certificates: certificates ?? [],
      opportunities: (opportunities ?? []) as ResearchOpportunity[],
      events: (events ?? []) as AcademicEvent[],
    };
  } catch {
    return null;
  }
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const data = await getProfileData(username);
  if (!data) return {};
  const { profile } = data;
  return generatePageMetadata({
    title: profile.full_name || username,
    description: profile.bio
      ? profile.bio.slice(0, 155)
      : `${profile.full_name}'s researcher profile on Researchvy.`,
    path: `/profile/${username}`,
  });
}

// ── Role badge ────────────────────────────────────────────────────────────────

const ROLE_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  researcher: { label: "Researcher", color: "#10B981", bg: "rgba(16,185,129,0.12)" },
  partner:    { label: "Partner",    color: "#8B5CF6", bg: "rgba(139,92,246,0.12)" },
  admin:      { label: "Team",       color: "#2563EB", bg: "rgba(37,99,235,0.12)"  },
  user:       { label: "Community",  color: "#6B7280", bg: "rgba(107,114,128,0.1)" },
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const data = await getProfileData(username);
  if (!data) notFound();

  const { profile, certificates, opportunities, events } = data;
  const profileUrl = `${siteConfig.url}/profile/${username}`;
  const role = ROLE_BADGE[profile.role] ?? ROLE_BADGE.user;

  const initials = profile.full_name
    ? profile.full_name.split(" ").map((n: string) => n[0]).filter(Boolean).slice(0, 2).join("").toUpperCase()
    : "R";

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#080E1A" }}>
      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 space-y-10">

        {/* ── Hero card ──────────────────────────────────────────────── */}
        <div
          className="rounded-2xl border p-8"
          style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
        >
          <div className="flex flex-col sm:flex-row items-start gap-6">

            {/* Avatar */}
            <div className="flex-shrink-0">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  width={96}
                  height={96}
                  className="rounded-full object-cover w-24 h-24"
                />
              ) : (
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold flex-shrink-0"
                  style={{ backgroundColor: "#2563EB", color: "#fff" }}
                >
                  {initials}
                </div>
              )}
            </div>

            {/* Identity */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1
                  className="text-2xl font-bold"
                  style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}
                >
                  {profile.full_name}
                </h1>
                <span
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: role.bg, color: role.color }}
                >
                  {role.label}
                </span>
              </div>

              {profile.institutional_affiliation && (
                <p className="text-sm mb-4" style={{ color: "#6B7280" }}>
                  {profile.institutional_affiliation}
                </p>
              )}

              {/* External links */}
              <div className="flex flex-wrap gap-2">
                {profile.orcid && (
                  <a
                    href={`https://orcid.org/${profile.orcid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-opacity hover:opacity-80"
                    style={{ backgroundColor: "rgba(166,206,57,0.12)", color: "#A6CE39" }}
                  >
                    <BadgeCheck className="h-3.5 w-3.5" />
                    ORCID iD
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}

                {profile.google_scholar && (
                  <a
                    href={profile.google_scholar}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-opacity hover:opacity-80"
                    style={{ backgroundColor: "rgba(37,99,235,0.12)", color: "#60A5FA" }}
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    Google Scholar
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}

                <ProfileShareButton url={profileUrl} name={profile.full_name} />
              </div>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p
              className="mt-6 text-sm leading-relaxed border-t pt-6"
              style={{ color: "#9CA3AF", borderColor: "#1E293B" }}
            >
              {profile.bio}
            </p>
          )}
        </div>

        {/* ── Certificates ───────────────────────────────────────────── */}
        {certificates.length > 0 && (
          <section>
            <h2
              className="text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ color: "#6B7280" }}
            >
              Certificates
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="rounded-xl border p-4 flex items-start gap-3"
                  style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
                >
                  <GraduationCap
                    className="h-5 w-5 flex-shrink-0 mt-0.5"
                    style={{ color: "#10B981" }}
                  />
                  <div className="min-w-0">
                    <p
                      className="text-sm font-semibold leading-snug"
                      style={{ color: "#F9FAFB" }}
                    >
                      {cert.programme}
                    </p>
                    <p
                      className="text-xs mt-0.5 font-mono"
                      style={{ color: "#6B7280" }}
                    >
                      {cert.certificate_number}
                    </p>
                    <p
                      className="text-xs mt-1 flex items-center gap-1"
                      style={{ color: "#4B5563" }}
                    >
                      <Calendar className="h-3 w-3" />
                      {new Date(cert.issued_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Submitted Opportunities ────────────────────────────────── */}
        {opportunities.length > 0 && (
          <section>
            <h2
              className="text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ color: "#6B7280" }}
            >
              Submitted Opportunities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {opportunities.map((opp) => (
                <OpportunityCard key={opp.id} opp={opp} />
              ))}
            </div>
          </section>
        )}

        {/* ── Submitted Events ───────────────────────────────────────── */}
        {events.length > 0 && (
          <section>
            <h2
              className="text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ color: "#6B7280" }}
            >
              Submitted Events
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {events.map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          </section>
        )}

        {/* ── Empty state ────────────────────────────────────────────── */}
        {certificates.length === 0 && opportunities.length === 0 && events.length === 0 && (
          <p className="text-sm text-center py-8" style={{ color: "#4B5563" }}>
            This researcher hasn&apos;t published any contributions yet.
          </p>
        )}

      </div>
    </main>
  );
}
