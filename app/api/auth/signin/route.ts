import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/validations";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { email, password } = await loginSchema.parseAsync(await request.json());

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return NextResponse.json({ error: "Admin credentials are not configured" }, { status: 500 });
    }

    if (email !== adminEmail) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isPasswordValid = adminPassword.startsWith("$2")
      ? await bcrypt.compare(password, adminPassword)
      : password === adminPassword;

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const response = NextResponse.json({
      success: true,
      admin: { id: adminEmail, email: adminEmail },
    });

    response.cookies.set("auth", adminEmail, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
