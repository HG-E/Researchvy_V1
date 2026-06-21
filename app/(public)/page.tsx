import { Suspense } from "react";
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

// Skeleton shimmer holds space while sections stream in — prevents layout shift
function SectionFallback({ height = "400px" }: { height?: string }) {
  return (
    <div
      style={{ minHeight: height, backgroundColor: "#080E1A" }}
      aria-hidden
      className="relative overflow-hidden"
    >
      <div
        className="absolute inset-0 animate-shimmer"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(30,41,59,0.4) 50%, transparent 100%)",
        }}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Above-fold: render immediately, no Suspense */}
      <Hero />

      {/* Below-fold sections stream progressively so Hero is interactive first */}
      <Suspense fallback={<SectionFallback height="360px" />}>
        <VisibilityGap />
      </Suspense>

      <Suspense fallback={<SectionFallback height="320px" />}>
        <ScorecardBridge />
      </Suspense>

      <Suspense fallback={<SectionFallback height="480px" />}>
        <Framework />
      </Suspense>

      <Suspense fallback={<SectionFallback height="520px" />}>
        <ClinicFeature />
      </Suspense>

      <Suspense fallback={<SectionFallback height="600px" />}>
        <CaseStudy />
      </Suspense>

      <Suspense fallback={<SectionFallback height="400px" />}>
        <EcosystemOverview />
      </Suspense>

      <Suspense fallback={<SectionFallback height="480px" />}>
        <SocialProof />
      </Suspense>

      <Suspense fallback={<SectionFallback height="280px" />}>
        <CTA />
      </Suspense>
    </>
  );
}
