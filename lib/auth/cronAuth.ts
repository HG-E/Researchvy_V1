import { timingSafeEqual } from "crypto";
import { NextRequest } from "next/server";

/**
 * Constant-time secret comparison for cron endpoints.
 * Prevents timing attacks that could reveal the secret length or content.
 */
export function isCronAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const provided = (req.headers.get("authorization") ?? "").replace("Bearer ", "");
  if (!provided) return false;
  try {
    return timingSafeEqual(Buffer.from(provided, "utf8"), Buffer.from(secret, "utf8"));
  } catch {
    return false;
  }
}
