import { ImageResponse } from "next/og";

export const size        = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENT = "#2563EB";

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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "52px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "40px", height: "40px",
            backgroundColor: "#0F172A", border: "1px solid #334155", borderRadius: "9px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#F9FAFB", fontSize: "18px", fontWeight: "700" }}>R</span>
          </div>
          <span style={{ color: "#F9FAFB", fontSize: "20px", fontWeight: "700", letterSpacing: "-0.02em" }}>Researchvy</span>
        </div>
        <div style={{
          backgroundColor: `${ACCENT}18`, border: `1px solid ${ACCENT}40`,
          borderRadius: "24px", padding: "7px 18px",
          color: ACCENT, fontSize: "11px", fontWeight: "700",
          fontFamily: "Arial, sans-serif", textTransform: "uppercase", letterSpacing: "0.1em",
        }}>
          Events Board
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ width: "56px", height: "4px", backgroundColor: ACCENT, borderRadius: "3px", marginBottom: "28px" }} />
        <h1 style={{
          margin: "0 0 16px 0", fontSize: "54px", fontWeight: "700",
          color: "#F9FAFB", lineHeight: "1.15", letterSpacing: "-0.025em", maxWidth: "860px",
        }}>
          Research Events & Conferences
        </h1>
        <p style={{
          margin: 0, fontSize: "22px", color: "#9CA3AF",
          lineHeight: "1.5", fontFamily: "Arial, sans-serif", maxWidth: "760px",
        }}>
          Discover conferences, workshops, seminars, and webinars curated for researchers worldwide.
        </p>
      </div>

      {/* Footer */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        paddingTop: "32px", borderTop: "1px solid #1E293B",
      }}>
        <div style={{ display: "flex", gap: "36px" }}>
          {["Conferences", "Workshops", "Webinars", "Seminars"].map((t) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: ACCENT }} />
              <span style={{ color: "#6B7280", fontSize: "13px", fontFamily: "Arial, sans-serif" }}>{t}</span>
            </div>
          ))}
        </div>
        <span style={{ color: "#1E293B", fontSize: "13px", fontFamily: "Arial, sans-serif" }}>researchvy.com/events</span>
      </div>
    </div>,
    { ...size },
  );
}
