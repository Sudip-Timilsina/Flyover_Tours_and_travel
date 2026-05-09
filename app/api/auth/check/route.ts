import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const authCookie = (await cookies()).get("auth");

  return NextResponse.json({ authenticated: Boolean(authCookie?.value) });
}

export async function POST() {
  return NextResponse.json({ success: true });
}
