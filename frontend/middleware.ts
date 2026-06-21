import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ["en", "ar"],
  defaultLocale: "en",
});

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname === "/en/administration" ||
    pathname.startsWith("/en/administration/") ||
    pathname === "/ar/administration" ||
    pathname.startsWith("/ar/administration/")
  ) {
    return NextResponse.redirect(
      new URL(pathname.replace(/^\/(en|ar)/, ""), request.url),
    );
  }

  if (pathname.startsWith("/administration")) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
