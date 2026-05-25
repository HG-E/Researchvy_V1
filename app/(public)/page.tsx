import { generatePageMetadata } from "@/lib/seo/metadata";
import { organizationSchema, websiteSchema } from "@/lib/seo/schemas";
import { Hero } from "@/components/sections/Hero";
import { VisibilityGap } from "@/components/sections/VisibilityGap";
import { Framework } from "@/components/sections/Framework";
import { EcosystemOverview } from "@/components/sections/EcosystemOverview";
import { ClinicFeature } from "@/components/sections/ClinicFeature";
import { CaseStudy } from "@/components/sections/CaseStudy";
import { SocialProof } from "@/components/sections/SocialProof";
import { CTA } from "@/components/sections/CTA";

export const metadata = generatePageMetadata({
  title: "Research Beyond Publication",
  description:
    "Millions of researchers publish every year. Most are never found. Researchvy transforms researchers into globally visible, citable, and discoverable scholars.",
});

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema()) }}
      />
      <Hero />
      <VisibilityGap />
      <Framework />
      <EcosystemOverview />
      <ClinicFeature />
      <CaseStudy />
      <SocialProof />
      <CTA />
    </>
  );
}
