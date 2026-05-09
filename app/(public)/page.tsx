import { db } from "@/lib/db";
import { generateStructuredData } from "@/lib/seo";
import { TourCard } from "@/components/public/TourCard";
import Link from "next/link";
import { cache } from "react";
import { ArrowRight, Award, Compass, MapPinned, ShieldCheck, Sparkles } from "lucide-react";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = 'force-dynamic';

const getHomepageData = cache(async function getHomepageData() {
  try {
    const [tours, destinations] = await Promise.all([
      db.tour.findMany({
        where: { published: true },
        take: 6,
        orderBy: { createdAt: "desc" },
        include: { destination: true },
      }),
      db.destination.findMany({
        take: 6,
      }),
    ]);

    return { tours, destinations };
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    return { tours: [], destinations: [] };
  }
});

export default async function HomePage() {
  const [settings, { tours, destinations }] = await Promise.all([
    getSiteSettings(),
    getHomepageData(),
  ]);

  const organizationSchema = generateStructuredData("Organization", {});

  return (
    <div className="page-shell">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        {settings.heroImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-35"
            style={{ backgroundImage: `url(${settings.heroImage})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-950/95 via-primary-900/88 to-slate-950/96" />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(244,162,97,0.22),transparent_25%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.05)_0%,transparent_22%,transparent_78%,rgba(255,255,255,0.03)_100%)] opacity-60" />

        <div className="container-max relative z-10 flex min-h-[82vh] items-center py-20">
          <div className="max-w-3xl space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-accent-300" />
              {settings.heroEyebrow}
            </div>

            <div className="space-y-5">
              <h1 className="text-5xl font-black tracking-tight md:text-7xl">
                {settings.heroTitle}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-200 md:text-2xl md:leading-9">
                {settings.heroSubtitle}
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href={settings.heroPrimaryCtaHref} className="btn-primary">
                {settings.heroPrimaryCtaLabel} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href={settings.heroSecondaryCtaHref} className="btn-secondary">
                {settings.heroSecondaryCtaLabel}
              </Link>
            </div>

            <div className="grid gap-4 pt-4 sm:grid-cols-3">
              {[
                { value: "50+", label: "Curated experiences" },
                { value: "24/7", label: "Concierge support" },
                { value: "98%", label: "Guest satisfaction" },
              ].map((item) => (
                <div key={item.label} className="glass-card px-5 py-4 text-white/95 backdrop-blur-md">
                  <p className="text-3xl font-black text-accent-500">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.label}</p>
                </div>
              ))}
              </div>
          </div>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section className="section-padding">
        <div className="container-max space-y-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700">
                <Compass className="h-4 w-4" /> Featured journeys
              </p>
              <h2 className="text-3xl font-black tracking-tight md:text-5xl">Handpicked tour packages designed for unforgettable travel.</h2>
              <p className="text-slate-600 md:text-lg">
                Premium itineraries balancing comfort, adventure, and local expertise.
              </p>
            </div>
            <Link href="/tours" className="btn-secondary w-fit">
              Explore all tours
            </Link>
          </div>

          {tours.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {tours.map((tour, index) => (
                <TourCard
                  key={tour.id}
                  id={tour.id}
                  title={tour.title}
                  slug={tour.slug}
                  image={tour.image}
                  price={tour.price.toString()}
                  duration={tour.duration}
                  destination={tour.destination?.name}
                  difficulty={tour.difficulty}
                  category={tour.category}
                  badge={index === 0 ? "Popular" : index === 1 ? "Best Seller" : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="glass-card p-8 text-center text-slate-500">No tours available</div>
          )}
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="section-padding bg-slate-100/80">
        <div className="container-max space-y-10">
          <div className="max-w-2xl space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary-700 shadow-soft">
              <MapPinned className="h-4 w-4" /> Destinations
            </p>
            <h2 className="text-3xl font-black tracking-tight md:text-5xl">Discover Nepal&apos;s most sought-after destinations.</h2>
            <p className="text-slate-600 md:text-lg">From iconic trekking hubs to cultural capitals, each location is curated for premium travel experiences.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {destinations.map((dest) => (
              <div
                key={dest.id}
                className="glass-card overflow-hidden"
              >
                <div className="relative flex aspect-[4/3] items-end overflow-hidden bg-gradient-to-br from-primary-700 via-primary-800 to-slate-950 p-6 text-white">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,162,97,0.22),transparent_35%)]" />
                  <div className="relative z-10">
                    <p className="text-xs uppercase tracking-[0.25em] text-accent-200">Destination</p>
                    <h3 className="mt-2 text-3xl font-black tracking-tight">{dest.name}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {dest.description}
                  </p>
                  <Link href={`/destinations/${dest.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition hover:text-accent-500">
                    Explore destination <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding">
        <div className="container-max space-y-10">
          <div className="text-center space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700">
              <Award className="h-4 w-4" /> Why choose us
            </p>
            <h2 className="text-3xl font-black tracking-tight md:text-5xl">Designed like a premium agency, delivered with local expertise.</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Compass,
                title: "Expert guides",
                description: "Experienced local specialists ensure safety, culture, and flawless logistics.",
              },
              {
                icon: ShieldCheck,
                title: "Seamless service",
                description: "From planning to arrival, every touchpoint feels polished and personal.",
              },
              {
                icon: Sparkles,
                title: "Premium journeys",
                description: "Carefully curated itineraries that balance comfort, adventure, and value.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="glass-card p-8 text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-soft">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-max">
          <div className="glass-card overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-accent-500 px-8 py-12 text-white shadow-glow md:px-12 md:py-16">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div className="space-y-4">
                <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-md">
                  <Sparkles className="h-4 w-4" /> Ready to plan your next journey?
                </p>
                <h2 className="text-3xl font-black tracking-tight md:text-5xl">
            Ready for Your Nepal Adventure?
                </h2>
                <p className="max-w-2xl text-base leading-7 text-white/85 md:text-lg">
                  Start planning your trip today. Choose from dozens of carefully curated packages and travel with confidence.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
                <Link href="/tours" className="rounded-2xl bg-white px-6 py-3 font-semibold text-primary-700 shadow-soft transition hover:-translate-y-0.5">
                  Browse all tours
                </Link>
                <Link href="/contact" className="rounded-2xl border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-md transition hover:bg-white/20">
                  Talk to an expert
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
