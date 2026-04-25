import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { urlFor } from "@/sanity/lib/image";
import { SectionRenderer } from "@/components/sections";
import { SECTIONS_QUERY_FRAGMENT } from "@/sanity/lib/sections-query";
import StructuredData from "@/components/StructuredData";

// ─── Query ────────────────────────────────────────────────────────────────────

const QUERY = `{
  "page": *[_type == "eventsPage"][0]{
    _id,
    _type,
    title,
    seo,
    sections[]{
      ...,
      ${SECTIONS_QUERY_FRAGMENT}
    },
  },
  "events": *[_type == "event" && defined(slug.current) && (!defined(publishAt) || publishAt <= now()) && (!defined(unpublishAt) || unpublishAt > now())] | order(startDate asc){
    _id, title, slug, startDate, endDate, price, priceDescription, category, excerpt,
    image{ ..., asset-> },
    "venue": venue->{ title }
  },
  "siteSettings": *[_type == "siteSettings"][0]{
    breadcrumbHomeLabel
  }
}`;

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({ query: QUERY });
  const result = data as { page: any; siteSettings: any };
  const page = result?.page;
  const siteSettings = result?.siteSettings;

  const seo = page?.seo;
  const heroSection = page?.sections?.find((s: any) => s._type === "eventsHeroSection");
  const title = seo?.metaTitle || page?.title || "Begivenheder";
  const description = seo?.metaDescription || heroSection?.heroDescription || "Oplev begivenheder på Allégade 10";
  const ogImage = seo?.shareImage ? urlFor(seo.shareImage).width(1200).height(630).url() : undefined;

  return {
    title: `${title} | Allégade 10`,
    description,
    openGraph: { title, description, images: ogImage ? [{ url: ogImage }] : [] },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BegivenhedPage() {
  const { data } = await sanityFetch({ query: QUERY });
  const result = data as { page: any; events: any[]; siteSettings: any } | null;
  const page = result?.page;
  const events = result?.events ?? [];
  const breadcrumbHomeLabel = result?.siteSettings?.breadcrumbHomeLabel;

  const now = new Date();
  const upcomingEvents = events.filter((e) => new Date(e.startDate) >= now);
  const pastEvents = events.filter((e) => new Date(e.startDate) < now).reverse();
  const featuredEvent = upcomingEvents[0];

  const eventSchemas = upcomingEvents.map((event: any) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    ...(event.startDate && { startDate: event.startDate }),
    ...(event.endDate && { endDate: event.endDate }),
    ...(event.excerpt && { description: event.excerpt }),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.venue?.title || "Allégade 10",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Allégade 10",
        addressLocality: "Frederiksberg",
        postalCode: "2000",
        addressCountry: "DK",
      },
    },
    ...(event.price != null && {
      offers: {
        "@type": "Offer",
        price: event.price,
        priceCurrency: "DKK",
        availability: "https://schema.org/InStock",
      },
    }),
    ...(event.image?.asset && {
      image: event.image.asset.url,
    }),
    url: event.slug?.current
      ? `https://allegade10.dk/begivenheder/${event.slug.current}`
      : `https://allegade10.dk/begivenheder`,
    organizer: {
      "@type": "Organization",
      name: "Allégade 10",
      url: "https://allegade10.dk",
    },
  }));

  return (
    <main>
      {eventSchemas.length > 0 && <StructuredData data={eventSchemas} />}
      <SectionRenderer
        documentId={page?._id ?? "eventsPage"}
        documentType={page?._type ?? "eventsPage"}
        sections={page?.sections}
        upcomingEvents={upcomingEvents}
        pastEvents={pastEvents}
        featuredEvent={featuredEvent}
        breadcrumbHomeLabel={breadcrumbHomeLabel}
      />
    </main>
  );
}
