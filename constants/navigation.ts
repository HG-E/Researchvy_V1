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
      { label: "Network",      href: "/network",      description: "Community, fellows & partnerships" },
    ],
  },
  { label: "Clinics",        href: "/clinics" },
  { label: "Events",         href: "/events" },
  { label: "Opportunities",  href: "/opportunities" },
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
    { label: "Events",         href: "/events" },
    { label: "Opportunities",  href: "/opportunities" },
    { label: "Insights",       href: "/insights" },
    { label: "Resources",      href: "/resources" },
    { label: "Partnerships",   href: "/partnerships" },
  ],
  for_researchers: [
    { label: "For Researchers",                href: "/researchers" },
    { label: "Early-Career Researchers",       href: "/researchers/early-career" },
    { label: "Institutions & Research Offices", href: "/researchers/institutional" },
    { label: "Visibility Scorecard (Free)",     href: "/resources/visibility-scorecard" },
    { label: "Free Strategy Call",             href: "/consultation" },
    { label: "Digital Visibility Clinic",       href: "/clinics/digital-visibility-clinic" },
  ],
  company: [
    { label: "About",   href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
};

export const dashboardNav: NavigationItem[] = [
  { label: "Dashboard",      href: "/dashboard" },
  { label: "My Clinics",     href: "/dashboard/clinics" },
  { label: "My Events",      href: "/dashboard/events" },
  { label: "Opportunities",  href: "/dashboard/opportunities" },
  { label: "Academy",        href: "/dashboard/academy" },
  { label: "Resources",      href: "/dashboard/resources" },
  { label: "Certificates",   href: "/dashboard/certificates" },
  { label: "Profile",        href: "/dashboard/profile" },
];
