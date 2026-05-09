import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookingInquirySchema } from "@/lib/validations";
import { formatValidationError, formatApiError } from "@/lib/error-messages";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const parsed = await bookingInquirySchema.safeParseAsync(data);
    if (!parsed.success) {
      const message = formatValidationError(parsed.error);
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const validated = parsed.data;

    const inquiry = await db.bookingInquiry.create({
      data: {
        name: validated.name,
        email: validated.email,
        phone: validated.phone,
        tourId: validated.tourId,
        tourTitle: validated.tourTitle,
        message: validated.message,
        adults: validated.adults,
        children: validated.children,
        startDate: validated.startDate ? new Date(validated.startDate) : null,
      },
    });

    // TODO: Send email notification to admin

    return NextResponse.json(inquiry, { status: 201 });
  } catch (error: any) {
    const message = formatApiError(error.message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
