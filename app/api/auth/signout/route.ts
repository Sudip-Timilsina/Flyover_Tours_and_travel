import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // Sign out by clearing cookie and redirecting to login page
  const baseUrl = new URL(request.url).origin;
  const response = NextResponse.redirect(new URL("/admin/login", baseUrl), {
    status: 302,
  });
  response.cookies.set("auth", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
