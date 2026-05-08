import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const PROTECTED_ROUTES = ["/saved"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected) {
    // We check for the token via a cookie or let the client handle redirect.
    // Since we use localStorage (client-only), the page component handles redirect.
    // This middleware handles any future server-side cookie-based auth.
    const token = request.cookies.get("token")?.value;

    // If you switch to cookie-based auth in the future, uncomment:
    // if (!token) {
    //   return NextResponse.redirect(new URL("/auth/login", request.url));
    // }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/saved/:path*"],
};
