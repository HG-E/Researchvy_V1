"use client";

import Link from "next/link";
import { Logo } from "@/components/common/Logo";
import { footerNav } from "@/constants/navigation";
import { siteConfig } from "@/config/site";
import { Twitter, Linkedin, Youtube } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t" style={{ backgroundColor: "#080E1A", borderColor: "#1E293B" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Logo variant="full" width={140} linkToHome />
            <p className="mt-4 text-sm leading-relaxed max-w-xs" style={{ color: "#6B7280" }}>
              {siteConfig.description}
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { href: siteConfig.social.twitter, Icon: Twitter, label: "Twitter" },
                { href: siteConfig.social.linkedin, Icon: Linkedin, label: "LinkedIn" },
                { href: siteConfig.social.youtube, Icon: Youtube, label: "YouTube" },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center border transition-all duration-200"
                  style={{ borderColor: "#1E293B", color: "#6B7280" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#2563EB";
                    e.currentTarget.style.color = "#2563EB";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#1E293B";
                    e.currentTarget.style.color = "#6B7280";
                  }}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Ecosystem */}
          <div>
            <h3
              className="text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ color: "#F9FAFB" }}
            >
              Ecosystem
            </h3>
            <ul className="space-y-2.5">
              {footerNav.ecosystem.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm transition-colors"
                    style={{ color: "#6B7280" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#9CA3AF")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h3
              className="text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ color: "#F9FAFB" }}
            >
              Learn
            </h3>
            <ul className="space-y-2.5">
              {footerNav.learn.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm transition-colors"
                    style={{ color: "#6B7280" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#9CA3AF")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company + Contact */}
          <div>
            <h3
              className="text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ color: "#F9FAFB" }}
            >
              Company
            </h3>
            <ul className="space-y-2.5 mb-8">
              {footerNav.company.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm transition-colors"
                    style={{ color: "#6B7280" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#9CA3AF")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3
              className="text-xs font-semibold tracking-widest uppercase mb-3"
              style={{ color: "#F9FAFB" }}
            >
              Contact
            </h3>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="text-sm transition-colors block"
              style={{ color: "#6B7280" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#9CA3AF")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
            >
              {siteConfig.contact.email}
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
          style={{ borderColor: "#1E293B", color: "#4B5563" }}
        >
          <p>© {currentYear} Researchvy. All rights reserved.</p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="transition-colors"
              style={{ color: "#4B5563" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#6B7280")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#4B5563")}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="transition-colors"
              style={{ color: "#4B5563" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#6B7280")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#4B5563")}
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
