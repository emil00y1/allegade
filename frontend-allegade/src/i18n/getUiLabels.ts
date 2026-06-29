/**
 * Server helper: load the UI microcopy for a locale.
 *
 * Fetches the `uiLabels` singleton, overlays the locale's translations, and
 * fills any missing field from the Danish DEFAULTS so a label is never empty.
 * Wrapped in React `cache()` so multiple components in one render share a single
 * fetch.
 */
import "server-only";
import { cache } from "react";
import { sanityFetch } from "@/sanity/lib/live";
import { getTranslated } from "./getTranslated";
import { UI_LABELS_DEFAULTS, UI_LABELS_QUERY, type UiLabels } from "./labels";

export const getUiLabels = cache(async (locale: string): Promise<UiLabels> => {
  const { data } = await sanityFetch({ query: UI_LABELS_QUERY });
  const translated = getTranslated(
    data as (Partial<UiLabels> & { _id?: string }) | null,
    locale,
  );
  return { ...UI_LABELS_DEFAULTS, ...(translated ?? {}) };
});
