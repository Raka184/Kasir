import { NextResponse } from "next/server";

// Middleware Edge Runtime tidak bisa memakai jsonwebtoken (butuh Node "crypto"),
// jadi di sini kita hanya cek KEBERADAAN cookie. Verifikasi signature JWT yang
// sebenarnya dilakukan ulang di server component / API route (lib/auth.js).
export function middleware(request) {
  const token = request.cookies.get("kasir_token")?.value;
  const { pathname } = request.nextUrl;

  const isDashboard = pathname.startsWith("/dashboard");
  const isAuthPage = ["/login", "/register", "/forgot-password", "/reset-password"].includes(pathname);

  if (isDashboard && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (isAuthPage && token) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/forgot-password", "/reset-password"],
};
