import { generatePageMetadata } from "@/lib/seo/metadata";
import { Hero } from "@/components/sections/Hero";
import { VisibilityGap } from "@/components/sections/VisibilityGap";
import { Framework } from "@/components/sections/Framework";
import { EcosystemOverview } from "@/components/sections/EcosystemOverview";
import { ClinicFeature } from "@/components/sections/ClinicFeature";
import { SocialProof } from "@/components/sections/SocialProof";
import { TrustBar } from "@/components/sections/TrustBar";
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
      <Framework />
      <EcosystemOverview />
      <ClinicFeature />
      <SocialProof />
      <TrustBar />
      <CTA />
    </>
  );
}
