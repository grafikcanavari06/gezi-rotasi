// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("rota_token")?.value;

  // 1) admin sayfaları token ister
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // 2) profile da token ister
  if (pathname === "/profile") {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // 3) login'e giderken zaten token varsa profile'a at
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile", "/login"],
};
