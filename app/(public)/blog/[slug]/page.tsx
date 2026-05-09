import { db } from "@/lib/db";
import { generateSEOMetadata } from "@/lib/seo";
import Image from "next/image";
import { notFound } from "next/navigation";

interface Params {
  params: { slug: string };
}

async function getBlogPost(slug: string) {
  try {
    return await db.blogPost.findUnique({
      where: { slug },
    });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Params) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    return generateSEOMetadata({
      title: "Blog Post Not Found",
    });
  }

  return generateSEOMetadata({
    title: post.title,
    description: post.excerpt,
    url: `/blog/${post.slug}`,
  });
}

export default async function BlogPostPage({ params }: Params) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div>
      {/* Hero */}
      {post.image && (
        <section className="relative h-96 overflow-hidden md:h-[500px] bg-gray-200">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent flex items-end">
            <div className="container-max pb-8 text-white">
              <h1 className="text-4xl font-black tracking-tight md:text-6xl">{post.title}</h1>
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="section-padding">
        <div className="container-max max-w-3xl">
          <div className="text-sm text-gray-500 mb-6">
            {new Date(post.createdAt).toLocaleDateString('en-NP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })} • By {post.author}
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {post.content}
            </div>
          </div>

          {post.keywords && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>Tags:</strong> {post.keywords}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
