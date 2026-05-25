import { generatePageMetadata } from "@/lib/seo/metadata";
import { Hero } from "@/components/sections/Hero";
import { VisibilityGap } from "@/components/sections/VisibilityGap";
import { ScorecardBridge } from "@/components/sections/ScorecardBridge";
import { Framework } from "@/components/sections/Framework";
import { ClinicFeature } from "@/components/sections/ClinicFeature";
import { CaseStudy } from "@/components/sections/CaseStudy";
import { EcosystemOverview } from "@/components/sections/EcosystemOverview";
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
      <Hero />
      <VisibilityGap />
      <ScorecardBridge />
      <Framework />
      <ClinicFeature />
      <CaseStudy />
      <EcosystemOverview />
      <SocialProof />
      <CTA />
    </>
  );
}
