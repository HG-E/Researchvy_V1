import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/auth/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match every path except static files and Next.js internals.
     * Keeps session cookies fresh on every navigation without
     * impacting static asset delivery.
     */
    "/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|manifest.json|sw.js|workbox-.*\\.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf)).*)",
  ],
};
