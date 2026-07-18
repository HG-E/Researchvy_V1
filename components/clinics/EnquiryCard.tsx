"use client";

import Link from "next/link";
import { MessageCircle, Clock, Monitor, Users, Award, Zap } from "lucide-react";
import { buildWhatsAppUrl } from "@/config/site";
import { useAnalytics } from "@/hooks/useAnalytics";
import { EVENTS } from "@/lib/analytics/events";

interface EnquiryCardProps {
  clinicName:    string;
  duration:      string;
  format:        string;
  capacity:      number;
  earlyBirdFrom?: string;
}

export function EnquiryCard({ clinicName, duration, format, capacity, earlyBirdFrom }: EnquiryCardProps) {
  const waUrl = buildWhatsAppUrl(clinicName);
  const { track } = useAnalytics();

  return (
    <div
      className="rounded-2xl border p-6 space-y-6"
      style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }}
    >
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "#10B981" }}>
          Limited Cohort, ≤{capacity} Researchers
        </p>
        <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "#111827" }}>
          Secure Your Place
        </p>
        {earlyBirdFrom && (
          <div className="flex items-center gap-1.5 mt-2">
            <Zap className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#FCD34D" }} />
            <p className="text-xs font-semibold" style={{ color: "#FCD34D" }}>
              {earlyBirdFrom}
            </p>
          </div>
        )}
        <Link
          href="/clinics#pricing"
          className="inline-block text-xs mt-1 transition-colors hover:text-[#60A5FA]"
          style={{ color: "#6B7280" }}
        >
          View all tiers &amp; pricing →
        </Link>
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
              style={{ backgroundColor: "#F1F5F9" }}
            >
              <Icon className="h-4 w-4" style={{ color: "#60A5FA" }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: "#6B7280" }}>{label}</p>
              <p className="text-sm font-medium" style={{ color: "#111827" }}>{value}</p>
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
        className="flex items-center justify-center gap-2 w-full rounded-xl py-2.5 text-xs font-medium border transition-colors hover:bg-[#F1F5F9]"
        style={{ borderColor: "#E2E8F0", color: "#6B7280" }}
      >
        Or email info@researchvy.com
      </a>

      <p className="text-xs text-center" style={{ color: "#374151" }}>
        Spots fill fast. Respond within 24 hours.
      </p>
    </div>
  );
}
