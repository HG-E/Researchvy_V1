interface Record {
  count:   number;
  resetAt: number;
}

// Module-level store — persists across requests within the same serverless instance.
// Handles the majority of abuse; swap Map → Upstash Redis for cross-instance protection.
const store = new Map<string, Record>();

/**
 * Returns allowed=true if the key is under the limit, false if exceeded.
 * limit   — max requests per window
 * windowMs — sliding window in milliseconds
 */
export function checkRateLimit(
  key:      string,
  limit:    number,
  windowMs: number,
): { allowed: boolean; remaining: number } {
  const now    = Date.now();
  const record = store.get(key);

  if (!record || now > record.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: limit - record.count };
}

/** Extract a stable key from request IP + a namespace prefix. */
export function getRateLimitKey(req: Request, prefix: string): string {
  const forwarded = (req.headers as unknown as Headers).get("x-forwarded-for");
  const realIp    = (req.headers as unknown as Headers).get("x-real-ip");
  const ip        = forwarded?.split(",")[0]?.trim() ?? realIp ?? "unknown";
  return `${prefix}:${ip}`;
}
