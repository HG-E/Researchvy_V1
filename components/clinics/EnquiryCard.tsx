"use client";

import { MessageCircle, Clock, Monitor, Users, Award } from "lucide-react";
import { buildWhatsAppUrl } from "@/config/site";
import { useAnalytics } from "@/hooks/useAnalytics";
import { EVENTS } from "@/lib/analytics/events";

interface EnquiryCardProps {
  clinicName: string;
  duration:   string;
  format:     string;
  capacity:   number;
}

export function EnquiryCard({ clinicName, duration, format, capacity }: EnquiryCardProps) {
  const waUrl = buildWhatsAppUrl(clinicName);
  const { track } = useAnalytics();

  return (
    <div
      className="rounded-2xl border p-6 space-y-6"
      style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
    >
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#10B981" }}>
          Limited Cohort — ≤{capacity} Researchers
        </p>
        <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "#F9FAFB" }}>
          Claim Your Spot
        </p>
        <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "#6B7280" }}>
          Pricing is tailored to your context and shared directly. Reach out — we respond within 24 hours.
        </p>
      </div>

      {/* Stats */}
      <div className="space-y-3">
        {[
          { Icon: Clock,   label: "Duration",  value: duration },
          { Icon: Monitor, label: "Format",    value: format },
          { Icon: Users,   label: "Cohort size", value: `Up to ${capacity} participants` },
          { Icon: Award,   label: "Certificate", value: "Included on completion" },
        ].map(({ Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#1E293B" }}
            >
              <Icon className="h-4 w-4" style={{ color: "#60A5FA" }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: "#4B5563" }}>{label}</p>
              <p className="text-sm font-medium" style={{ color: "#F9FAFB" }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200"
        style={{ backgroundColor: "#25D366" }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1DAE54")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#25D366")}
        onClick={() => track(EVENTS.WHATSAPP_CTA_CLICKED, { clinic: clinicName, location: "enquiry_card" })}
      >
        <MessageCircle className="h-4 w-4" />
        Claim My Spot via WhatsApp
      </a>

      <a
        href="mailto:info@researchvy.com?subject=Clinic%20Pricing%20Enquiry"
        className="flex items-center justify-center gap-2 w-full rounded-xl py-2.5 text-xs font-medium border transition-colors hover:bg-[#1E293B]"
        style={{ borderColor: "#1E293B", color: "#9CA3AF" }}
      >
        Or email info@researchvy.com
      </a>

      <p className="text-xs text-center" style={{ color: "#374151" }}>
        Spots fill fast. Respond within 24 hours.
      </p>
    </div>
  );
}
