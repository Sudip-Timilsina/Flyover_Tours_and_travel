import { db } from "@/lib/db";
import { SITE_CONFIG } from "@/lib/constants";

export type SiteSettingsValue = {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  logoText: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroPrimaryCtaLabel: string;
  heroPrimaryCtaHref: string;
  heroSecondaryCtaLabel: string;
  heroSecondaryCtaHref: string;
};

export const DEFAULT_SITE_SETTINGS: SiteSettingsValue = {
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
};

export async function getSiteSettings(): Promise<SiteSettingsValue> {
  try {
    const settings = await db.siteSettings.findUnique({
      where: { id: "singleton" },
    });

    if (!settings) {
      return DEFAULT_SITE_SETTINGS;
    }

    return {
      siteName: settings.siteName,
      siteDescription: settings.siteDescription,
      siteUrl: settings.siteUrl,
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
      address: settings.address,
      logoText: settings.logoText || settings.siteName,
      heroEyebrow: settings.heroEyebrow,
      heroTitle: settings.heroTitle,
      heroSubtitle: settings.heroSubtitle,
      heroImage: (settings.heroImage && !settings.heroImage.includes("flyover-logo")) ? settings.heroImage : "",
      heroPrimaryCtaLabel: settings.heroPrimaryCtaLabel,
      heroPrimaryCtaHref: settings.heroPrimaryCtaHref,
      heroSecondaryCtaLabel: settings.heroSecondaryCtaLabel,
      heroSecondaryCtaHref: settings.heroSecondaryCtaHref,
    };
  } catch (error) {
    console.error("Error loading site settings:", error);
    return DEFAULT_SITE_SETTINGS;
  }
}