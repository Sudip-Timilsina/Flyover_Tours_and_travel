/**
 * API Route for public tours listing
 * GET /api/tours - Get all published tours
 * GET /api/tours?category=Trekking - Filter by category
 * GET /api/tours?destination=Pokhara - Filter by destination
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const destination = searchParams.get("destination");
    const limit = parseInt(searchParams.get("limit") || "12");

    const where: any = { published: true };

    if (category) {
      where.category = category;
    }

    if (destination) {
      where.destination = {
        slug: destination,
      };
    }

    const tours = await db.tour.findMany({
      where,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        destination: true,
      },
    });

    return NextResponse.json(tours);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
