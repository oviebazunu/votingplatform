import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath =
    path.startsWith("/login") || path.startsWith("/register") || path === "/";

  const token = request.cookies.get("token");

  // Convert the 'isAdmin' cookie value to boolean
  const isAdminCookie = request.cookies.get("isAdmin");

  const isAdmin = isAdminCookie !== undefined && isAdminCookie.value === "true";

  // Redirect users based on isAdmin status if they have a token
  if (token) {
    if (isAdmin) {
      // Redirect admin users to the admin page
      if (path !== "/admin") {
        return NextResponse.redirect(new URL("/admin", request.nextUrl));
      }
    } else {
      // Redirect voters to the voter dashboard
      if (path !== "/voterdashboard") {
        return NextResponse.redirect(
          new URL("/voterdashboard", request.nextUrl)
        );
      }
    }
  }

  // Handle redirection for public paths
  if (isPublicPath && !token) {
    // Allow access to public paths
    return NextResponse.next();
  }

  // Redirect to the login page if accessing a non-public path without a token
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // Continue with the request for all other cases
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register", "/voterdashboard", "/admin"],
};
