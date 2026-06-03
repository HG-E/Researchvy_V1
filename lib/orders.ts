import { digitalVisibilityClinic } from "@/constants/clinics";
import { PAYMENT_CONFIG } from "@/constants/payment";

const REF_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I

export function generateOrderReference(): string {
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += REF_CHARS[Math.floor(Math.random() * REF_CHARS.length)];
  }
  return `RVYDVC-${suffix}`;
}

export function isEarlyBird(): boolean {
  return new Date() < new Date(PAYMENT_CONFIG.earlyBirdDeadline);
}

export function resolveAmount(
  bundleId: string,
  moduleId: string | null,
  currency: "ngn" | "usd",
  earlyBird: boolean,
): number {
  const { sessions, pricing } = digitalVisibilityClinic;
  if (bundleId === "solo" && moduleId) {
    const session = sessions.find((s) => s.id === moduleId);
    if (!session) return 0;
    const p = session.soloPrice;
    return currency === "usd"
      ? (earlyBird ? p.usd.earlyBird : p.usd.regular)
      : (earlyBird ? p.ngn.earlyBird : p.ngn.regular);
  }
  const bundle = pricing.bundles.find((b) => b.id === bundleId);
  if (!bundle) return 0;
  return currency === "usd"
    ? (earlyBird ? bundle.usd.earlyBird : bundle.usd.regular)
    : (earlyBird ? bundle.ngn.earlyBird : bundle.ngn.regular);
}
