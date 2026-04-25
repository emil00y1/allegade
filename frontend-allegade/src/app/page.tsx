import type { Metadata } from "next";
import { SectionRenderer } from "@/components/sections";
import { sanityFetch } from "@/sanity/lib/live";
import { urlFor } from "@/sanity/lib/image";
import StructuredData from "@/components/StructuredData";

const HOMEPAGE_QUERY = `*[_type == "homepage" && _id == "homepage"][0]{
  _id,
  _type,
  seo,
  sections[]{
    ...,
    _type == "homeHeroSection" => {
      ...,
      backgroundVideo{ asset->{ url } },
      backgroundImage{ ..., asset-> }
    },
    _type == "welcomeSection" => {
      ...,
      image{ ..., asset-> }
    },
    _type == "selskaberTeaserSection" => {
      ...,
      backgroundImage{ ..., asset-> }
    },
    _type == "textImageSection" => {
      ...,
      image{ ..., asset-> }
    },
    _type == "bannerSection" => {
      ...,
      backgroundImage{ ..., asset-> }
    },
    _type == "gallerySection" => {
      ...,
      images[]{ ..., asset-> }
    }
  }
}`;

const EVENTS_QUERY = `*[_type == "event" && defined(slug.current) && (!defined(publishAt) || publishAt <= now()) && (!defined(unpublishAt) || unpublishAt > now())]
  | order(startDate asc)[0...4]{
    _id, title, slug, startDate, category,
    image{ ..., asset-> }
  }`;
const SITE_SETTINGS_QUERY = `*[_type == "siteSettings" && _id == "siteSettings"][0]{
  address, phone, email, footerDescription, socialLinks,
  restaurantHours, kitchenClosingNote, ctaBookTableUrl,
  newsletterLabel, newsletterSubtext, newsletterButtonLabel
}`;

export async function generateMetadata(): Promise<Metadata> {
  const { data: homepage } = await sanityFetch<any>({ query: HOMEPAGE_QUERY });
  const { data: siteSettings } = await sanityFetch<any>({ query: SITE_SETTINGS_QUERY });

  const seo = homepage?.seo;
  const hero = homepage?.sections?.find((s: any) => s._type === "homeHeroSection");

  const title = seo?.metaTitle || homepage?.title || "Forside";
  const description = seo?.metaDescription || hero?.tagline || siteSettings?.footerDescription;

  const ogImage = seo?.shareImage
    ? urlFor(seo.shareImage).width(1200).height(630).url()
    : hero?.backgroundImage
      ? urlFor(hero.backgroundImage).width(1200).height(630).url()
      : undefined;

  return {
    title: `${title} | Allégade 10`,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : [],
    },
  };
}

export default async function IndexPage() {
  const [{ data: homepage }, { data: events }, { data: siteSettings }] =
    await Promise.all([
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sanityFetch<any>({ query: HOMEPAGE_QUERY }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sanityFetch<any>({ query: EVENTS_QUERY }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sanityFetch<any>({ query: SITE_SETTINGS_QUERY }),
    ]);

  const globalBookTableUrl =
    siteSettings?.ctaBookTableUrl ||
    "https://dinnerbooking.com/dk/da-DK/eventbooking/event/4155/allegade-10";

  const hotelRestaurantSchema = [
    {
      "@context": "https://schema.org",
      "@type": "Hotel",
      name: "Hotel Allégade 10",
      url: "https://allegade10.dk/hotel",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Allégade 10",
        addressLocality: "Frederiksberg",
        postalCode: "2000",
        addressCountry: "DK",
      },
      ...(siteSettings?.phone && { telephone: siteSettings.phone }),
      ...(siteSettings?.email && { email: siteSettings.email }),
    },
    {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      name: "Restaurant Allégade 10",
      url: "https://allegade10.dk/restaurant",
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
      ...(siteSettings?.ctaBookTableUrl && {
        acceptsReservations: true,
        reservations: siteSettings.ctaBookTableUrl,
      }),
      menu: "https://allegade10.dk/menukort",
    },
  ];

  return (
    <main>
      <StructuredData data={hotelRestaurantSchema} />
      <SectionRenderer
        documentId={homepage?._id ?? "homepage"}
        documentType={homepage?._type ?? "homepage"}
        sections={homepage?.sections}
        events={events || []}
        globalBookTableUrl={globalBookTableUrl}
      />
    </main>
  );
}
