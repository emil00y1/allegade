"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DEFAULT_LOCALE,
  LOCALES,
  localeFromPathname,
  localizePath,
} from "@/i18n/config";
import { cn } from "@/lib/utils";

/**
 * Switches between the language variants of the *current* page. It keeps the
 * pathname and only swaps the locale prefix, so `/en/hotel` ⇄ `/hotel`.
 */
export default function LanguageSwitcher({ className }: { className?: string }) {
  const pathname = usePathname() || "/";
  const current = localeFromPathname(pathname) ?? DEFAULT_LOCALE;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {LOCALES.map((locale, i) => {
        const active = locale.code === current;
        return (
          <span key={locale.code} className="flex items-center gap-2">
            {i > 0 && <span className="text-current/30">/</span>}
            <Link
              href={localizePath(pathname, locale.code)}
              hrefLang={locale.htmlLang}
              aria-current={active ? "true" : undefined}
              className={cn(
                "text-[11px] tracking-[1.2px] uppercase font-light transition-opacity hover:opacity-100",
                active ? "opacity-100" : "opacity-50",
              )}
            >
              {locale.code.toUpperCase()}
            </Link>
          </span>
        );
      })}
    </div>
  );
}
