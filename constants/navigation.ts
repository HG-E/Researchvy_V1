import type { NavigationItem } from "@/types";

export const mainNav: NavigationItem[] = [
  { label: "About",          href: "/about" },
  {
    label: "Ecosystem",
    href: "/ecosystem",
    children: [
      { label: "Intelligence", href: "/intelligence", description: "Research analytics & visibility insights" },
      { label: "Academy",      href: "/academy",      description: "Learning programs & certifications" },
      { label: "Media",        href: "/media",        description: "Scholarly communication & visuals" },
      { label: "Clinics",      href: "/clinics",      description: "Practical transformation experiences" },
      { label: "Network",      href: "/network",      description: "Community, fellows & partnerships" },
    ],
  },
  { label: "Clinics",        href: "/clinics" },
  { label: "Insights",       href: "/insights" },
  { label: "Resources",      href: "/resources" },
];

export const footerNav = {
  ecosystem: [
    { label: "Intelligence", href: "/intelligence" },
    { label: "Academy",      href: "/academy" },
    { label: "Media",        href: "/media" },
    { label: "Clinics",      href: "/clinics" },
    { label: "Network",      href: "/network" },
  ],
  learn: [
    { label: "Insights",       href: "/insights" },
    { label: "Resources",      href: "/resources" },
    { label: "Partnerships",   href: "/partnerships" },
  ],
  company: [
    { label: "About",          href: "/about" },
    { label: "Contact",        href: "/contact" },
  ],
};

export const dashboardNav: NavigationItem[] = [
  { label: "Dashboard",   href: "/dashboard" },
  { label: "My Clinics",  href: "/dashboard/clinics" },
  { label: "Resources",   href: "/dashboard/resources" },
  { label: "Certificates",href: "/dashboard/certificates" },
  { label: "Profile",     href: "/dashboard/profile" },
];
