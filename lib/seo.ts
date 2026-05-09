import { Metadata } from "next";
import { SITE_CONFIG } from "./constants";

interface MetadataProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  keywords?: string;
  author?: string;
  robots?: "index, follow" | "noindex, nofollow";
}

export function generateSEOMetadata(props: MetadataProps): Metadata {
  const {
    title = SITE_CONFIG.name,
    description = SITE_CONFIG.description,
    image = SITE_CONFIG.ogImage,
    url = SITE_CONFIG.url,
    keywords,
    robots = "index, follow",
  } = props;

  const fullTitle = title.includes(SITE_CONFIG.name)
    ? title
    : `${title} | ${SITE_CONFIG.name}`;

  const normalizeOrigin = (value: string | undefined) => {
    const raw = value?.trim();
    if (!raw) return "http://localhost:3000";
    if (/^https?:\/\//i.test(raw)) return raw;
    if (raw.startsWith("//")) return `https:${raw}`;
    if (raw.startsWith("localhost") || raw.startsWith("127.0.0.1") || raw.startsWith("0.0.0.0")) {
      return `http://${raw}`;
    }
    return `https://${raw}`;
  };

  // Build a safe base URL and resolve incoming `url` and `image` values
  // so generateSEOMetadata can accept relative paths like `/tours/slug`.
  const baseFromEnv =
    process.env.SITE_URL ||
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_URL ||
    SITE_CONFIG.url;

  let siteBase: URL;
  try {
    siteBase = new URL(normalizeOrigin(baseFromEnv));
  } catch {
    siteBase = new URL("http://localhost:3000");
  }

  const canonicalUrl = (() => {
    try {
      return new URL(url, siteBase).toString();
    } catch {
      return siteBase.toString();
    }
  })();

  const imageUrl = (() => {
    try {
      return new URL(image, siteBase).toString();
    } catch {
      return new URL(SITE_CONFIG.ogImage, siteBase).toString();
    }
  })();

  return {
    title: fullTitle,
    description,
    keywords,
    robots,
    metadataBase: siteBase,
    authors: [{ name: SITE_CONFIG.name }],
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      title: fullTitle,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export function generateStructuredData(
  type: "Organization" | "TravelAgency" | "Tour" | "BreadcrumbList",
  data: Record<string, any>
) {
  const baseData = {
    "@context": "https://schema.org",
    "@type": type,
  };

  switch (type) {
    case "Organization":
      return {
        ...baseData,
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
        logo: `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`,
        sameAs: ["https://www.facebook.com", "https://www.instagram.com"],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: SITE_CONFIG.phone,
          contactType: "Customer Support",
        },
      };

    case "TravelAgency":
      return {
        ...baseData,
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
        telephone: SITE_CONFIG.phone,
        areaServed: "NP",
        priceRange: "$$",
      };

    case "Tour":
      return {
        ...baseData,
        name: data.title,
        url: `${SITE_CONFIG.url}/tours/${data.slug}`,
        description: data.description,
        priceCurrency: "NPR",
        price: data.price,
        duration: `P${data.duration}D`,
        image: data.image,
        itinerary: data.itinerary || [],
      };

    case "BreadcrumbList":
      return {
        ...baseData,
        itemListElement: data.items,
      };

    default:
      return baseData;
  }
}
