import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Redis client — only created when env vars are present (production + local with .env.local set)
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url:   process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

/**
 * Returns { allowed, remaining }.
 * Uses Upstash Redis sliding window when available; falls back to
 * always-allowed in local dev without Redis configured.
 */
export async function checkRateLimit(
  key:      string,
  limit:    number,
  windowMs: number,
): Promise<{ allowed: boolean; remaining: number }> {
  if (!redis) {
    return { allowed: true, remaining: limit - 1 };
  }

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, `${windowMs} ms`),
    prefix:  "rl",
  });

  try {
    const result = await limiter.limit(key);
    return { allowed: result.success, remaining: result.remaining };
  } catch {
    // Redis error in production — fail closed to prevent rate-limit bypass during outage
    console.error("[rate-limit] Redis error; denying request to fail safe");
    return { allowed: false, remaining: 0 };
  }
}

/** Extract a stable rate-limit key from request IP + a namespace prefix. */
export function getRateLimitKey(req: Request, prefix: string): string {
  const headers   = req.headers as unknown as Headers;
  const forwarded = headers.get("x-forwarded-for");
  const realIp    = headers.get("x-real-ip");
  // x-real-ip is set by Vercel/Nginx and cannot be spoofed by clients.
  // Fall back to the RIGHTMOST XFF entry (added by the outermost trusted proxy),
  // never the leftmost which is attacker-controlled.
  const ip        = realIp ?? forwarded?.split(",").at(-1)?.trim() ?? "unknown";
  return `${prefix}:${ip}`;
}
