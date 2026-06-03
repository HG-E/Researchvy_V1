import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/auth/middleware";

/**
 * Next.js 16 proxy (replaces the legacy "middleware" convention).
 * Handles:
 * - Supabase session refresh on every request
 * - Protecting /dashboard and /admin routes
 * - Redirecting authenticated users away from /signin and /signup
 */
export default async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|manifest.json|site.webmanifest|sw.js|workbox-.*\\.js|images/|icons/|fonts/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf)$).*)",
  ],
};
