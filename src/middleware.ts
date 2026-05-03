import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    const isAuthPage =
      pathname.startsWith("/auth/login") ||
      pathname === "/auth/register" ||
      pathname.startsWith("/auth/forgot-password") ||
      pathname.startsWith("/auth/verify-email")

    if (token) {
      const role = token.role as string

      // Helper for dashboard redirect
      const redirectToDashboard = () => {
        if (role === "ORGANIZER")
          return NextResponse.redirect(new URL("/organizer/dashboard", req.url))
        if (role === "ADMIN")
          return NextResponse.redirect(new URL("/admin/dashboard", req.url))
        return NextResponse.redirect(new URL("/peserta/dashboard", req.url))
      }

      // 1. Handle Auth Pages and Root Path
      if (isAuthPage || pathname === "/") {
        return redirectToDashboard()
      }

      // 2. Handle Data Form Route Access
      if (pathname.includes("/data-form")) {
        // Prevent cross-role form access
        if (role === "ORGANIZER" && !pathname.includes("/eo/data-form")) {
          return redirectToDashboard()
        }
        if (role === "PESERTA" && !pathname.includes("/peserta/data-form")) {
          return redirectToDashboard()
        }
      }

      // 3. Handle Dashboard/Protected Route Access
      if (
        pathname.startsWith("/organizer") ||
        pathname.startsWith("/peserta")
      ) {
        // Prevent cross-role access
        if (role === "ORGANIZER" && !pathname.startsWith("/organizer")) {
          return redirectToDashboard()
        }
        if (role === "PESERTA" && !pathname.startsWith("/peserta")) {
          return redirectToDashboard()
        }
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl

        // Protect these routes, requiring a valid token
        if (
          pathname.startsWith("/admin") ||
          pathname.startsWith("/organizer") ||
          pathname.startsWith("/peserta") ||
          pathname.includes("/data-form")
        ) {
          return !!token
        }

        // Public routes
        return true
      },
    },
  }
)

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
