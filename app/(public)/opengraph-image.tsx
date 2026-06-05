import { ImageResponse } from "next/og";

export const size        = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%", height: "100%",
        display: "flex", flexDirection: "column",
        backgroundColor: "#080E1A",
        padding: "60px 64px",
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "56px" }}>
        <div style={{
          width: "44px", height: "44px",
          backgroundColor: "#0F172A",
          border: "1px solid #334155",
          borderRadius: "10px",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ color: "#F9FAFB", fontSize: "20px", fontWeight: "700" }}>R</span>
        </div>
        <span style={{ color: "#F9FAFB", fontSize: "22px", fontWeight: "700", letterSpacing: "-0.02em" }}>
          Researchvy
        </span>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ width: "56px", height: "4px", backgroundColor: "#2563EB", borderRadius: "3px", marginBottom: "32px" }} />
        <h1 style={{
          margin: "0 0 20px 0",
          fontSize: "58px", fontWeight: "700",
          color: "#F9FAFB",
          lineHeight: "1.1",
          letterSpacing: "-0.03em",
          maxWidth: "900px",
        }}>
          Scholarly Visibility,{"\n"}Amplified.
        </h1>
        <p style={{
          margin: 0,
          fontSize: "22px",
          color: "#9CA3AF",
          lineHeight: "1.5",
          fontFamily: "Arial, sans-serif",
          maxWidth: "780px",
        }}>
          Grants, fellowships, events, and learning — all in one platform built for researchers.
        </p>
      </div>

      {/* Footer */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        paddingTop: "32px", borderTop: "1px solid #1E293B",
      }}>
        <div style={{ display: "flex", gap: "40px" }}>
          {["Events Board", "Opportunities", "Academy", "Clinics"].map((label) => (
            <span key={label} style={{ color: "#4B5563", fontSize: "13px", fontFamily: "Arial, sans-serif", fontWeight: 600 }}>
              {label}
            </span>
          ))}
        </div>
        <span style={{ color: "#1E293B", fontSize: "13px", fontFamily: "Arial, sans-serif" }}>researchvy.com</span>
      </div>
    </div>,
    { ...size },
  );
}
