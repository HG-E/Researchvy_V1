import { generatePageMetadata } from "@/lib/seo/metadata";
import { Hero } from "@/components/sections/Hero";
import { VisibilityGap } from "@/components/sections/VisibilityGap";
import { Framework } from "@/components/sections/Framework";
import { EcosystemOverview } from "@/components/sections/EcosystemOverview";
import { ClinicFeature } from "@/components/sections/ClinicFeature";
import { TrustBar } from "@/components/sections/TrustBar";
import { CTA } from "@/components/sections/CTA";

export const metadata = generatePageMetadata({
  title: "Research Beyond Publication",
  description:
    "Researchvy is a modern scholarly visibility and research intelligence ecosystem helping researchers navigate discoverability, communication, and meaningful research impact.",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <VisibilityGap />
      <Framework />
      <EcosystemOverview />
      <ClinicFeature />
      <TrustBar />
      <CTA />
    </>
  );
}
