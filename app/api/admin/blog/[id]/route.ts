import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { persistImageReference } from "@/lib/image-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const post = await db.blogPost.findUnique({ where: { id: params.id } });
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const existing = await db.blogPost.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const slug = data.title ? data.title.toLowerCase().replace(/\s+/g, "-") : existing.slug;
    
    let image;
    try {
      image = await persistImageReference(data.image, "blog");
    } catch (err: any) {
      return NextResponse.json(
        { error: err.message || "Failed to process image" },
        { status: 400 }
      );
    }

    const updated = await db.blogPost.update({
      where: { id: params.id },
      data: {
        title: data.title ?? existing.title,
        slug,
        excerpt: data.excerpt ?? existing.excerpt,
        content: data.content ?? existing.content,
        image,
        published: typeof data.published === "boolean" ? data.published : existing.published,
        seoTitle: data.seoTitle ?? existing.seoTitle,
        seoDescription: data.seoDescription ?? existing.seoDescription,
        keywords: data.keywords ?? existing.keywords,
      },
    });

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${updated.slug}`);
    if (existing.slug && existing.slug !== updated.slug) revalidatePath(`/blog/${existing.slug}`);

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Server error" }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const existing = await db.blogPost.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await db.blogPost.delete({ where: { id: params.id } });

    revalidatePath("/");
    revalidatePath("/blog");
    if (existing.slug) revalidatePath(`/blog/${existing.slug}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
