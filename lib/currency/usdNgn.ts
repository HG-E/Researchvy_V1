// Fetches the live USD → NGN exchange rate from a free, no-key API.
// Falls back to a hardcoded rate if the network request fails.
// Safe to call from Server Components — Next.js deduplicates fetch() calls
// within a single render and the ISR revalidate on the consuming page
// controls how often this actually runs.

const FALLBACK_RATE = 1620; // approximate mid-2026 rate

export async function getUsdNgnRate(): Promise<number> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 21600 }, // refresh every 6 hours
    });
    if (!res.ok) return FALLBACK_RATE;
    const data = await res.json();
    const rate = data?.rates?.NGN;
    if (typeof rate === "number" && rate > 100) return Math.round(rate);
    return FALLBACK_RATE;
  } catch {
    return FALLBACK_RATE;
  }
}

export function usdToNgn(usd: number, rate: number): number {
  return Math.round(usd * rate);
}

export function formatNgn(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}
