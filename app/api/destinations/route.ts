/**
 * API Routes for public destinations
 * GET /api/destinations - Get all destinations
 * GET /api/destinations/[slug] - Get specific destination
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const destinations = await db.destination.findMany({
      include: {
        tours: {
          where: { published: true },
        },
      },
    });

    return NextResponse.json(destinations);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
