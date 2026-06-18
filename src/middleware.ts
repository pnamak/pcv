import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const session = request.cookies.get("pcv_staff_session")?.value;
  const isLoginPage = pathname === "/staff";

  if (pathname.startsWith("/staff") && !isLoginPage && !session) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/staff";
    loginUrl.searchParams.set("next", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && session) {
    const next = request.nextUrl.searchParams.get("next");
    const destination =
      next && next.startsWith("/staff") && next !== "/staff"
        ? next
        : "/staff/dashboard";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/staff", "/staff/:path*"],
};
