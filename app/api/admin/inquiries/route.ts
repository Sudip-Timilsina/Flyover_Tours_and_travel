import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [bookingInquiries, contactMessages] = await Promise.all([
      db.bookingInquiry.findMany({
        orderBy: { createdAt: "desc" },
      }),
      db.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
      }),
    ]);
    
    // Combine and return both types
    const combined = [
      ...bookingInquiries.map((inquiry) => ({
        ...inquiry,
        type: "booking",
        subject: inquiry.tourTitle || "Tour Inquiry",
      })),
      ...contactMessages.map((msg) => ({
        ...msg,
        type: "contact",
        phone: undefined,
        tourTitle: undefined,
        status: msg.status || "unread",
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return NextResponse.json(combined);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
