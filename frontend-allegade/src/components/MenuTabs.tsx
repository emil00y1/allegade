"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { type SanityImage } from "@/types/sanity";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MenuItem {
  _key: string;
  name?: string;
  description?: string;
  price?: number;
  priceString?: string;
  note?: string;
  badge?: string;
}

export interface MenuSection {
  _key: string;
  sectionTitle?: string;
  sectionNote?: string;
  displayStyle?: "list" | "wine" | "featured";
  items?: MenuItem[];
}

export interface HighlightGroup {
  _key?: string;
  heading?: string;
  body?: string;
}

export interface HighlightMenu {
  enabled?: boolean;
  openByDefault?: boolean;
  noticeText?: string;
  badge?: string;
  title?: string;
  intro?: string;
  groups?: HighlightGroup[];
  price?: string;
  priceNote?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

export interface MenuCard {
  _id: string;
  title: string;
  menuType: string;
  order?: number;
  intro?: string;
  featuredImage?: SanityImage;
  price?: number;
  priceString?: string;
  priceLabel?: string;
  menuNote?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  highlightMenu?: HighlightMenu;
  sections?: MenuSection[];
}

export interface TabConfig {
  _key?: string;
  label: string;
  menuType: string;
  servingTime?: string;
}

const DEFAULT_TABS: TabConfig[] = [
  { label: "Brunch", menuType: "brunch", servingTime: "Lør–Søn 10–13" },
  { label: "Frokost", menuType: "lunch", servingTime: "11:30–16:00" },
  { label: "Aften", menuType: "dinner", servingTime: "Fra 17:00" },
  { label: "Drikkevarer", menuType: "beverages" },
];

interface MenuTabsProps {
  tabs?: TabConfig[];
  menus: MenuCard[];
  bookTableUrl?: string;
  labels?: {
    pricePerPerson?: string;
    bookTable?: string;
    viewDrinks?: string;
    noContent?: string;
  };
}

const DEFAULT_LABELS = {
  pricePerPerson: "Pris per person",
  bookTable: "Book bord",
  viewDrinks: "Se drikkekort →",
  noContent: "Indholdet er ikke klar endnu — tilføj et menukort i Sanity Studio.",
};

// ─── Time-based default tab ────────────────────────────────────────────────
function getDefaultMenuType(tabs: TabConfig[]): string {
  const now = new Date();
  const hour = now.getHours();
  const minutes = now.getMinutes();
  const day = now.getDay(); 
  const timeAsNumber = hour + minutes / 60;

  const hasType = (t: string) => tabs.some((tab) => tab.menuType === t);

  if (
    (day === 0 || day === 6) &&
    timeAsNumber >= 10 &&
    timeAsNumber < 13 &&
    hasType("brunch")
  ) {
    return "brunch";
  }
  if (timeAsNumber >= 17 && hasType("dinner")) {
    return "dinner";
  }
  if (timeAsNumber >= 11.5 && timeAsNumber < 17 && hasType("lunch")) {
    return "lunch";
  }
  return tabs[0]?.menuType ?? "lunch";
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(item: MenuItem): string | null {
  if (item.priceString) return item.priceString;
  if (item.price != null) return `${item.price},-`;
  return null;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ title, note }: { title?: string; note?: string }) {
  if (!title) return null;
  return (
    <div className="mb-3">
      <h3 className="text-[13px] tracking-[3px] uppercase font-normal text-dark-stone mb-1">
        {title}
      </h3>
      {note && (
        <p className="text-[11px] tracking-[0.5px] uppercase text-warm-brown/95 font-normal">
          {note}
        </p>
      )}
    </div>
  );
}

function MenuItemRow({ item }: { item: MenuItem }) {
  const price = formatPrice(item);
  return (
    <div className="py-2 border-b border-border-warm/15 last:border-0">
      <div className="flex items-baseline gap-2">
        <span className="font-newsreader font-medium text-[1.05rem] text-dark-stone leading-snug">
          {item.name}
        </span>
        {item.badge && (
          <span className="text-[9px] tracking-[0.5px] uppercase font-light text-brand border border-brand/40 px-1.5 py-0.5 shrink-0">
            {item.badge}
          </span>
        )}
        <span className="flex-1" />
        {price && (
          <span className="font-sans font-medium text-[15px] text-dark-stone shrink-0 tabular-nums">
            {price}
          </span>
        )}
      </div>
      {item.description && (
        <p className="text-sm italic text-warm-brown/95 font-light mt-0.5 leading-snug">
          {item.description}
        </p>
      )}
      {item.note && (
        <p className="text-[11px] text-warm-brown/60 font-light mt-0.5">
          {item.note}
        </p>
      )}
    </div>
  );
}

function WineItemRow({ item }: { item: MenuItem }) {
  const price = formatPrice(item);
  return (
    <div className="py-2.5 border-b border-border-warm/15 last:border-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-newsreader font-medium text-[1.1rem] text-dark-stone leading-snug">
            {item.name}
          </p>
          {item.description && (
            <p className="text-sm italic text-warm-brown/95 font-light mt-1 leading-snug">
              {item.description}
            </p>
          )}
        </div>
        {price && (
          <span className="font-newsreader font-medium text-[1.1rem] text-dark-stone shrink-0 tabular-nums text-right">
            {price}
          </span>
        )}
      </div>
    </div>
  );
}

function FeaturedSection({
  section,
  bookTableUrl,
  bookTableLabel,
}: {
  section: MenuSection;
  bookTableUrl?: string;
  bookTableLabel?: string;
}) {
  if (!section.items?.length) return null;
  const pairs: MenuItem[][] = [];
  for (let i = 0; i < section.items.length; i += 2) {
    pairs.push(section.items.slice(i, i + 2));
  }

  return (
    <div className="mb-6">
      <SectionHeader title={section.sectionTitle} note={section.sectionNote} />
      <div className="flex flex-col gap-4">
        {pairs.map((pair, pi) => (
          <div
            key={pi}
            className={cn(
              "grid gap-4",
              pair.length === 2 ? "md:grid-cols-2" : "grid-cols-1",
            )}
          >
            {pair.map((item) => {
              const price = formatPrice(item);
              return (
                <div
                  key={item._key}
                  className="bg-warm-white border border-brand/20 p-6 flex flex-col gap-3"
                >
                  <span className="text-[9px] tracking-[2px] uppercase font-light text-brand border border-brand/30 px-2 py-1 self-start">
                    Sæt-menu
                  </span>
                  <h4 className="font-newsreader font-medium text-xl text-dark-stone leading-snug">
                    {item.name}
                  </h4>
                  {item.description && (
                    <p className="text-sm text-warm-brown font-light leading-snug">
                      {item.description}
                    </p>
                  )}
                  {item.note && (
                    <p className="text-[11px] text-warm-brown/60 font-light italic">
                      {item.note}
                    </p>
                  )}
                  {price && (
                    <p className="font-newsreader font-medium text-2xl text-brand mt-auto pt-2">
                      {price}
                    </p>
                  )}
                  {bookTableUrl && (
                    <Link
                      href={bookTableUrl}
                      className="text-[10px] tracking-[1.5px] uppercase font-light text-brand border-b border-brand/40 pb-px self-start hover:opacity-70 transition-opacity"
                    >
                      {bookTableLabel}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function DrinksCrossLink({ label, onSwitch }: { label: string; onSwitch: () => void }) {
  return (
    <div className="mt-6 pt-4 border-t border-border-warm/20">
      <button
        onClick={onSwitch}
        className="text-[11px] tracking-[1px] uppercase font-light text-brand border-b border-brand/40 pb-px hover:opacity-70 transition-opacity"
      >
        {label}
      </button>
    </div>
  );
}

function HighlightAccordion({
  highlight,
  bookTableUrl,
  bookTableLabel,
}: {
  highlight: HighlightMenu;
  bookTableUrl?: string;
  bookTableLabel: string;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(
    highlight.openByDefault ?? false,
  );

  const headerText = highlight.noticeText || highlight.title;
  if (!headerText) return null;

  const ctaHref = highlight.ctaUrl ?? bookTableUrl;
  const ctaLabel = highlight.ctaLabel || bookTableLabel;

  return (
    <div className="mb-8 border border-brand/25 bg-warm-white">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 lg:px-6 py-4 text-left group"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-3 min-w-0">
          {highlight.badge && (
            <span className="text-[9px] tracking-[2px] uppercase font-light text-brand border border-brand/30 px-2 py-1 shrink-0">
              {highlight.badge}
            </span>
          )}
          <span className="font-sans font-light text-[13px] tracking-[1px] uppercase text-dark-stone leading-snug">
            {headerText}
          </span>
        </span>
        <span
          className={cn(
            "shrink-0 text-warm-brown transition-transform duration-300",
            isOpen && "rotate-180",
          )}
        >
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1 1.5L6 6.5L11 1.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="px-5 lg:px-6 pb-6 pt-1 border-t border-border-warm/20">
            {highlight.title && (
              <h3 className="font-newsreader font-medium text-2xl text-dark-stone leading-snug mt-4">
                {highlight.title}
              </h3>
            )}
            {highlight.intro && (
              <p className="text-sm text-warm-brown font-light leading-relaxed mt-2">
                {highlight.intro}
              </p>
            )}

            {highlight.groups && highlight.groups.length > 0 && (
              <div className="mt-5 flex flex-col gap-4">
                {highlight.groups.map((group, gi) => (
                  <div key={group._key ?? gi}>
                    {group.heading && (
                      <h4 className="text-[12px] tracking-[2px] uppercase font-normal text-dark-stone mb-1.5">
                        {group.heading}
                      </h4>
                    )}
                    {group.body && (
                      <p className="text-sm text-warm-brown font-light leading-relaxed">
                        {group.body.split("\n").map((line, li, arr) => (
                          <span key={li}>
                            {line}
                            {li < arr.length - 1 && <br />}
                          </span>
                        ))}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {highlight.price && (
              <p className="font-newsreader font-medium text-3xl text-brand mt-6">
                {highlight.price}
              </p>
            )}
            {highlight.priceNote && (
              <p className="text-[13px] text-warm-brown/80 font-light italic mt-1">
                {highlight.priceNote}
              </p>
            )}

            {ctaHref && (
              <Link
                href={ctaHref}
                className="inline-block mt-5 text-[10px] tracking-[1.5px] uppercase font-light text-brand border-b border-brand/40 pb-px hover:opacity-70 transition-opacity"
              >
                {ctaLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab content renderers ────────────────────────────────────────────────────

function BrunchTab({
  menu,
  bookTableUrl,
  onSwitchToDrinks,
  labels,
}: {
  menu: MenuCard;
  bookTableUrl?: string;
  onSwitchToDrinks: () => void;
  labels: typeof DEFAULT_LABELS;
}) {
  const items = menu.sections?.[0]?.items ?? [];
  const price =
    menu.priceString ?? (menu.price != null ? `${menu.price},-` : null);

  return (
    <div className="py-8 lg:py-10">
      <div className="max-w-2xl mx-auto">
        <div className="bg-warm-white border border-border-warm/40 p-8 lg:p-10 shadow-sm text-center">
          <h2 className="font-newsreader font-medium text-4xl lg:text-5xl text-dark-stone mb-2 leading-none">
            {menu.title}
          </h2>

          {menu.sections?.[0]?.sectionNote && (
            <p className="text-[11px] tracking-[1.5px] uppercase text-warm-brown/95 font-normal mb-6">
              {menu.sections[0].sectionNote}
            </p>
          )}

          {items.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-warm-brown font-light leading-relaxed">
                {items.map((item, i) => (
                  <span key={item._key}>
                    {item.name}
                    {i < items.length - 1 ? " \u2022 " : ""}
                  </span>
                ))}
              </p>
            </div>
          )}

          {menu.menuNote && (
            <p className="text-sm italic text-warm-brown font-light mb-4">
              {menu.menuNote}
            </p>
          )}

          <div className="pt-8 flex flex-col items-center gap-6">
            <div className="flex flex-col items-center">
              <p className="text-[10px] tracking-[1px] uppercase text-dark-stone/50 mb-2">
                {menu.priceLabel || labels.pricePerPerson}
              </p>
              {price && (
                <p className="font-newsreader font-medium text-4xl text-dark-stone leading-none">
                  {price}
                </p>
              )}
            </div>
            <Link
              href={menu.ctaUrl ?? bookTableUrl ?? "#"}
              className="px-10 py-4 text-[11px] tracking-[2px] uppercase font-light text-white bg-brand hover:opacity-90 transition-opacity w-fit"
            >
              {menu.ctaLabel || labels.bookTable}
            </Link>
          </div>
        </div>
        <DrinksCrossLink label={labels.viewDrinks} onSwitch={onSwitchToDrinks} />
      </div>
    </div>
  );
}

function StandardMenuTab({
  menu,
  bookTableUrl,
  onSwitchToDrinks,
  labels,
}: {
  menu: MenuCard;
  bookTableUrl?: string;
  onSwitchToDrinks: () => void;
  labels: typeof DEFAULT_LABELS;
}) {
  return (
    <div className="py-6 lg:py-8 max-w-2xl mx-auto">
      {menu.highlightMenu?.enabled && (
        <HighlightAccordion
          highlight={menu.highlightMenu}
          bookTableUrl={bookTableUrl}
          bookTableLabel={labels.bookTable}
        />
      )}
      {menu.sections?.map((section) => {
        const style = section.displayStyle ?? "list";
        if (style === "featured") {
          return (
            <FeaturedSection
              key={section._key}
              section={section}
              bookTableUrl={bookTableUrl}
              bookTableLabel={labels.bookTable}
            />
          );
        }
        return (
          <div key={section._key} className="mb-6 first:mt-0">
            <SectionHeader
              title={section.sectionTitle}
              note={section.sectionNote}
            />
            {section.items?.map((item) =>
              style === "wine" ? (
                <WineItemRow key={item._key} item={item} />
              ) : (
                <MenuItemRow key={item._key} item={item} />
              ),
            )}
          </div>
        );
      })}
      <DrinksCrossLink label={labels.viewDrinks} onSwitch={onSwitchToDrinks} />
    </div>
  );
}

function BeveragesTab({ menu }: { menu: MenuCard }) {
  return (
    <div className="py-6 lg:py-8 max-w-2xl mx-auto">
      {menu.sections?.map((section) => (
        <div key={section._key} className="mb-6 first:mt-0">
          <SectionHeader
            title={section.sectionTitle}
            note={section.sectionNote}
          />
          {section.items?.map((item) =>
            section.displayStyle === "wine" ? (
              <WineItemRow key={item._key} item={item} />
            ) : (
              <MenuItemRow key={item._key} item={item} />
            ),
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function MenuTabs({
  tabs: providedTabs,
  menus,
  bookTableUrl = "https://dinnerbooking.com/dk/da-DK/eventbooking/event/4155/allegade-10",
  labels: providedLabels,
}: MenuTabsProps) {
  const tabs = providedTabs && providedTabs.length > 0 ? providedTabs : DEFAULT_TABS;
  const labels = { ...DEFAULT_LABELS, ...providedLabels };

  const [activeTab, setActiveTab] = useState<string>(() =>
    getDefaultMenuType(tabs),
  );

  const menusByType = Object.fromEntries(menus.map((m) => [m.menuType, m]));
  const activeMenu = menusByType[activeTab];
  const beveragesMenu = menusByType["beverages"];
  const switchToDrinks = () => setActiveTab("beverages");

  return (
    <div>
      {/* ── Sticky tab bar ────────────────────────────────────────────── */}
      <div className="sticky top-20 z-40 bg-warm-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-16">
          <div className="relative">
            <div className="flex lg:justify-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-b border-border-warm/10">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.menuType;
                return (
                  <button
                    key={tab.menuType}
                    onClick={() => setActiveTab(tab.menuType)}
                    className={cn(
                      "relative flex flex-col items-center px-6 lg:px-8 py-4 shrink-0 transition-all duration-300 focus:outline-none",
                      isActive ? "text-dark-stone" : "text-warm-brown hover:text-dark-stone",
                    )}
                  >
                    <span className="font-sans font-light text-[13px] tracking-[1px] uppercase leading-snug">
                      {tab.label}
                    </span>
                    {tab.servingTime && (
                      <span className="text-[11px] text-warm-brown/95 font-normal mt-0.5 font-sans">
                        {tab.servingTime}
                      </span>
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabUnderline"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-warm-white to-transparent lg:hidden" />
          </div>
        </div>
      </div>

      {/* ── Tab content ───────────────────────────────────────────────── */}
      <div className="bg-warm-white px-6 lg:px-16 min-h-[60vh]">
        {!activeMenu ? (
          <div className="py-24 text-center text-warm-brown/50 font-light text-sm">
            {labels.noContent}
          </div>
        ) : activeTab === "brunch" ? (
          <BrunchTab
            menu={activeMenu}
            bookTableUrl={bookTableUrl}
            onSwitchToDrinks={switchToDrinks}
            labels={labels}
          />
        ) : activeTab === "beverages" ? (
          <BeveragesTab menu={activeMenu} />
        ) : (
          <StandardMenuTab
            menu={activeMenu}
            bookTableUrl={bookTableUrl}
            onSwitchToDrinks={beveragesMenu ? switchToDrinks : () => {}}
            labels={labels}
          />
        )}
      </div>
    </div>
  );
}

