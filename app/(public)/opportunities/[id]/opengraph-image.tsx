import { ImageResponse } from "next/og";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";

export const size        = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate  = 120;

const CAT_META: Record<string, { label: string; color: string }> = {
  grant:          { label: "Grant",                   color: "#10B981" },
  fellowship:     { label: "Fellowship",              color: "#8B5CF6" },
  conference:     { label: "Call for Papers",         color: "#F59E0B" },
  speaking:       { label: "Call for Speakers",       color: "#06B6D4" },
  collaboration:  { label: "Collaboration",           color: "#EC4899" },
  job:            { label: "Job / Position",          color: "#6366F1" },
  award:          { label: "Award / Prize",           color: "#F97316" },
  "travel-grant": { label: "Travel Grant / Bursary", color: "#22D3EE" },
  other:          { label: "Other",                   color: "#6B7280" },
};

const LEVEL_LABEL: Record<string, string> = {
  early_career: "Early-Career",
  mid:          "Mid-Career",
  senior:       "Senior Researchers",
  all:          "All Levels",
};

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const admin = createSupabaseAdminClient();
  const { data: opp } = await admin
    .from("research_opportunities")
    .select("title,category,funder,value,deadline,target_level")
    .eq("id", id)
    .eq("is_published", true)
    .single();

  const title     = opp?.title        ?? "Research Opportunity";
  const category  = (opp?.category    ?? "other") as string;
  const funder    = opp?.funder        ?? null;
  const value     = opp?.value         ?? null;
  const level     = opp?.target_level  ?? "all";
  const deadline  = opp?.deadline
    ? new Date(opp.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : null;

  const daysLeft  = opp?.deadline
    ? Math.ceil((new Date(opp.deadline).getTime() - Date.now()) / 86_400_000)
    : null;

  const meta   = CAT_META[category] ?? CAT_META.other;
  const accent = meta.color;
  const urgent = daysLeft !== null && daysLeft <= 14 && daysLeft > 0;

  return new ImageResponse(
    <div
      style={{
        width: "100%", height: "100%",
        display: "flex", flexDirection: "column",
        backgroundColor: "#080E1A",
        padding: "52px 60px",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        position: "relative",
      }}
    >
      {/* Top gradient bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: "4px",
        background: `linear-gradient(90deg, ${accent}, ${accent}60)`,
      }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "44px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px", height: "36px",
            backgroundColor: "#0F172A", border: "1px solid #334155", borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#F9FAFB", fontSize: "16px", fontWeight: "700" }}>R</span>
          </div>
          <span style={{ color: "#9CA3AF", fontSize: "16px", fontFamily: "Arial, sans-serif" }}>Researchvy Opportunities</span>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{
            backgroundColor: `${accent}20`, border: `1px solid ${accent}50`,
            borderRadius: "20px", padding: "5px 14px",
            color: accent, fontSize: "11px", fontWeight: "700",
            fontFamily: "Arial, sans-serif", textTransform: "uppercase", letterSpacing: "0.1em",
          }}>
            {meta.label}
          </div>
          <div style={{
            backgroundColor: "#1E293B",
            borderRadius: "20px", padding: "5px 14px",
            color: "#9CA3AF", fontSize: "11px", fontFamily: "Arial, sans-serif",
          }}>
            {LEVEL_LABEL[level] ?? "All Levels"}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <h1 style={{
          margin: "0 0 20px 0",
          fontSize: title.length > 70 ? "36px" : title.length > 50 ? "42px" : "50px",
          fontWeight: "700",
          color: "#F9FAFB",
          lineHeight: "1.2",
          letterSpacing: "-0.02em",
          maxWidth: "980px",
        }}>
          {title}
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          {funder && (
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              backgroundColor: "#0F172A",
              border: "1px solid #1E293B",
              borderRadius: "12px", padding: "10px 18px",
            }}>
              <span style={{ color: "#6B7280", fontSize: "12px", fontFamily: "Arial, sans-serif" }}>Funder</span>
              <span style={{ color: "#F9FAFB", fontSize: "15px", fontWeight: "600", fontFamily: "Arial, sans-serif" }}>{funder.slice(0, 40)}</span>
            </div>
          )}
          {value && (
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              backgroundColor: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.25)",
              borderRadius: "12px", padding: "10px 18px",
            }}>
              <span style={{ color: "#10B981", fontSize: "15px", fontWeight: "700", fontFamily: "Arial, sans-serif" }}>{value.slice(0, 30)}</span>
            </div>
          )}
          {deadline && (
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              backgroundColor: urgent ? "rgba(239,68,68,0.08)" : "#0F172A",
              border: `1px solid ${urgent ? "rgba(239,68,68,0.3)" : "#1E293B"}`,
              borderRadius: "12px", padding: "10px 18px",
            }}>
              <span style={{ color: "#6B7280", fontSize: "12px", fontFamily: "Arial, sans-serif" }}>Deadline</span>
              <span style={{ color: urgent ? "#F87171" : "#F9FAFB", fontSize: "14px", fontWeight: "600", fontFamily: "Arial, sans-serif" }}>
                {urgent ? `${daysLeft}d left` : deadline}
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
        <span style={{ color: "#4B5563", fontSize: "13px", fontFamily: "Arial, sans-serif" }}>
          Apply via Researchvy — curated for global researchers
        </span>
        <span style={{ color: "#374151", fontSize: "12px", fontFamily: "Arial, sans-serif" }}>researchvy.com/opportunities</span>
      </div>
    </div>,
    { ...size },
  );
}
