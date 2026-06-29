import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { urlFor } from "@/sanity/lib/image";
import { SectionRenderer } from "@/components/sections";
import { type SiteSettings } from "@/types/sanity";
import { SECTIONS_QUERY_FRAGMENT } from "@/sanity/lib/sections-query";
import { getLocale, getCanonicalPath } from "@/i18n/server";
import { getTranslated } from "@/i18n/getTranslated";
import { languageAlternates } from "@/i18n/metadata";

// ─── Query ────────────────────────────────────────────────────────────────────

const QUERY = `{
  "page": *[_type == "selskaberPage"][0]{
    _id,
    _type,
    title,
    seo,
    sections[]{
      ...,
      _type == "selskaberHeroSection" => { ..., heroImage{ ..., asset-> } },
      _type == "selskaberOccasionsSection" => { ..., occasions[]{ ..., image{ ..., asset-> } } },
      _type == "selskaberVenuesSection" => { ..., venues[]{ ..., image{ ..., asset-> } } },
      _type == "selskaberCtaBannerSection" => { ... },
      ${SECTIONS_QUERY_FRAGMENT}
    },
    "occasionLabels": sections[_type == "selskaberOccasionsSection"][0].occasions[].label,
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
  const locale = await getLocale();
  const canonicalPath = await getCanonicalPath();
  const { data } = await sanityFetch({ query: QUERY });
  const result = data as { page: any; siteSettings: SiteSettings };
  const page = getTranslated(result?.page, locale);
  const siteSettings = result?.siteSettings;

  const seo = page?.seo;
  const heroSection = page?.sections?.find((s: any) => s._type === "selskaberHeroSection");
  const title = seo?.metaTitle || page?.title || "Selskaber";
  const description = seo?.metaDescription || heroSection?.heroDescription || siteSettings?.footerDescription;
  const ogImage = seo?.shareImage
    ? urlFor(seo.shareImage).width(1200).height(630).url()
    : heroSection?.heroImage
      ? urlFor(heroSection.heroImage).width(1200).height(630).url()
      : undefined;

  return {
    title: `${title} | Allégade 10`,
    description,
    alternates: languageAlternates(canonicalPath, locale),
    openGraph: { title, description, images: ogImage ? [{ url: ogImage }] : [] },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SelskaberPage() {
  const locale = await getLocale();
  const { data } = await sanityFetch({ query: QUERY });
  const result = data as { page: any; siteSettings: SiteSettings } | null;
  const page = getTranslated(result?.page, locale);
  const siteSettings = result?.siteSettings;

  const globalBookTableUrl = siteSettings?.ctaBookTableUrl || "https://dinnerbooking.com/dk/da-DK/eventbooking/event/4155/allegade-10";
  // Derive occasion labels from the (already translated) section rather than the
  // denormalized GROQ projection, so they localize with everything else.
  const occasionsSection = page?.sections?.find(
    (s: any) => s._type === "selskaberOccasionsSection",
  );
  const occasionLabels: string[] = (occasionsSection?.occasions ?? [])
    .map((o: any) => o?.label)
    .filter(Boolean);

  return (
    <main className="bg-warm-white min-h-[calc(100vh-80px)]">
      <SectionRenderer
        documentId={page?._id ?? "selskaberPage"}
        documentType={page?._type ?? "selskaberPage"}
        sections={page?.sections}
        occasionLabels={occasionLabels}
        globalBookTableUrl={globalBookTableUrl}
        breadcrumbHomeLabel={siteSettings?.breadcrumbHomeLabel}
      />
    </main>
  );
}
