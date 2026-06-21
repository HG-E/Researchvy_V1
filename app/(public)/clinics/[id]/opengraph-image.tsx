import { ImageResponse } from "next/og";
import { digitalVisibilityClinic } from "@/constants/clinics";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CLINICS: Record<string, typeof digitalVisibilityClinic> = {
  [digitalVisibilityClinic.slug]: digitalVisibilityClinic,
};

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const clinic = CLINICS[id];

  const name     = clinic?.name     ?? "Digital Visibility Clinic";
  const tagline  = clinic?.tagline  ?? "Scholarly visibility transformation";
  const duration = clinic?.duration ?? "5 core sessions";
  const format   = clinic?.format   ?? "Live online";
  const capacity = clinic?.capacity ?? 30;

  const accentColor = "#10B981";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#080E1A",
        padding: "60px 64px",
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "48px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "40px", height: "40px",
            backgroundColor: "#0F172A",
            border: "1px solid #334155",
            borderRadius: "9px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <span style={{ color: "#F9FAFB", fontSize: "18px", fontWeight: "700", fontFamily: "Georgia, serif" }}>R</span>
          </div>
          <span style={{ color: "#F9FAFB", fontSize: "20px", fontWeight: "700", fontFamily: "Georgia, serif", letterSpacing: "-0.02em" }}>
            Researchvy
          </span>
        </div>
        <div style={{
          backgroundColor: `${accentColor}18`,
          border: `1px solid ${accentColor}35`,
          borderRadius: "24px",
          padding: "7px 18px",
          color: accentColor,
          fontSize: "11px",
          fontWeight: "700",
          fontFamily: "Arial, sans-serif",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}>
          Live Clinic
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{
          width: "56px", height: "5px",
          backgroundColor: accentColor,
          borderRadius: "3px",
          marginBottom: "28px",
        }} />
        <h1 style={{
          margin: "0 0 16px 0",
          fontSize: "56px",
          fontWeight: "700",
          color: "#F9FAFB",
          lineHeight: "1.15",
          letterSpacing: "-0.025em",
          fontFamily: "Georgia, 'Times New Roman', serif",
          maxWidth: "900px",
        }}>
          {name}
        </h1>
        <p style={{
          margin: "0",
          fontSize: "22px",
          color: "#9CA3AF",
          lineHeight: "1.4",
          fontFamily: "Arial, sans-serif",
          maxWidth: "820px",
        }}>
          {tagline}
        </p>
      </div>

      {/* Footer stats */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: "32px",
        borderTop: "1px solid #1E293B",
        marginTop: "40px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
          {[
            { label: "Sessions",   value: duration },
            { label: "Format",     value: format.split("+")[0].trim() },
            { label: "Cohort",     value: `≤${capacity} researchers` },
            { label: "Certificate", value: "Included" },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ color: "#4B5563", fontSize: "11px", fontWeight: "600", fontFamily: "Arial, sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {label}
              </span>
              <span style={{ color: "#F9FAFB", fontSize: "15px", fontWeight: "600", fontFamily: "Arial, sans-serif" }}>
                {value}
              </span>
            </div>
          ))}
        </div>
        <span style={{ color: "#1E293B", fontSize: "13px", fontFamily: "Arial, sans-serif" }}>
          researchvy.com
        </span>
      </div>
    </div>,
    { ...size },
  );
}
