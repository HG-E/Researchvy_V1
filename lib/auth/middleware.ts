import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

type CookieToSet = { name: string; value: string; options?: Record<string, unknown> };

/**
 * Refreshes the Supabase session and returns the response with updated cookies.
 * Used by the root proxy.ts file.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options as Parameters<typeof supabaseResponse.cookies.set>[2])
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protect /dashboard and /admin
  const isProtected =
    pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  if (!user && isProtected) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/signin";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users away from auth pages, honouring ?next
  const isAuthPage =
    pathname.startsWith("/signin") || pathname.startsWith("/signup");

  if (user && isAuthPage) {
    const next = request.nextUrl.searchParams.get("next");
    const dest  = next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = dest;
    redirectUrl.search   = "";
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
