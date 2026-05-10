export { default } from "next-auth/middleware"

export const config = {
  // Only protect admin and dashboard routes. Make everything else public.
  matcher: ["/admin/:path*", "/dashboard/:path*"]
}
