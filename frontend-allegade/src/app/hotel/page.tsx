import type { Metadata } from "next";
import type { TypedObject } from "sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { urlFor } from "@/sanity/lib/image";
import { SectionRenderer } from "@/components/sections";
import { type SiteSettings, type SanitySeo, type SanitySection } from "@/types/sanity";
import { type HotelRoom } from "@/components/RoomCarousel";
import { SECTIONS_QUERY_FRAGMENT } from "@/sanity/lib/sections-query";
import StructuredData from "@/components/StructuredData";

interface HotelPageData {
  _id: string;
  _type: string;
  title?: string;
  seo?: SanitySeo;
  sections?: SanitySection[];
}

// ─── Query ────────────────────────────────────────────────────────────────────

const HOTEL_PAGE_QUERY = `{
  "page": *[_type == "hotelPage"][0]{
    _id,
    _type,
    title,
    seo,
    sections[]{
      ...,
      _type == "hotelHeroSection" => { ..., heroImage{ ..., asset-> } },
      _type == "hotelFacilitiesSection" => { ..., facilities[]{ _key, iconName, title, description } },
      _type == "hotelRestaurantTeaserSection" => { ..., restaurantImage{ ..., asset-> } },
      ${SECTIONS_QUERY_FRAGMENT}
    },
  },
  "rooms": *[_type == "hotelRoom"] | order(order asc, title asc){
    _id, title, slug, roomType, pricePerNight, priceLabel, description, note, features, ctaLabel, ctaUrl,
    image{ ..., asset-> }, gallery[]{ ..., asset-> }
  },
  "siteSettings": *[_type == "siteSettings"][0]{
    address, phone, email, footerDescription, socialLinks,
    restaurantHours, kitchenClosingNote,
    newsletterLabel, newsletterSubtext, newsletterButtonLabel,
    breadcrumbHomeLabel, ctaBookStayUrl
  }
}`;

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({ query: HOTEL_PAGE_QUERY });
  const result = data as { page: HotelPageData | null; siteSettings: SiteSettings | null };
  const page = result?.page;
  const siteSettings = result?.siteSettings;

  const seo = page?.seo;
  const heroSection = (page?.sections as any[])?.find((s) => s._type === "hotelHeroSection");
  const title = seo?.metaTitle || page?.title || "Hotel";
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

export default async function HotelPage() {
  const { data } = await sanityFetch({ query: HOTEL_PAGE_QUERY });
  const result = data as { page: HotelPageData | null; siteSettings: SiteSettings | null; rooms: HotelRoom[] } | null;
  const page = result?.page;
  const siteSettings = result?.siteSettings;
  const rooms = result?.rooms ?? [];

  const globalBookTableUrl = siteSettings?.ctaBookTableUrl || "https://allegade10.suitcasebooking.com/da";

  const faqItems = ((page?.sections?.find((s: any) => s._type === "hotelPracticalInfoSection") as any)?.faqItems) as Array<{ question?: string; answer?: string }> | undefined;
  const heroSection = page?.sections?.find((s: any) => s._type === "hotelHeroSection") as any;

  const structuredData: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "Hotel",
      name: page?.title || "Hotel Allégade 10",
      url: "https://allegade10.dk/hotel",
      description: heroSection?.heroDescription,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Allégade 10",
        addressLocality: "Frederiksberg",
        postalCode: "2000",
        addressCountry: "DK",
      },
      ...(siteSettings?.phone && { telephone: siteSettings.phone }),
      ...(siteSettings?.email && { email: siteSettings.email }),
      ...((siteSettings as any)?.ctaBookStayUrl && {
        reservations: (siteSettings as any).ctaBookStayUrl,
      }),
      ...(rooms.length > 0 && {
        containsPlace: rooms.map((room: any) => ({
          "@type": "HotelRoom",
          name: room.title,
          ...(room.description && { description: room.description }),
          ...(room.slug?.current && {
            url: `https://allegade10.dk/hotel/vaerelser/${room.slug.current}`,
          }),
          ...(room.image?.asset && {
            image: urlFor(room.image).width(1200).height(800).url(),
          }),
          ...(room.pricePerNight && {
            offers: {
              "@type": "Offer",
              price: room.pricePerNight,
              priceCurrency: "DKK",
              availability: "https://schema.org/InStock",
            },
          }),
        })),
      }),
    },
  ];

  if (faqItems?.length) {
    structuredData.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item: any) => {
        const answerText = Array.isArray(item.answer)
          ? (item.answer as TypedObject[])
              .flatMap((block: any) => block.children?.map((span: any) => span.text) ?? [])
              .join(" ")
          : (item.answer as string | undefined) ?? "";
        return {
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: answerText },
        };
      }),
    });
  }

  return (
    <main>
      <StructuredData data={structuredData} />
      <SectionRenderer
        documentId={page?._id ?? "hotelPage"}
        documentType={page?._type ?? "hotelPage"}
        sections={page?.sections}
        rooms={rooms}
        globalBookTableUrl={globalBookTableUrl}
        breadcrumbHomeLabel={siteSettings?.breadcrumbHomeLabel}
      />
    </main>
  );
}
