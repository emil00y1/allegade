import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/sanity/client";
import { type SiteSettings } from "@/types/sanity";
import Breadcrumb from "@/components/Breadcrumb";
import StructuredData from "@/components/StructuredData";
import { DEFAULT_LABELS, type MenuCard } from "@/components/MenuTabs";
import SelskabsmenuerTabs from "@/components/SelskabsmenuerTabs";

// ─── Query ────────────────────────────────────────────────────────────────────

const QUERY = `{
  "menus": *[_type == "menuCard" && menuType == "event"] | order(order asc){
    _id, title, menuType, order, intro,
    price, priceString, priceLabel, menuNote, ctaLabel, ctaUrl,
    highlightMenu{
      enabled, openByDefault, noticeText, badge, title, intro,
      groups[]{ heading, body }, price, priceNote, ctaLabel, ctaUrl
    },
    sections[]{
      _key, sectionTitle, sectionNote, displayStyle,
      items[]{ _key, name, description, price, priceString, note, badge }
    }
  },
  "siteSettings": *[_type == "siteSettings"][0]{
    ctaBookTableUrl, ctaBookTableLabel, breadcrumbHomeLabel
  }
}`;

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Selskabsmenuer | Allégade 10",
  description:
    "Se vores menuer til selskaber og julearrangementer på Allégade 10 — fra Mortensaften til julefrokost og juleaften.",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SelskabsmenuerPage() {
  // Bypassed the shared Sanity Data Cache (sanityFetch) for this page: menu
  // content changes need to show up immediately, and the cache here would
  // otherwise only get invalidated once a browser tab's live listener notices
  // the drift and refreshes — a multi-second stale flash for every visitor.
  const result = await client.fetch<{ menus: MenuCard[]; siteSettings: SiteSettings } | null>(
    QUERY,
    {},
    { cache: "no-store" },
  );
  const menus = result?.menus ?? [];
  const siteSettings = result?.siteSettings;

  const globalBookTableUrl =
    siteSettings?.ctaBookTableUrl ||
    "https://dinnerbooking.com/dk/da-DK/eventbooking/event/4155/allegade-10";
  const labels = { ...DEFAULT_LABELS, bookTable: siteSettings?.ctaBookTableLabel || DEFAULT_LABELS.bookTable };

  const menuSchema = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: "Selskabsmenuer",
    description: "Menuer til selskaber, julefrokost og juleaften",
    url: "https://www.allegade10.dk/selskaber/menuer",
    ...(menus.length > 0 && {
      hasMenuSection: menus.map((menu) => ({
        "@type": "MenuSection",
        name: menu.title,
        ...(menu.intro && { description: menu.intro }),
      })),
    }),
  };

  return (
    <main className="bg-warm-white min-h-[calc(100vh-80px)] pt-12">
      <StructuredData data={menuSchema} />
      <div className="max-w-2xl mx-auto px-6 pt-10 text-center">
        <Breadcrumb
          current="Selskabsmenuer"
          currentUrl="/selskaber/menuer"
          homeLabel={siteSettings?.breadcrumbHomeLabel}
          className="justify-center mb-6"
        />
        <h1 className="font-newsreader font-extralight text-[clamp(1.75rem,3vw,2.5rem)] text-dark-stone leading-tight mb-3">
          Selskabsmenuer
        </h1>
        <Link
          href="/selskaber#foresporgsel"
          className="text-[11px] tracking-[1px] uppercase font-light text-brand border-b border-brand/40 pb-px hover:opacity-70 transition-opacity"
        >
          Send en forespørgsel →
        </Link>
      </div>

      {menus.length === 0 ? (
        <div className="py-24 text-center text-warm-brown/50 font-light text-sm">
          Indholdet er ikke klar endnu — tilføj et selskabsmenukort i Sanity Studio.
        </div>
      ) : (
        <div className="mt-6">
          <SelskabsmenuerTabs
            menus={menus}
            bookTableUrl={globalBookTableUrl}
            labels={labels}
          />
        </div>
      )}
    </main>
  );
}
