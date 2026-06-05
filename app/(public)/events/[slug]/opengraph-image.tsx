import { ImageResponse } from "next/og";
import { createSupabaseAdminClient } from "@/lib/auth/supabase";

export const size        = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate  = 60;

const FORMAT_LABEL: Record<string, string> = {
  "in-person": "In-Person",
  virtual:     "Virtual",
  hybrid:      "Hybrid",
};

const TYPE_COLOR: Record<string, string> = {
  conference:  "#2563EB",
  seminar:     "#8B5CF6",
  workshop:    "#10B981",
  symposium:   "#F59E0B",
  webinar:     "#06B6D4",
  lecture:     "#EC4899",
  panel:       "#F97316",
  hackathon:   "#6366F1",
  other:       "#6B7280",
};

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const admin = createSupabaseAdminClient();
  const { data: event } = await admin
    .from("events")
    .select("title,short_description,event_type,format,start_date,end_date,location,organizer_name,is_competitive_admission")
    .eq("slug", slug)
    .in("status", ["published", "featured"])
    .single();

  const title       = event?.title        ?? "Research Event";
  const description = event?.short_description ?? "A research event on Researchvy";
  const eventType   = (event?.event_type  ?? "other") as string;
  const format      = (event?.format      ?? "virtual") as string;
  const startDate   = event?.start_date
    ? new Date(event.start_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : null;
  const location    = event?.location ?? null;
  const organizer   = event?.organizer_name ?? null;
  const accent      = TYPE_COLOR[eventType] ?? "#2563EB";
  const typeLabel   = eventType.charAt(0).toUpperCase() + eventType.slice(1);
  const formatLabel = FORMAT_LABEL[format] ?? format;

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
      {/* Left accent bar */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0,
        width: "6px", backgroundColor: accent,
      }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px", height: "36px",
            backgroundColor: "#0F172A", border: "1px solid #334155", borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#F9FAFB", fontSize: "16px", fontWeight: "700" }}>R</span>
          </div>
          <span style={{ color: "#9CA3AF", fontSize: "16px", fontFamily: "Arial, sans-serif" }}>Researchvy Events</span>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div style={{
            backgroundColor: `${accent}20`, border: `1px solid ${accent}50`,
            borderRadius: "20px", padding: "5px 14px",
            color: accent, fontSize: "11px", fontWeight: "700",
            fontFamily: "Arial, sans-serif", textTransform: "uppercase", letterSpacing: "0.1em",
          }}>
            {typeLabel}
          </div>
          <div style={{
            backgroundColor: "#1E293B",
            borderRadius: "20px", padding: "5px 14px",
            color: "#9CA3AF", fontSize: "11px", fontWeight: "600",
            fontFamily: "Arial, sans-serif",
          }}>
            {formatLabel}
          </div>
        </div>
      </div>

      {/* Main title */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <h1 style={{
          margin: "0 0 18px 0",
          fontSize: title.length > 60 ? "40px" : title.length > 40 ? "46px" : "52px",
          fontWeight: "700",
          color: "#F9FAFB",
          lineHeight: "1.15",
          letterSpacing: "-0.02em",
          maxWidth: "960px",
        }}>
          {title}
        </h1>
        {description && (
          <p style={{
            margin: 0, fontSize: "18px", color: "#9CA3AF",
            lineHeight: "1.5", fontFamily: "Arial, sans-serif",
            maxWidth: "800px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {description}
          </p>
        )}
      </div>

      {/* Footer metadata bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        paddingTop: "24px", borderTop: "1px solid #1E293B",
        marginTop: "32px",
      }}>
        <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          {startDate && (
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              <span style={{ color: "#4B5563", fontSize: "10px", fontWeight: "700", fontFamily: "Arial, sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>Date</span>
              <span style={{ color: "#F9FAFB", fontSize: "14px", fontWeight: "600", fontFamily: "Arial, sans-serif" }}>{startDate}</span>
            </div>
          )}
          {location && (
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              <span style={{ color: "#4B5563", fontSize: "10px", fontWeight: "700", fontFamily: "Arial, sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>Location</span>
              <span style={{ color: "#F9FAFB", fontSize: "14px", fontWeight: "600", fontFamily: "Arial, sans-serif" }}>{location.slice(0, 40)}</span>
            </div>
          )}
          {organizer && (
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              <span style={{ color: "#4B5563", fontSize: "10px", fontWeight: "700", fontFamily: "Arial, sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>Organizer</span>
              <span style={{ color: "#F9FAFB", fontSize: "14px", fontWeight: "600", fontFamily: "Arial, sans-serif" }}>{organizer.slice(0, 36)}</span>
            </div>
          )}
        </div>
        <span style={{ color: "#374151", fontSize: "12px", fontFamily: "Arial, sans-serif" }}>researchvy.com/events</span>
      </div>
    </div>,
    { ...size },
  );
}
