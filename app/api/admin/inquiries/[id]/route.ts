import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();

    // Try to update booking inquiry first
    const bookingInquiry = await db.bookingInquiry.findUnique({
      where: { id: params.id },
    });

    if (bookingInquiry) {
      const updated = await db.bookingInquiry.update({
        where: { id: params.id },
        data: { status },
      });
      return NextResponse.json(updated);
    }

    // Try to update contact message
    const contactMessage = await db.contactMessage.findUnique({
      where: { id: params.id },
    });

    if (contactMessage) {
      const updated = await db.contactMessage.update({
        where: { id: params.id },
        data: { status },
      });
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Try to delete booking inquiry first
    const bookingInquiry = await db.bookingInquiry.findUnique({
      where: { id: params.id },
    });

    if (bookingInquiry) {
      await db.bookingInquiry.delete({
        where: { id: params.id },
      });
      return NextResponse.json({ success: true });
    }

    // Try to delete contact message
    const contactMessage = await db.contactMessage.findUnique({
      where: { id: params.id },
    });

    if (contactMessage) {
      await db.contactMessage.delete({
        where: { id: params.id },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
