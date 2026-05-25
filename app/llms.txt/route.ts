import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

export function GET() {
  const base = siteConfig.url;

  const content = `# Researchvy

> ${siteConfig.description}

Researchvy is a scholarly visibility and research intelligence ecosystem that helps researchers, postgraduate scholars, and institutions become globally discoverable. We close the gap between publishing research and having it found, cited, and applied.

## Core Services

- **Researchvy Clinics** — Live 6-session Digital Visibility Clinic™ in cohorts of ≤20. Researchers leave with a fully optimised scholarly identity, personal visibility strategy, and verified certificate. ${base}/clinics
- **Researchvy Academy** — A 5-level structured curriculum teaching visibility skills academia never taught: from foundation to advanced citation strategy. ${base}/academy
- **Researchvy Intelligence** — Visibility audits, citation intelligence, and institutional benchmarking — measuring your discoverability gaps and building a prioritised plan to close them. ${base}/ecosystem
- **Researchvy Media** — Research storytelling, visual abstracts, and policy translation — making research findings accessible to policymakers, practitioners, and the public. ${base}/ecosystem
- **Researchvy Network** — Peer community and fellows programme for researchers building global visibility together. ${base}/ecosystem

## Key Pages

- Homepage: ${base}
- About & Mission: ${base}/about
- Clinics (flagship programme): ${base}/clinics
- Academy: ${base}/academy
- Ecosystem (all divisions): ${base}/ecosystem
- Insights (research visibility articles): ${base}/insights
- Resources (templates, guides, tools): ${base}/resources
- Pricing: ${base}/pricing
- Contact: ${base}/contact

## The Researchvy Framework

Researchvy guides researchers through 7 stages: Research → Visibility → Discoverability → Connection → Communication → Application → Impact

## Who We Serve

- Early-career and postgraduate researchers
- Established academics seeking global reach
- Institutions measuring and improving researcher visibility
- Researchers in the Global South seeking equitable discoverability

## Brand Values

- Scholarly Integrity: highest standards of academic rigour
- Equity in Visibility: every researcher deserves global discoverability regardless of geography or institution
- Impact Over Output: success measured by real-world application and societal change

## Contact

- Website: ${base}
- Email: ${siteConfig.contact.email}
- Twitter/X: ${siteConfig.social.twitter}
- LinkedIn: ${siteConfig.social.linkedin}
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  });
}
