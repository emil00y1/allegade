"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { StandardMenuTab, DEFAULT_LABELS, type MenuCard } from "@/components/MenuTabs";

interface SelskabsmenuerTabsProps {
  menus: MenuCard[];
  bookTableUrl?: string;
  labels?: typeof DEFAULT_LABELS;
}

export default function SelskabsmenuerTabs({
  menus,
  bookTableUrl,
  labels = DEFAULT_LABELS,
}: SelskabsmenuerTabsProps) {
  const [activeId, setActiveId] = useState<string>(menus[0]?._id ?? "");
  const activeMenu = menus.find((m) => m._id === activeId) ?? menus[0];

  if (!activeMenu) return null;

  return (
    <div>
      {/* ── Sticky tab bar ────────────────────────────────────────────── */}
      <div className="sticky top-20 z-40 bg-warm-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-16">
          <div className="relative">
            <div className="flex lg:justify-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-b border-border-warm/10">
              {menus.map((menu) => {
                const isActive = activeMenu._id === menu._id;
                return (
                  <button
                    key={menu._id}
                    onClick={() => setActiveId(menu._id)}
                    className={cn(
                      "relative flex flex-col items-center px-6 lg:px-8 py-4 shrink-0 transition-all duration-300 focus:outline-none",
                      isActive ? "text-dark-stone" : "text-warm-brown hover:text-dark-stone",
                    )}
                  >
                    <span className="font-sans font-light text-[13px] tracking-[1px] uppercase leading-snug whitespace-nowrap">
                      {menu.title}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="selskabsmenuerActiveTabUnderline"
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
        <div className="max-w-2xl mx-auto border-t border-border-warm/20 pt-8">
          <h2 className="font-newsreader font-medium text-2xl lg:text-3xl text-dark-stone leading-snug mb-1 text-center">
            {activeMenu.title}
          </h2>
          {activeMenu.intro && (
            <p className="text-sm italic text-warm-brown/95 font-light mb-4 text-center">
              {activeMenu.intro}
            </p>
          )}
          <StandardMenuTab
            menu={activeMenu}
            bookTableUrl={bookTableUrl}
            labels={labels}
            showHighlightMenu={false}
          />
        </div>
      </div>
    </div>
  );
}
