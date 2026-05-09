import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

// One-time init endpoint to seed admin in production.
// Protect with ADMIN_INIT_SECRET env var. Call: GET /api/admin/init?secret=your-secret

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");

    const expected = process.env.ADMIN_INIT_SECRET;
    if (!expected || !secret || secret !== expected) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return NextResponse.json({ error: "ADMIN_EMAIL and ADMIN_PASSWORD must be set" }, { status: 500 });
    }

    const hashed = await bcrypt.hash(adminPassword, 10);

    const admin = await db.admin.upsert({
      where: { email: adminEmail },
      update: { password: hashed },
      create: { email: adminEmail, name: "Admin", password: hashed },
    });

    return NextResponse.json({ success: true, admin: { id: admin.id, email: admin.email } });
  } catch (err: any) {
    console.error("/api/admin/init error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}
