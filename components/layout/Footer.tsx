"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { footerNav } from "@/constants/navigation";
import { siteConfig } from "@/config/site";
import { Twitter, Linkedin, Youtube } from "lucide-react";

const NAV_SECTIONS = [
  { title: "Ecosystem",       links: footerNav.ecosystem },
  { title: "For Researchers", links: footerNav.for_researchers },
  { title: "Learn",           links: footerNav.learn },
  { title: "Company",         links: footerNav.company },
] as const;

function FooterSection({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b md:border-0" style={{ borderColor: "#1E293B" }}>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden w-full flex items-center justify-between py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#F9FAFB" }}>
          {title}
        </span>
        <ChevronDown
          className="h-4 w-4 transition-transform duration-200 flex-shrink-0"
          style={{
            color: "#4B5563",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {/* Desktop heading */}
      <h3
        className="hidden md:block text-xs font-semibold tracking-widest uppercase mb-4"
        style={{ color: "#F9FAFB" }}
      >
        {title}
      </h3>

      {/* Links — always visible on md+, toggled on mobile */}
      <ul
        className={`space-y-2.5 overflow-hidden transition-all duration-200 ${
          open ? "max-h-96 pb-4" : "max-h-0 md:max-h-none"
        } md:!max-h-none md:pb-0`}
      >
        {links.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block text-sm transition-colors py-1 active:opacity-60 hover:text-[#9CA3AF]"
              style={{ color: "#6B7280" }}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t" style={{ backgroundColor: "#080E1A", borderColor: "#1E293B" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">

        {/* Brand + socials — always full width on mobile, 2-col span on lg */}
        <div className="mb-8 md:mb-0 md:hidden">
          <Logo variant="full" width={130} linkToHome />
          <p className="mt-3 text-sm leading-relaxed" style={{ color: "#6B7280" }}>
            {siteConfig.description}
          </p>
          <div className="mt-5 flex gap-3">
            {[
              { href: siteConfig.social.twitter,  Icon: Twitter,  label: "Twitter" },
              { href: siteConfig.social.linkedin,  Icon: Linkedin, label: "LinkedIn" },
              { href: siteConfig.social.youtube,   Icon: Youtube,  label: "YouTube" },
            ].map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-10 h-10 rounded-lg flex items-center justify-center border transition-colors active:opacity-60"
                style={{ borderColor: "#1E293B", color: "#6B7280" }}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:grid grid-cols-6 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <Logo variant="full" width={140} linkToHome />
            <p className="mt-4 text-sm leading-relaxed max-w-xs" style={{ color: "#6B7280" }}>
              {siteConfig.description}
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { href: siteConfig.social.twitter,  Icon: Twitter,  label: "Twitter" },
                { href: siteConfig.social.linkedin,  Icon: Linkedin, label: "LinkedIn" },
                { href: siteConfig.social.youtube,   Icon: Youtube,  label: "YouTube" },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center border transition-all duration-200 hover:border-[#2563EB] hover:text-[#2563EB]"
                  style={{ borderColor: "#1E293B", color: "#6B7280" }}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {NAV_SECTIONS.map(({ title, links }) => (
            <div key={title}>
              <h3 className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#F9FAFB" }}>
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm transition-colors hover:text-[#9CA3AF]"
                      style={{ color: "#6B7280" }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact inline with Company on desktop */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#F9FAFB" }}>
              Contact
            </h3>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="text-sm transition-colors hover:text-[#9CA3AF] block"
              style={{ color: "#6B7280" }}
            >
              {siteConfig.contact.email}
            </a>
          </div>
        </div>

        {/* Mobile accordion nav */}
        <div className="md:hidden border-t" style={{ borderColor: "#1E293B" }}>
          {NAV_SECTIONS.map(({ title, links }) => (
            <FooterSection key={title} title={title} links={links} />
          ))}
          {/* Contact row */}
          <div className="py-4">
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#4B5563" }}>
              Contact
            </p>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="text-sm active:opacity-60"
              style={{ color: "#6B7280" }}
            >
              {siteConfig.contact.email}
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-8 md:mt-12 pt-6 md:pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{ borderColor: "#1E293B", color: "#4B5563" }}
        >
          <p>© {currentYear} Researchvy. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="transition-colors hover:text-[#6B7280] active:opacity-60" style={{ color: "#4B5563" }}>
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-[#6B7280] active:opacity-60" style={{ color: "#4B5563" }}>
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
