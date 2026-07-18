import { redirect } from "next/navigation";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { getServerUser } from "@/lib/auth/supabase";
import { digitalVisibilityClinic } from "@/constants/clinics";
import { PAYMENT_CONFIG } from "@/constants/payment";
import { CheckoutForm } from "./CheckoutForm";

export const metadata = generatePageMetadata({ title: "Checkout", noIndex: true });

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ bundle?: string; module?: string }>;
}) {
  const { bundle: bundleId = "core", module: moduleId } = await searchParams;

  const user = await getServerUser();
  if (!user) {
    const next = encodeURIComponent(
      `/clinics/checkout?bundle=${bundleId}${moduleId ? `&module=${moduleId}` : ""}`,
    );
    // Send new visitors to signup — most scorecard → checkout users are new.
    // The signup page links to signin for returning users.
    redirect(`/signup?next=${next}&from=clinic`);
  }

  const bundles = [...digitalVisibilityClinic.pricing.bundles];
  const bundle  = bundles.find((b) => b.id === bundleId) ?? bundles.find((b) => b.id === "core")!;
  const coreModules = digitalVisibilityClinic.sessions.filter((s) => !s.isBonus);
  const earlyBird   = new Date() < new Date(PAYMENT_CONFIG.earlyBirdDeadline);

  const fullName: string =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    "";

  return (
    <CheckoutForm
      userId={user.id}
      userEmail={user.email ?? ""}
      userName={fullName}
      bundle={{
        id:          bundle.id,
        name:        bundle.name,
        tagline:     bundle.tagline,
        isSolo:      bundle.isSolo,
        savingsLabel: bundle.savingsLabel,
        usd:         { regular: bundle.usd.regular, earlyBird: bundle.usd.earlyBird },
        ngn:         { regular: bundle.ngn.regular, earlyBird: bundle.ngn.earlyBird },
        includes:    [...bundle.includes],
      }}
      modules={coreModules.map((s) => ({
        id:        s.id,
        name:      s.name,
        title:     s.title,
        soloPrice: {
          usd: { regular: s.soloPrice.usd.regular, earlyBird: s.soloPrice.usd.earlyBird },
          ngn: { regular: s.soloPrice.ngn.regular, earlyBird: s.soloPrice.ngn.earlyBird },
        },
      }))}
      initialModuleId={moduleId ?? null}
      isEarlyBird={earlyBird}
      earlyBirdDeadline={PAYMENT_CONFIG.earlyBirdDeadline}
    />
  );
}
