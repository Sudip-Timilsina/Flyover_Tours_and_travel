import { db } from "../lib/db.js";
import { SITE_CONFIG } from "../lib/constants.js";
import { createSlug } from "../utils/helpers.js";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set before running the seed script.");
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  const admin = await db.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Flyover Car Rental Admin",
      password: hashedPassword,
    },
  });
  console.log("✅ Admin created:", admin.email);

  await db.siteSettings.upsert({
    where: { id: "singleton" },
    update: {
      siteName: SITE_CONFIG.name,
      siteDescription: SITE_CONFIG.description,
      siteUrl: SITE_CONFIG.url,
      contactEmail: SITE_CONFIG.email,
      contactPhone: SITE_CONFIG.phone,
      address: SITE_CONFIG.address,
      logoText: SITE_CONFIG.name,
      heroEyebrow: "Premium Himalayan travel experiences",
      heroTitle: "Explore Nepal with a luxury travel mindset.",
      heroSubtitle:
        "Discover authentic experiences, breathtaking landscapes, and unforgettable adventures crafted like a high-end travel agency.",
      heroImage: "",
      heroPrimaryCtaLabel: "View Tours",
      heroPrimaryCtaHref: "/tours",
      heroSecondaryCtaLabel: "Book Now",
      heroSecondaryCtaHref: "/contact",
    },
    create: {
      id: "singleton",
      siteName: SITE_CONFIG.name,
      siteDescription: SITE_CONFIG.description,
      siteUrl: SITE_CONFIG.url,
      contactEmail: SITE_CONFIG.email,
      contactPhone: SITE_CONFIG.phone,
      address: SITE_CONFIG.address,
      logoText: SITE_CONFIG.name,
      heroEyebrow: "Premium Himalayan travel experiences",
      heroTitle: "Explore Nepal with a luxury travel mindset.",
      heroSubtitle:
        "Discover authentic experiences, breathtaking landscapes, and unforgettable adventures crafted like a high-end travel agency.",
      heroImage: "",
      heroPrimaryCtaLabel: "View Tours",
      heroPrimaryCtaHref: "/tours",
      heroSecondaryCtaLabel: "Book Now",
      heroSecondaryCtaHref: "/contact",
    },
  });
  console.log("✅ Site settings created");

  // Create destinations
  const destinations = await Promise.all(
    [
      {
        name: "Kathmandu",
        description:
          "The capital city of Nepal, rich in culture, history, and ancient temples. Explore Durbar Square, Swayambhunath, and Boudhanath Stupa.",
      },
      {
        name: "Pokhara",
        description:
          "A beautiful lakeside city known for adventure sports, trekking, and stunning views of the Annapurna range.",
      },
      {
        name: "Chitwan",
        description:
          "Home to the Royal Chitwan National Park, a UNESCO World Heritage Site famous for wildlife safari and jungle adventure.",
      },
      {
        name: "Everest",
        description:
          "The world's highest peak offers challenging trekking routes with breathtaking mountain scenery and unique Sherpa culture.",
      },
      {
        name: "Annapurna",
        description:
          "Known for some of the most spectacular trekking routes in the world, offering diverse landscapes and cultural experiences.",
      },
      {
        name: "Lumbini",
        description:
          "The birthplace of Lord Buddha, Lumbini is a sacred pilgrimage site and UNESCO World Heritage Site.",
      },
    ].map((dest) =>
      db.destination.upsert({
        where: { slug: createSlug(dest.name) },
        update: {
          description: dest.description,
          image: null,
        },
        create: {
          name: dest.name,
          slug: createSlug(dest.name),
          description: dest.description,
          image: null,
        },
      })
    )
  );
  console.log(`✅ Created ${destinations.length} destinations`);

  // Create sample tours
  const tours = [
    {
      title: "Everest Base Camp Trek",
      description: "Trek to the base camp of the world's highest peak",
      overview:
        "The Everest Base Camp Trek is one of the world's most famous trekking routes. This challenging trek takes you through Sherpa villages, ancient monasteries, and high mountain passes to reach the base camp of Mount Everest at 5,364 meters.",
      price: 1200,
      duration: 14,
      groupSize: "4-8 people",
      difficulty: "Hard",
      category: "Trekking",
      bestSeason: "September-October, March-May",
      destination: "Everest",
      inclusions: [
        "Accommodation",
        "All meals",
        "Guide and porter",
        "Transport",
      ],
      exclusions: ["Travel insurance", "Personal expenses"],
    },
    {
      title: "Annapurna Circuit Trek",
      description: "One of the most beautiful trekking routes in the world",
      overview:
        "The Annapurna Circuit is a 160-km trek that provides diverse landscapes, cultures, and ecosystems. It passes through forests, grasslands, and high mountain ranges with stunning views of snow-capped peaks.",
      price: 1400,
      duration: 17,
      groupSize: "5-10 people",
      difficulty: "Hard",
      category: "Trekking",
      bestSeason: "October-November, March-April",
      destination: "Annapurna",
      inclusions: [
        "Accommodation",
        "All meals",
        "Experienced guide",
        "Porter service",
      ],
      exclusions: ["International flights", "Travel insurance"],
    },
    {
      title: "Kathmandu Valley Cultural Tour",
      description: "Explore ancient temples and rich cultural heritage",
      overview:
        "Experience the rich cultural heritage of Nepal's capital city. Visit ancient temples, UNESCO World Heritage Sites, and explore local markets and traditions.",
      price: 350,
      duration: 3,
      groupSize: "2-15 people",
      difficulty: "Easy",
      category: "Cultural",
      bestSeason: "Year-round",
      destination: "Kathmandu",
      inclusions: ["Hotel accommodation", "Breakfast", "Guide", "Transport"],
      exclusions: ["Lunch and dinner", "Entrances to museums"],
    },
    {
      title: "Pokhara Adventure Package",
      description: "Paragliding, zip-lining, and lakeside relaxation",
      overview:
        "An action-packed adventure package in Pokhara featuring paragliding with stunning mountain views, zip-lining through forests, and relaxation by the beautiful Phewa Lake.",
      price: 600,
      duration: 4,
      groupSize: "2-10 people",
      difficulty: "Moderate",
      category: "Adventure",
      bestSeason: "March-November",
      destination: "Pokhara",
      inclusions: [
        "Hotel accommodation",
        "All adventure activities",
        "Guide",
        "Some meals",
      ],
      exclusions: ["Travel insurance", "Additional drinks and snacks"],
    },
    {
      title: "Chitwan National Park Safari",
      description: "Wildlife safari and jungle adventure",
      overview:
        "Experience wildlife in its natural habitat. The Chitwan National Park Safari offers jungle walks, jeep safaris, and opportunities to see rhinos, tigers, and various bird species.",
      price: 450,
      duration: 3,
      groupSize: "4-12 people",
      difficulty: "Easy",
      category: "Jungle Safari",
      bestSeason: "November-March",
      destination: "Chitwan",
      inclusions: [
        "Safari activities",
        "Hotel stay",
        "All meals",
        "Guide",
        "Transport",
      ],
      exclusions: ["Activity permits", "Photography rights"],
    },
    {
      title: "Lumbini Pilgrimage Tour",
      description: "Visit the birthplace of Buddha",
      overview:
        "A spiritual journey to Lumbini, the birthplace of Lord Buddha. Visit ancient temples, meditation centers, and experience the peaceful spiritual atmosphere.",
      price: 300,
      duration: 2,
      groupSize: "2-20 people",
      difficulty: "Easy",
      category: "Pilgrimage",
      bestSeason: "Year-round",
      destination: "Lumbini",
      inclusions: ["Hotel accommodation", "Meals", "Guide", "Transport"],
      exclusions: ["Donation to temples"],
    },
    {
      title: "Himalayan Honeymoon Package",
      description: "Romantic mountain getaway for couples",
      overview:
        "Create unforgettable memories with your loved one. This romantic package combines mountain scenery, adventure, and relaxation.",
      price: 1800,
      duration: 7,
      groupSize: "Couples only",
      difficulty: "Moderate",
      category: "Honeymoon",
      bestSeason: "October-November, March-April",
      destination: "Pokhara",
      inclusions: [
        "Romantic hotel stays",
        "Breakfast",
        "Adventure activities",
        "Couples massages",
      ],
      exclusions: ["Extra romantic activities", "Shopping"],
    },
    {
      title: "Kathmandu to Pokhara Road Trip",
      description: "Experience the best of central Nepal",
      overview:
        "Travel from Kathmandu to Pokhara, experiencing diverse landscapes, cultures, and attractions along the way.",
      price: 500,
      duration: 5,
      groupSize: "3-12 people",
      difficulty: "Easy",
      category: "City",
      bestSeason: "Year-round",
      destination: "Kathmandu",
      inclusions: [
        "Transport",
        "Accommodation",
        "Breakfast",
        "Guide",
        "Some sightseeing",
      ],
      exclusions: ["Lunch and dinner"],
    },
  ];

  for (const tour of tours) {
    const destination = destinations.find(
      (d) => d.name === tour.destination
    );
    await db.tour.upsert({
      where: { slug: createSlug(tour.title) },
      update: {},
      create: {
        title: tour.title,
        slug: createSlug(tour.title),
        description: tour.description,
        overview: tour.overview,
        price: String(tour.price),
        duration: tour.duration,
        groupSize: tour.groupSize,
        difficulty: tour.difficulty,
        category: tour.category,
        bestSeason: tour.bestSeason,
        inclusions: tour.inclusions,
        exclusions: tour.exclusions,
        published: true,
        destinationId: destination?.id,
        seoTitle: `${tour.title} in Nepal`,
        seoDescription: tour.description,
      },
    });
  }
  console.log(`✅ Created ${tours.length} tour packages`);

  // Create sample blog posts
  const blogPosts = [
    {
      title: "Best Time to Visit Nepal",
      slug: "best-time-to-visit-nepal",
      excerpt: "Discover the ideal seasons for your Nepal adventure",
      content: `Nepal is beautiful year-round, but the best times to visit are:

**Spring (March-May)**: Clear skies, mild temperatures, and blooming flowers make this ideal for trekking.

**Autumn (September-November)**: Crisp air, excellent visibility of the Himalayas, and pleasant weather.

Winter (December-February) offers less crowded trails and snow-capped mountains, while summer (June-August) brings heavy rainfall and reduced visibility.

Plan accordingly based on your preferred activities and comfort level.`,
      published: true,
    },
    {
      title: "Guide to Trekking in Nepal",
      slug: "guide-to-trekking-in-nepal",
      excerpt: "Everything you need to know about trekking adventures",
      content: `Trekking in Nepal offers incredible experiences through diverse landscapes and cultures. Here's what you need to know:

**Preparation**: Get fit before your trek. Consider altitude acclimatization carefully.

**Routes**: Popular options include Everest Base Camp, Annapurna Circuit, and Langtang Valley.

**Packing**: Bring proper trekking boots, layers, and sun protection.

**Guide**: Hiring a guide enhances the experience and supports local communities.

**Budget**: Factor in accommodation, food, permits, and guide costs.

Start your trekking journey with proper preparation and respect for the mountains.`,
      published: true,
    },
    {
      title: "Discover Nepali Culture and Traditions",
      slug: "discover-nepali-culture",
      excerpt: "Learn about the rich heritage of Nepal",
      content: `Nepal's culture is a beautiful blend of Hindu and Buddhist traditions. Key aspects include:

**Temples and Monasteries**: Sacred sites like Boudhanath Stupa and Pashupatinath Temple.

**Festivals**: Diverse celebrations including Dashain, Tihar, and Losar.

**Cuisine**: Delicious traditional dishes like momo, dal bhat, and chiya.

**Handicrafts**: Unique pottery, singing bowls, and traditional textiles.

**People**: Warm, welcoming Nepali people known for their hospitality.

Immerse yourself in Nepal's incredible cultural tapestry during your visit.`,
      published: true,
    },
  ];

  for (const post of blogPosts) {
    await db.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }
  console.log(`✅ Created ${blogPosts.length} blog posts`);

  console.log("✨ Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
