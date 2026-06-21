import { ImageResponse } from "next/og";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";

export const size        = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate  = 60;

const ROLE_COLOR: Record<string, string> = {
  researcher: "#10B981",
  partner:    "#8B5CF6",
  admin:      "#2563EB",
  user:       "#6B7280",
};

export default async function Image({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  const admin = createSupabaseAdminClient();
  const { data: profile } = await admin
    .from("users")
    .select("full_name, avatar_url, bio, institutional_affiliation, role, orcid")
    .eq("username", username.toLowerCase())
    .eq("profile_public", true)
    .maybeSingle();

  const name        = profile?.full_name ?? username;
  const institution = profile?.institutional_affiliation ?? null;
  const bio         = profile?.bio ?? null;
  const role        = (profile?.role ?? "user") as string;
  const hasOrcid    = !!profile?.orcid;
  const accent      = ROLE_COLOR[role] ?? "#6B7280";
  const roleLabel   = role.charAt(0).toUpperCase() + role.slice(1);

  return new ImageResponse(
    <div
      style={{
        width: "100%", height: "100%",
        display: "flex", flexDirection: "column",
        backgroundColor: "#080E1A",
        padding: "52px 60px",
        fontFamily: "Arial, sans-serif",
        position: "relative",
      }}
    >
      {/* Left accent bar */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0,
        width: "6px", backgroundColor: accent,
      }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "48px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px", height: "36px",
            backgroundColor: "#0F172A", border: "1px solid #334155", borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#F9FAFB", fontSize: "16px", fontWeight: "700" }}>R</span>
          </div>
          <span style={{ color: "#9CA3AF", fontSize: "16px" }}>Researchvy</span>
        </div>
        <div style={{
          backgroundColor: `${accent}20`, border: `1px solid ${accent}50`,
          borderRadius: "20px", padding: "5px 14px",
          color: accent, fontSize: "11px", fontWeight: "700",
          textTransform: "uppercase", letterSpacing: "0.1em",
        }}>
          {roleLabel}
        </div>
      </div>

      {/* Avatar + name */}
      <div style={{ display: "flex", alignItems: "center", gap: "28px", flex: 1 }}>
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            width={120}
            height={120}
            style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
          />
        ) : (
          <div style={{
            width: "120px", height: "120px", borderRadius: "50%",
            backgroundColor: "#2563EB",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <span style={{ color: "#fff", fontSize: "48px", fontWeight: "700" }}>
              {name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()}
            </span>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: 0, flex: 1 }}>
          <h1 style={{
            margin: 0,
            fontSize: name.length > 30 ? "44px" : "56px",
            fontWeight: "700",
            color: "#F9FAFB",
            lineHeight: "1.1",
            letterSpacing: "-0.02em",
          }}>
            {name}
          </h1>
          {institution && (
            <p style={{ margin: 0, fontSize: "18px", color: "#6B7280", lineHeight: "1.4" }}>
              {institution}
            </p>
          )}
          {hasOrcid && (
            <div style={{
              display: "flex", alignItems: "center", gap: "6px", marginTop: "4px",
            }}>
              <div style={{
                width: "14px", height: "14px", borderRadius: "50%",
                backgroundColor: "#A6CE39",
              }} />
              <span style={{ color: "#A6CE39", fontSize: "13px", fontWeight: "600" }}>
                ORCID Verified
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        paddingTop: "24px", borderTop: "1px solid #1E293B", marginTop: "32px",
      }}>
        {bio ? (
          <p style={{
            margin: 0, fontSize: "15px", color: "#6B7280", lineHeight: "1.5",
            maxWidth: "900px",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
          }}>
            {bio}
          </p>
        ) : (
          <span style={{ color: "#374151", fontSize: "14px" }}>
            researchvy.com/profile/{username}
          </span>
        )}
        <span style={{ color: "#374151", fontSize: "12px", flexShrink: 0, marginLeft: "16px" }}>
          researchvy.com
        </span>
      </div>
    </div>,
    { ...size },
  );
}
