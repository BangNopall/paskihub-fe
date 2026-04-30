import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // If authenticated user tries to access login or register page
    if (token && (pathname.startsWith("/auth/login") || pathname === "/auth/register" || pathname === "/auth/forgot-password")) {
      const role = (token.role as string)?.toLowerCase();
      // Redirect to their respective dashboard based on role
      if (role === "eo" || role === "organizer") {
        return NextResponse.redirect(new URL("/organizer/dashboard", req.url));
      } else if (role === "admin") {
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
