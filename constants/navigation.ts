import type { NavigationItem } from "@/types";

export const mainNav: NavigationItem[] = [
  {
    label: "Clinics",
    href:  "/clinics",
    children: [
      { label: "Digital Visibility Clinic", href: "/clinics/digital-visibility-clinic", description: "5-session cohort programme · from $79" },
      { label: "Private Consulting",        href: "/clinics/private-consulting",        description: "1-on-1 done-for-you · from $209"        },
      { label: "Academy",                   href: "/academy",                           description: "Learning programs & certifications"     },
    ],
  },
  {
    label: "Free Tools",
    href:  "/resources",
    children: [
      { label: "Visibility Scorecard",     href: "/resources/visibility-scorecard",    description: "Free 12-checkpoint research audit"          },
      { label: "Free Pre-Clinic",          href: "/pre-clinic",                        description: "Free live ORCID workshop · 15–16 August"    },
      { label: "Free Strategy Call",       href: "/consultation",                      description: "20-min free call with our team"             },
      { label: "Institutional Letter",     href: "/resources/institutional-letter",    description: "Request a sponsor letter for your clinic"   },
    ],
  },
  { label: "Opportunities",  href: "/opportunities" },
  { label: "Insights",       href: "/insights" },
  { label: "About",          href: "/about" },
  { label: "Contact",        href: "/contact" },
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
    { label: "Private Consulting",              href: "/clinics/private-consulting" },
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
