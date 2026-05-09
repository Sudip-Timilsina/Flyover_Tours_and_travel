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
    const dest = await db.destination.findUnique({ where: { id: params.id } });
    if (!dest) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(dest);
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
    const existing = await db.destination.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const slug = data.name ? data.name.toLowerCase().replace(/\s+/g, "-") : existing.slug;
    
    let image;
    try {
      image = await persistImageReference(data.image, "destination");
    } catch (err: any) {
      return NextResponse.json(
        { error: err.message || "Failed to process image" },
        { status: 400 }
      );
    }

    const updated = await db.destination.update({
      where: { id: params.id },
      data: {
        name: data.name ?? existing.name,
        slug,
        description: data.description ?? existing.description,
        image,
      },
    });

    // revalidate listing and affected pages
    revalidatePath("/");
    revalidatePath("/destinations");
    revalidatePath(`/destinations/${updated.slug}`);
    if (existing.slug && existing.slug !== updated.slug) revalidatePath(`/destinations/${existing.slug}`);

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
    const existing = await db.destination.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await db.destination.delete({ where: { id: params.id } });

    revalidatePath("/");
    revalidatePath("/destinations");
    if (existing.slug) revalidatePath(`/destinations/${existing.slug}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
