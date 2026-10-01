import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/i18n";

/**
 * Every page lives under /en or /bg.
 * - A localised path passes through with an x-locale header (read by not-found pages).
 * - Anything else is redirected under the default locale, so /foo becomes /en/foo
 *   and lands on the localised 404 if it does not exist.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];

  if (isLocale(first)) {
    const headers = new Headers(request.headers);
    headers.set("x-locale", first);
    return NextResponse.next({ request: { headers } });
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|media|icon|apple-icon|favicon|robots|sitemap|.*\\..*).*)"],
};
