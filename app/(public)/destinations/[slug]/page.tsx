import { db } from "@/lib/db";
import { generateSEOMetadata } from "@/lib/seo";
import Image from "next/image";
import { notFound } from "next/navigation";

interface Params {
  params: { slug: string };
}

export const dynamic = 'force-dynamic';

async function getDestination(slug: string) {
  try {
    return await db.destination.findUnique({
      where: { slug },
      include: {
        tours: { where: { published: true } },
      },
    });
  } catch (error) {
    console.error("Error fetching destination:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Params) {
  const destination = await getDestination(params.slug);

  if (!destination) {
    return generateSEOMetadata({
      title: "Destination Not Found",
    });
  }

  return generateSEOMetadata({
    title: `${destination.name} - Flyover Car Rental`,
    description: destination.description,
    url: `/destinations/${destination.slug}`,
  });
}

export default async function DestinationDetailPage({ params }: Params) {
  const destination = await getDestination(params.slug);

  if (!destination) {
    notFound();
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative h-96 overflow-hidden md:h-[500px] bg-gray-200">
        {destination.image && (
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent flex items-end">
          <div className="container-max pb-8 text-white">
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">{destination.name}</h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-max max-w-3xl">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 leading-relaxed">{destination.description}</p>
          </div>
        </div>
      </section>

      {/* Related Tours */}
      {destination.tours && destination.tours.length > 0 && (
        <section className="section-padding bg-gray-50">
          <div className="container-max">
            <h2 className="text-3xl font-bold mb-8">Tours to {destination.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destination.tours.map((tour) => (
                <a
                  key={tour.id}
                  href={`/tours/${tour.slug}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group"
                >
                  {tour.image && (
                    <div className="relative h-48 overflow-hidden bg-gray-200">
                      <Image
                        src={tour.image}
                        alt={tour.title}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-lg group-hover:text-nepal-600 transition">
                      {tour.title}
                    </h3>
                    <div className="flex justify-between items-center mt-4 text-sm">
                      <span className="text-gray-600">{tour.duration} days</span>
                      <span className="text-nepal-600 font-bold">
                        NPR {Number(tour.price).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
