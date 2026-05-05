import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { urlFor } from "@/sanity/lib/image";
import { type SiteSettings, type SanitySeo, type SanitySection, type SanityImage } from "@/types/sanity";
import MenuTabs, { type MenuCard, type TabConfig } from "@/components/MenuTabs";
import { SECTIONS_QUERY_FRAGMENT } from "@/sanity/lib/sections-query";
import StructuredData from "@/components/StructuredData";

interface MenuHeroSection extends SanitySection {
  headerDescription?: string;
  headerImage?: SanityImage;
}

interface MenuTabsSection extends SanitySection {
  tabs?: TabConfig[];
}

interface MenuPageData {
  _id: string;
  _type: string;
  title?: string;
  intro?: string;
  seo?: SanitySeo;
  sections?: SanitySection[];
}

// ─── Query ────────────────────────────────────────────────────────────────────

const QUERY = `{
  "page": *[_type == "menuPage"][0]{
    _id,
    _type,
    title,
    intro,
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
    restaurantHours, kitchenClosingNote, ctaBookTableUrl, ctaBookTableLabel,
    breadcrumbHomeLabel
  }
  }
`;

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({ query: QUERY });
  const result = data as { page: MenuPageData | null; siteSettings: SiteSettings | null };
  const page = result?.page;
  const siteSettings = result?.siteSettings;

  const seo = page?.seo;
  const heroSection = page?.sections?.find((s) => s._type === "menuHeroSection") as MenuHeroSection | undefined;
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
  const result = data as {
    page: MenuPageData | null;
    siteSettings: SiteSettings | null;
    menus: MenuCard[];
  } | null;

  const page = result?.page;
  const siteSettings = result?.siteSettings;
  const menus = result?.menus ?? [];

  const globalBookTableUrl =
    siteSettings?.ctaBookTableUrl ||
    "https://dinnerbooking.com/dk/da-DK/eventbooking/event/4155/allegade-10";

  // Find the menuTabsSection to get any custom tab labels/serving times
  const tabsSection = page?.sections?.find(
    (s) => s._type === "menuTabsSection"
  ) as MenuTabsSection | undefined;
  const customTabs = tabsSection?.tabs;

  const menuSchema = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: "Menukort",
    description: "Vores udvalg af mad og drikke",
    url: "https://allegade10.dk/menukort",
    ...(menus.length > 0 && {
      hasMenuSection: menus.map((menu) => ({
        "@type": "MenuSection",
        name: menu.title,
        ...(menu.intro && { description: menu.intro }),
        ...(menu.sections && {
          hasMenuItem: menu.sections.flatMap((section) =>
            (section.items || []).map((item) => ({
              "@type": "MenuItem",
              name: item.name,
              ...(item.description && { description: item.description }),
              ...(item.price != null && {
                offers: {
                  "@type": "Offer",
                  price: item.price,
                  priceCurrency: "DKK",
                },
              }),
              ...(item.priceString &&
                !item.price && {
                  offers: {
                    "@type": "Offer",
                    price: item.priceString,
                    priceCurrency: "DKK",
                  },
                }),
            }))
          ),
        }),
      })),
    }),
  };

  return (
    <main className="bg-warm-white min-h-[calc(100vh-80px)] pt-12">
      <StructuredData data={menuSchema} />
      {/* 
        Dedicated minimalistic menu page: 
        Only show the tabs and the menu content.
      */}
      {page?.intro && (
        <div className="max-w-2xl mx-auto px-6 pt-12 text-center">
          <p className="text-warm-brown font-light leading-relaxed text-sm lg:text-base italic">
            {page.intro}
          </p>
        </div>
      )}
      <MenuTabs
        tabs={customTabs}
        menus={menus}
        bookTableUrl={globalBookTableUrl}
        labels={{
          bookTable: siteSettings?.ctaBookTableLabel,
        }}
      />
    </main>
  );
}
