import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createTourSchema } from "@/lib/validations";
import { createSlug } from "@/utils/helpers";
import { persistImageReference } from "@/lib/image-storage";

export async function GET() {
  try {
    const tours = await db.tour.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(tours);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validated = await createTourSchema.parseAsync(data);

    const inclusions = validated.inclusions
      ? validated.inclusions.split(",").map((i) => i.trim())
      : [];
    const exclusions = validated.exclusions
      ? validated.exclusions.split(",").map((i) => i.trim())
      : [];
    
    let image;
    try {
      image = await persistImageReference(validated.image, "tour");
    } catch (err: any) {
      return NextResponse.json(
        { error: err.message || "Failed to process image" },
        { status: 400 }
      );
    }

    const tour = await db.tour.create({
      data: {
        title: validated.title,
        slug: createSlug(validated.title),
        description: validated.description,
        overview: validated.overview,
        price: validated.price,
        duration: validated.duration,
        groupSize: validated.groupSize,
        difficulty: validated.difficulty,
        category: validated.category,
        bestSeason: validated.bestSeason,
        image,
        inclusions,
        exclusions,
        seoTitle: validated.seoTitle,
        seoDescription: validated.seoDescription,
        keywords: validated.keywords,
        destinationId: validated.destinationId || null,
        published: validated.published || false,
      },
    });

    return NextResponse.json(tour, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
