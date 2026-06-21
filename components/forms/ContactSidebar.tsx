"use client";

import { MessageSquare, Mail } from "lucide-react";
import { siteConfig, buildWhatsAppUrl } from "@/config/site";

export function ContactSidebar() {
  return (
    <div className="space-y-6">
      {/* Email */}
      <div
        className="rounded-2xl p-6 border"
        style={{ backgroundColor: "#1E293B", borderColor: "#334155" }}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#0F172A" }}
          >
            <Mail className="h-5 w-5" style={{ color: "#2563EB" }} />
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-1" style={{ color: "#F9FAFB" }}>
              Email
            </h3>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="text-sm transition-colors"
              style={{ color: "#9CA3AF" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#F9FAFB")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
            >
              {siteConfig.contact.email}
            </a>
            <p className="text-xs mt-1" style={{ color: "#6B7280" }}>
              Response within 1–2 business days
            </p>
          </div>
        </div>
      </div>

      {/* WhatsApp */}
      <div
        className="rounded-2xl p-6 border"
        style={{ backgroundColor: "#1E293B", borderColor: "#334155" }}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#0F172A" }}
          >
            <MessageSquare className="h-5 w-5" style={{ color: "#25D366" }} />
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-1" style={{ color: "#F9FAFB" }}>
              WhatsApp
            </h3>
            <p className="text-xs mb-3" style={{ color: "#9CA3AF" }}>
              For urgent enquiries, clinic pricing, or Private Consulting availability.
            </p>
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold rounded-lg px-4 py-2 text-white transition-all duration-200"
              style={{ backgroundColor: "#25D366" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#16A34A")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#25D366")}
            >
              <MessageSquare className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div
        className="rounded-2xl p-6 border"
        style={{ backgroundColor: "#0F172A", borderColor: "#1E293B" }}
      >
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-3"
          style={{ color: "#2563EB" }}
        >
          Before You Write
        </p>
        <ul className="space-y-2 text-xs" style={{ color: "#9CA3AF" }}>
          <li>• Clinic or Private Consulting pricing → use WhatsApp for fastest response</li>
          <li>• Partnership enquiries → email is best</li>
          <li>• Technical issues → include your browser and OS</li>
          <li>• Research visibility questions → check our Insights first</li>
        </ul>
      </div>
    </div>
  );
}
