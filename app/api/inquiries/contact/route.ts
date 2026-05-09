import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactFormSchema } from "@/lib/validations";
import { formatValidationError, formatApiError } from "@/lib/error-messages";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validated = await contactFormSchema.parseAsync(data);

    const message = await db.contactMessage.create({
      data: {
        name: validated.name,
        email: validated.email,
        subject: validated.subject,
        message: validated.message,
      },
    });

    // TODO: Send email notification to admin

    return NextResponse.json(message, { status: 201 });
  } catch (error: any) {
    const message = formatApiError(error.message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
