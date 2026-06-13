import { db } from "@/lib/db";
import { generateSEOMetadata } from "@/lib/seo";
import Link from "next/link";
import { cache } from "react";
import { ArrowRight, Compass, MapPinned } from "lucide-react";

export const dynamic = 'force-dynamic';

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
                className="group block h-full"
              >
                <article className="relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white shadow-[0_18px_50px_-30px_rgba(15,23,42,0.35)] transition-all duration-300 group-hover:-translate-y-2 group-hover:border-primary-200 group-hover:shadow-[0_26px_70px_-28px_rgba(15,23,42,0.5)] dark:border-slate-800 dark:bg-slate-950">
                  <div className="relative overflow-hidden">
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-200">
                      {dest.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={dest.image}
                          alt={dest.name}
                          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary-700 via-primary-800 to-slate-950 text-white">
                          <MapPinned className="h-10 w-10 opacity-80" />
                        </div>
                      )}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/55 to-transparent" />

                    <div className="absolute left-4 right-4 top-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-accent-500 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-white shadow-lg shadow-accent-500/25">
                        Destination
                      </span>
                      <span className="rounded-full border border-white/20 bg-white/12 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                        Explore
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <p className="text-xs uppercase tracking-[0.25em] text-accent-200">Destination</p>
                      <h2 className="mt-2 text-3xl font-black tracking-tight transition group-hover:text-accent-200">{dest.name}</h2>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-5 p-6">
                    <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-700 dark:bg-slate-900 dark:text-primary-300">
                      <Compass className="h-3.5 w-3.5" /> Explore
                    </div>
                    <p className="line-clamp-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {dest.description}
                    </p>
                    <div className="mt-auto flex items-end justify-between border-t border-slate-200/80 pt-5 dark:border-slate-800">
                      <div>
                        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-slate-500 dark:text-slate-400">View destination</p>
                        <span className="mt-1 block text-2xl font-black tracking-tight text-primary-700 dark:text-primary-300">
                          {dest.name}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition group-hover:bg-primary-600 dark:bg-white dark:text-slate-950">
                        Open <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
