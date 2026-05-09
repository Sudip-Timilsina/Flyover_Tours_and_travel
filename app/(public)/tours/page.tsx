import { db } from "@/lib/db";
import { generateSEOMetadata } from "@/lib/seo";
import { TourCard } from "@/components/public/TourCard";
import Link from "next/link";
import { cache } from "react";
import { Compass, Sparkles } from "lucide-react";

export const dynamic = 'force-dynamic';

export const metadata = generateSEOMetadata({
  title: "Tour Packages in Nepal",
  description: "Explore all available tour packages in Nepal. Trekking, cultural tours, adventure packages, and more.",
  keywords: "Flyover Car Rental, Pokhara car rental, Nepal car hire",
});

export const revalidate = 60;

const getTours = cache(async function getTours() {
  try {
    return await db.tour.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      include: { destination: true },
    });
  } catch (error) {
    console.error("Error fetching tours:", error);
    return [];
  }
});

export default async function ToursPage() {
  const tours = await getTours();

  return (
    <div className="page-shell">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900 to-slate-950" />
        <div className="container-max relative z-10 py-20 md:py-28">
          <div className="max-w-3xl space-y-5">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-md">
              <Compass className="h-4 w-4 text-accent-300" /> Signature journeys
            </p>
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">Tour packages curated for elevated Nepal travel.</h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-200 md:text-xl">
              Discover amazing travel experiences across Nepal with premium service, flexible itineraries, and handpicked accommodations.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn-primary">
                Book a consultation <Sparkles className="h-4 w-4" />
              </Link>
              <Link href="/destinations" className="btn-secondary">
                Explore destinations
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="section-padding">
        <div className="container-max space-y-8">
          {tours.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {tours.map((tour, index) => (
                <TourCard
                  key={tour.id}
                  id={tour.id}
                  title={tour.title}
                  slug={tour.slug}
                  image={tour.image || tour.destination?.image || null}
                  price={tour.price.toString()}
                  duration={tour.duration}
                  destination={tour.destination?.name}
                  difficulty={tour.difficulty}
                  category={tour.category}
                  badge={index === 0 ? "Popular" : index % 3 === 0 ? "Best Seller" : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="glass-card p-8 text-center text-slate-500">
              <p>No tours available at the moment</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
