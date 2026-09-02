import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("jbf_admin")?.value;
  const path = req.nextUrl.pathname;

  // Login page
  if (path === "/admin/login") {
    if (token === "logged_in") {
      return NextResponse.redirect(
        new URL("/admin/dashboard", req.url)
      );
    }
    return NextResponse.next();
  }

  // Protect admin pages
  if (
    path.startsWith("/admin") &&
    path !== "/admin/login"
  ) {
    if (token !== "logged_in") {
      return NextResponse.redirect(
        new URL("/admin/login", req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};