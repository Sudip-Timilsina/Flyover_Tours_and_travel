import { db } from "@/lib/db";
import { SITE_CONFIG } from "@/lib/constants";
import { generateSEOMetadata, generateStructuredData } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TourBookingForm } from "@/components/public/TourBookingForm";

interface Params {
  params: { slug: string };
}

async function getTour(slug: string) {
  try {
    return await db.tour.findUnique({
      where: { slug },
      include: {
        itineraries: { orderBy: { day: "asc" } },
        faqs: true,
        images: { orderBy: { order: "asc" } },
        destination: true,
      },
    });
  } catch (error) {
    console.error("Error fetching tour:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Params) {
  const tour = await getTour(params.slug);

  if (!tour) {
    return generateSEOMetadata({
      title: "Tour Not Found",
    });
  }

  return generateSEOMetadata({
    title: tour.seoTitle || tour.title,
    description: tour.seoDescription || tour.description,
    url: `/tours/${tour.slug}`,
  });
}

export default async function TourDetailPage({ params }: Params) {
  const tour = await getTour(params.slug);

  if (!tour) {
    notFound();
  }

  const displayImage = tour.image || tour.destination?.image || null;
  const whatsappLink = `https://wa.me/${SITE_CONFIG.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
    `I'm interested in ${tour.title}`
  )}`;

  const tourSchema = generateStructuredData("Tour", {
    title: tour.title,
    slug: tour.slug,
    description: tour.description,
    price: tour.price,
    duration: tour.duration,
    image: displayImage,
  });

  return (
    <div>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tourSchema) }}
      />

      <section className="border-b border-slate-100 bg-white">
        <div className="container-max py-3 text-sm text-slate-500">
          <Link href="/tours" className="hover:text-slate-700">Tours</Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-slate-700">{tour.title}</span>
        </div>
      </section>

      {/* Hero */}
      <section className="relative h-[360px] overflow-hidden md:h-[520px] bg-gradient-to-b from-slate-300 to-slate-700">
        {displayImage && (
          <Image
            src={displayImage}
            alt={tour.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/35 to-transparent flex items-end">
          <div className="container-max pb-8 text-white">
            <p className="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur">{tour.category}</p>
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">{tour.title}</h1>
            <p className="mt-3 max-w-2xl text-sm md:text-base text-slate-100/95">{tour.description}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Overview */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Overview</h2>
                <p className="text-gray-600 leading-relaxed">{tour.overview}</p>
              </div>

              {/* Quick Facts */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-nepal-50 p-4 rounded-xl border border-nepal-100">
                  <div className="text-2xl mb-2">📅</div>
                  <p className="text-xs uppercase tracking-wide text-nepal-700 mb-1">Duration</p>
                  <p className="text-sm font-semibold">{tour.duration} days</p>
                </div>
                <div className="bg-nepal-50 p-4 rounded-xl border border-nepal-100">
                  <div className="text-2xl mb-2">⛰️</div>
                  <p className="text-xs uppercase tracking-wide text-nepal-700 mb-1">Difficulty</p>
                  <p className="text-sm font-semibold">{tour.difficulty}</p>
                </div>
                <div className="bg-nepal-50 p-4 rounded-xl border border-nepal-100">
                  <div className="text-2xl mb-2">👥</div>
                  <p className="text-xs uppercase tracking-wide text-nepal-700 mb-1">Group</p>
                  <p className="text-sm font-semibold">{tour.groupSize}</p>
                </div>
                <div className="bg-nepal-50 p-4 rounded-xl border border-nepal-100">
                  <div className="text-2xl mb-2">🌍</div>
                  <p className="text-xs uppercase tracking-wide text-nepal-700 mb-1">Best Season</p>
                  <p className="text-sm font-semibold">{tour.bestSeason}</p>
                </div>
              </div>

              {/* Itinerary */}
              {tour.itineraries && tour.itineraries.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Itinerary</h2>
                  <div className="space-y-4">
                    {tour.itineraries.map((item) => (
                      <div key={item.id} className="border-l-4 border-nepal-600 pl-4 py-1">
                        <h3 className="font-bold text-lg">
                          Day {item.day}: {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                        {item.accommodation && (
                          <p className="text-sm text-gray-500 mt-2">
                            🏨 {item.accommodation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-5">
                  <h3 className="text-xl font-bold mb-4">✓ Included</h3>
                  <ul className="space-y-2 text-gray-600">
                    {tour.inclusions?.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-rose-100 bg-rose-50/40 p-5">
                  <h3 className="text-xl font-bold mb-4">✗ Excluded</h3>
                  <ul className="space-y-2 text-gray-600">
                    {tour.exclusions?.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-red-500 mr-2">✗</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* FAQs */}
              {tour.faqs && tour.faqs.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">FAQs</h2>
                  <div className="space-y-4">
                    {tour.faqs.map((faq) => (
                      <details key={faq.id} className="border border-gray-200 rounded-lg p-4">
                        <summary className="font-semibold cursor-pointer">
                          {faq.question}
                        </summary>
                        <p className="text-gray-600 mt-3">{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Booking Card */}
              <div className="bg-nepal-50 rounded-xl p-6 sticky top-24 border border-nepal-100 shadow-sm">
                <h3 className="text-2xl font-bold text-nepal-600 mb-2">
                  NPR {Number(tour.price).toLocaleString()}
                </h3>
                <p className="text-sm text-gray-600 mb-4">per person</p>

                <a
                  href={`/tours/${tour.slug}#booking`}
                  className="btn-primary mb-3 w-full"
                >
                  Book Now
                </a>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full bg-emerald-500 text-white hover:bg-emerald-600"
                >
                  WhatsApp Inquiry
                </a>

                <p className="mt-4 text-xs text-slate-500">Fast response from our Nepal travel team</p>

                {tour.destination && (
                  <div className="mt-6 pt-6 border-t border-nepal-200">
                    <p className="text-sm text-gray-600">📍 {tour.destination.name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section id="booking" className="section-padding bg-gray-50">
        <div className="container-max max-w-2xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Book This Tour</h2>
          <TourBookingForm tourId={tour.id} tourTitle={tour.title} />
        </div>
      </section>
    </div>
  );
}
