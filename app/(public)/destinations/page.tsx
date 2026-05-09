import { db } from "@/lib/db";
import { generateSEOMetadata } from "@/lib/seo";
import Link from "next/link";
import { cache } from "react";
import { ArrowRight, Compass, MapPinned } from "lucide-react";

export const metadata = generateSEOMetadata({
  title: "Destinations in Nepal",
  description: "Explore popular destinations in Nepal",
});

export const revalidate = 60;

const getDestinations = cache(async function getDestinations() {
  try {
    return await db.destination.findMany();
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return [];
  }
});

export default async function DestinationsPage() {
  const destinations = await getDestinations();

  return (
    <div className="page-shell">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,162,97,0.18),transparent_26%)]" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900 to-slate-950" />
        <div className="container-max relative z-10 py-20 md:py-28">
          <div className="max-w-3xl space-y-5">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-md">
              <MapPinned className="h-4 w-4 text-accent-300" /> Must-visit destinations
            </p>
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">Discover Nepal&apos;s most inspiring destinations.</h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-200 md:text-xl">
              From Everest gateways to serene heritage cities, every destination is presented with a premium travel lens.
            </p>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {destinations.map((dest) => (
              <Link
                key={dest.id}
                href={`/destinations/${dest.slug}`}
                className="glass-card group overflow-hidden"
              >
                <div className="relative flex aspect-[4/3] items-end overflow-hidden bg-gradient-to-br from-primary-700 via-primary-800 to-slate-950 p-6 text-white">
                  {dest.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,162,97,0.22),transparent_35%)]" />
                  <div className="relative z-10">
                    <p className="text-xs uppercase tracking-[0.25em] text-accent-200">Explore</p>
                    <h2 className="mt-2 text-3xl font-black tracking-tight">{dest.name}</h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-700">
                    <Compass className="h-3.5 w-3.5" /> Explore
                  </div>
                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
                    {dest.description}
                  </p>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition group-hover:text-accent-500">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
