import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define which routes are public and which require authentication
const publicRoutes: string[] = ["/", "/login", "/register"]
const authRoutes: string[] = ["/login", "/register"]

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl

  // Check if user is authenticated by looking for the user item in localStorage
  // In a real app, you would check for a valid auth token in cookies
  const isAuthenticated: boolean = true

  // If the user is on an auth route but is already authenticated, redirect to dashboard
  if (isAuthenticated && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // If the user is not authenticated and not on a public route, redirect to login
  if (!isAuthenticated && !publicRoutes.includes(pathname) && !pathname.startsWith("/_next")) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
