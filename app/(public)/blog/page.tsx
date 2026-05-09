import { db } from "@/lib/db";
import { generateSEOMetadata } from "@/lib/seo";
import Image from "next/image";

export const dynamic = 'force-dynamic';

export const metadata = generateSEOMetadata({
  title: "Travel Blog - Flyover Car Rental Tips",
  description: "Read our latest blog posts about Nepal travel, trekking guides, and tourism tips",
});

async function getBlogPosts() {
  try {
    return await db.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-nepal-600 to-nepal-700 text-white py-20">
        <div className="container-max text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Travel Blog</h1>
          <p className="text-lg opacity-90">Nepal travel guides, tips, and inspiration</p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="section-padding">
        <div className="container-max max-w-3xl">
          {posts.length > 0 ? (
            <div className="space-y-8">
              {posts.map((post) => (
                <a
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group"
                >
                  <div className="md:flex">
                    {post.image && (
                      <div className="relative md:w-1/3 h-48 md:h-auto bg-gray-200 overflow-hidden">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-300"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="p-6 md:w-2/3 flex flex-col justify-between">
                      <div>
                        <p className="text-sm text-nepal-600 font-semibold mb-2">
                          {new Date(post.createdAt).toLocaleDateString('en-NP', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        <h2 className="text-2xl font-bold mb-3 group-hover:text-nepal-600 transition">
                          {post.title}
                        </h2>
                        <p className="text-gray-600 mb-4">{post.excerpt}</p>
                      </div>
                      <div className="text-nepal-600 font-semibold">
                        Read More →
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <p>No blog posts available</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
