import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { urlFor } from "@/sanity/lib/image";
import { SectionRenderer } from "@/components/sections";
import { type SiteSettings, type SanitySeo, type SanitySection } from "@/types/sanity";
import { SECTIONS_QUERY_FRAGMENT } from "@/sanity/lib/sections-query";
import StructuredData from "@/components/StructuredData";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RestaurantPageData {
  _id: string;
  _type: string;
  title?: string;
  seo?: SanitySeo;
  sections?: SanitySection[];
}

// ─── Query ────────────────────────────────────────────────────────────────────

const QUERY = `{
  "restaurantPage": *[_type == "restaurantPage"][0]{
    _id,
    _type,
    title,
    seo,
    sections[]{
      ...,
      _type == "restaurantHeroSection" => { ..., heroImage{ ..., asset-> } },
      _type == "restaurantStorySection" => { ..., storyImage{ ..., asset-> } },
      _type == "restaurantMenuTeaserSection" => { ..., menuServices[]{ ..., image{ ..., asset-> } } },
      _type == "restaurantPhilosophySection" => { ..., philosophyImage{ ..., asset-> } },
      ${SECTIONS_QUERY_FRAGMENT}
    },
  },
  "siteSettings": *[_type == "siteSettings"][0]{
    address, phone, email, footerDescription, socialLinks,
    restaurantHours, kitchenClosingNote, ctaBookTableUrl,
    newsletterLabel, newsletterSubtext, newsletterButtonLabel,
    breadcrumbHomeLabel
  }
}`;

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({ query: QUERY });
  const result = data as { restaurantPage: RestaurantPageData | null; siteSettings: SiteSettings | null };
  const page = result?.restaurantPage;
  const siteSettings = result?.siteSettings;

  const seo = page?.seo;
  const heroSection = (page?.sections as any[])?.find((s) => s._type === "restaurantHeroSection");
  const title = seo?.metaTitle || page?.title || "Restaurant";
  const description = seo?.metaDescription || heroSection?.heroDescription || siteSettings?.footerDescription;
  const ogImage = seo?.shareImage
    ? urlFor(seo.shareImage).width(1200).height(630).url()
    : heroSection?.heroImage
      ? urlFor(heroSection.heroImage).width(1200).height(630).url()
      : undefined;

  return {
    title: `${title} | Allégade 10`,
    description,
    openGraph: { title, description, images: ogImage ? [{ url: ogImage }] : [] },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function RestaurantPage() {
  const { data } = await sanityFetch({ query: QUERY });
  const result = data as { restaurantPage: RestaurantPageData | null; siteSettings: SiteSettings | null } | null;

  const page = result?.restaurantPage;
  const siteSettings = result?.siteSettings;

  const globalBookTableUrl =
    siteSettings?.ctaBookTableUrl ||
    "https://dinnerbooking.com/dk/da-DK/eventbooking/event/4155/allegade-10";

  const heroSection = (page?.sections as any[])?.find((s) => s._type === "restaurantHeroSection");

  const restaurantSchema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: page?.title || "Restaurant Allégade 10",
    url: "https://allegade10.dk/restaurant",
    description: heroSection?.heroDescription,
    servesCuisine: "Danish",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Allégade 10",
      addressLocality: "Frederiksberg",
      postalCode: "2000",
      addressCountry: "DK",
    },
    ...(siteSettings?.phone && { telephone: siteSettings.phone }),
    ...(siteSettings?.email && { email: siteSettings.email }),
    ...(siteSettings?.restaurantHours && {
      openingHoursSpecification: siteSettings.restaurantHours.map((h: any) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.days || h.label,
        opens: h.hours?.split(" - ")?.[0]?.replace(".", ":"),
        closes: h.hours?.split(" - ")?.[1]?.replace(".", ":"),
      })),
    }),
    acceptsReservations: true,
    ...(globalBookTableUrl && { reservations: globalBookTableUrl }),
    menu: "https://allegade10.dk/menukort",
    ...(heroSection?.heroImage?.asset && {
      image: urlFor(heroSection.heroImage).width(1200).height(800).url(),
    }),
  };

  return (
    <main>
      <StructuredData data={restaurantSchema} />
      <SectionRenderer
        documentId={page?._id ?? "restaurantPage"}
        documentType={page?._type ?? "restaurantPage"}
        sections={page?.sections}
        globalBookTableUrl={globalBookTableUrl}
        breadcrumbHomeLabel={siteSettings?.breadcrumbHomeLabel}
      />
    </main>
  );
}
