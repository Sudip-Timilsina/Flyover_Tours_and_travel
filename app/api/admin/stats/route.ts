import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [tours, destinations, inquiries, blogPosts] = await Promise.all([
      db.tour.count(),
      db.destination.count(),
      db.bookingInquiry.count(),
      db.blogPost.count(),
    ]);

    return NextResponse.json({
      totalTours: tours,
      totalDestinations: destinations,
      totalInquiries: inquiries,
      totalBlogPosts: blogPosts,
    });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
