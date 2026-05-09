import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { persistImageReference } from "@/lib/image-storage";

export async function GET() {
  try {
    const destinations = await db.destination.findMany();
    return NextResponse.json(destinations);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, image } = await request.json();
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    
    let storedImage;
    try {
      storedImage = await persistImageReference(image, "destination");
    } catch (err: any) {
      return NextResponse.json(
        { error: err.message || "Failed to process image" },
        { status: 400 }
      );
    }

    const destination = await db.destination.create({
      data: {
        name,
        slug,
        description,
        image: storedImage,
      },
    });

    return NextResponse.json(destination, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
