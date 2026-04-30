import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // 1. If authenticated user tries to access auth pages
    const isAuthPage = pathname.startsWith("/auth/login") || 
                       pathname === "/auth/register" || 
                       pathname.startsWith("/auth/forgot-password") || 
                       pathname.startsWith("/auth/verify-email");

    if (token && isAuthPage) {
      const role = (token.role as string)?.toUpperCase();
      const name = (token.name as string);

      // If profile is incomplete (name is empty), redirect to data form
      if (!name || name.trim() === "") {
        if (role === "ORGANIZER") {
          return NextResponse.redirect(new URL("/auth/register/eo/data-form", req.url));
        } else {
          return NextResponse.redirect(new URL("/auth/register/peserta/data-form", req.url));
        }
      }

      // Otherwise, redirect to dashboard
      if (role === "ORGANIZER") {
        return NextResponse.redirect(new URL("/organizer/dashboard", req.url));
      } else if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      } else {
        return NextResponse.redirect(new URL("/peserta/dashboard", req.url));
      }
    }

    // 2. Protect root path "/" for logged-in users, redirecting them appropriately
    if (token && pathname === "/") {
      const role = (token.role as string)?.toUpperCase();
      const name = (token.name as string);

      if (!name || name.trim() === "") {
        if (role === "ORGANIZER") {
          return NextResponse.redirect(new URL("/auth/register/eo/data-form", req.url));
        } else {
          return NextResponse.redirect(new URL("/auth/register/peserta/data-form", req.url));
        }
      }

      if (role === "ORGANIZER") {
        return NextResponse.redirect(new URL("/organizer/dashboard", req.url));
      } else if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      } else {
        return NextResponse.redirect(new URL("/peserta/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;
        
        // Protect these routes, requiring a valid token
        if (
          pathname.startsWith("/admin") || 
          pathname.startsWith("/organizer") || 
          pathname.startsWith("/peserta") ||
          pathname.includes("/data-form")
        ) {
          return !!token;
        }
        
        // Public routes
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
