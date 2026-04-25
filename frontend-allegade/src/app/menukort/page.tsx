import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { urlFor } from "@/sanity/lib/image";
import { SectionRenderer } from "@/components/sections";
import { type SiteSettings, type SanitySeo, type SanitySection } from "@/types/sanity";
import { type MenuCard } from "@/components/MenuTabs";
import { SECTIONS_QUERY_FRAGMENT } from "@/sanity/lib/sections-query";
import StructuredData from "@/components/StructuredData";

interface MenuPageData {
  _id: string;
  _type: string;
  title?: string;
  seo?: SanitySeo;
  sections?: SanitySection[];
}

// ─── Query ────────────────────────────────────────────────────────────────────

const QUERY = `{
  "page": *[_type == "menuPage"][0]{
    _id,
    _type,
    title,
    seo,
    sections[]{
      ...,
      _type == "menuHeroSection" => { ..., headerImage{ ..., asset-> } },
      ${SECTIONS_QUERY_FRAGMENT}
    },
  },
  "menus": *[_type == "menuCard"] | order(order asc){
    _id, title, menuType, order, intro,
    featuredImage{ ..., asset-> },
    price, priceString, priceLabel, menuNote, ctaLabel, ctaUrl,
    sections[]{
      _key, sectionTitle, sectionNote, displayStyle,
      items[]{ _key, name, description, price, priceString, note, badge }
    }
  },
  "siteSettings": *[_type == "siteSettings"][0]{
    address, phone, email, footerDescription, socialLinks,
    restaurantHours, kitchenClosingNote, ctaBookTableUrl,
    breadcrumbHomeLabel
  }
}`;

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({ query: QUERY });
  const result = data as { page: MenuPageData | null; siteSettings: SiteSettings | null };
  const page = result?.page;
  const siteSettings = result?.siteSettings;

  const seo = page?.seo;
  const heroSection = (page?.sections as any[])?.find((s) => s._type === "menuHeroSection");
  const title = seo?.metaTitle || page?.title || "Menukort";
  const description = seo?.metaDescription || heroSection?.headerDescription || siteSettings?.footerDescription;
  const ogImage = seo?.shareImage
    ? urlFor(seo.shareImage).width(1200).height(630).url()
    : heroSection?.headerImage
      ? urlFor(heroSection.headerImage).width(1200).height(630).url()
      : undefined;

  return {
    title: `${title} | Allégade 10`,
    description,
    openGraph: { title, description, images: ogImage ? [{ url: ogImage }] : [] },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function MenukortPage() {
  const { data } = await sanityFetch({ query: QUERY });
  const result = data as { page: MenuPageData | null; siteSettings: SiteSettings | null; menus: MenuCard[] } | null;
  const page = result?.page;
  const siteSettings = result?.siteSettings;
  const menus = result?.menus ?? [];

  const globalBookTableUrl = siteSettings?.ctaBookTableUrl || "https://dinnerbooking.com/dk/da-DK/eventbooking/event/4155/allegade-10";
  const heroSection = (page?.sections as any[])?.find((s) => s._type === "menuHeroSection");

  const menuSchema = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: heroSection?.headerHeading || "Menukort",
    description: heroSection?.headerDescription,
    url: "https://allegade10.dk/menukort",
    ...(menus.length > 0 && {
      hasMenuSection: menus.map((menu: any) => ({
        "@type": "MenuSection",
        name: menu.title,
        ...(menu.intro && { description: menu.intro }),
        ...(menu.sections && {
          hasMenuItem: menu.sections.flatMap((section: any) =>
            (section.items || []).map((item: any) => ({
              "@type": "MenuItem",
              name: item.name,
              ...(item.description && { description: item.description }),
              ...(item.price != null && {
                offers: { "@type": "Offer", price: item.price, priceCurrency: "DKK" },
              }),
              ...(item.priceString && !item.price && {
                offers: { "@type": "Offer", price: item.priceString, priceCurrency: "DKK" },
              }),
            }))
          ),
        }),
      })),
    }),
  };

  return (
    <main className="bg-warm-white min-h-[calc(100vh-80px)]">
      <StructuredData data={menuSchema} />
      <SectionRenderer
        documentId={page?._id ?? "menuPage"}
        documentType={page?._type ?? "menuPage"}
        sections={page?.sections}
        menus={menus}
        globalBookTableUrl={globalBookTableUrl}
        breadcrumbHomeLabel={siteSettings?.breadcrumbHomeLabel}
      />
    </main>
  );
}
