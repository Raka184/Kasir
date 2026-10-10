import { NextResponse } from "next/server";
import { getTokenPayload, COOKIE_NAME } from "@/lib/session";

export function middleware(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const user = token ? getTokenPayload(token) : null;
  const { pathname } = request.nextUrl;

  const isDashboard = pathname.startsWith("/dashboard");
  const isAuthPage = ["/login", "/register", "/forgot-password", "/reset-password"].includes(pathname);
  const hasValidSession = Boolean(user);

  if (isDashboard && !hasValidSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (isAuthPage && hasValidSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/forgot-password", "/reset-password"],
};
