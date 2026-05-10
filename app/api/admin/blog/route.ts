import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { persistImageReference } from "@/lib/image-storage";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const posts = await db.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, excerpt, content, published, image, seoTitle, seoDescription, keywords } = await request.json();
    const slug = title.toLowerCase().replace(/\s+/g, "-");
    
    let storedImage;
    try {
      storedImage = await persistImageReference(image, "blog");
    } catch (err: any) {
      return NextResponse.json(
        { error: err.message || "Failed to process image" },
        { status: 400 }
      );
    }

    const post = await db.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        image: storedImage,
        author: "Admin",
        seoTitle,
        seoDescription,
        keywords,
        published: published || false,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
