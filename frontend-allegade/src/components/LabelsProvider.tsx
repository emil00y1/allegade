"use client";

import { createContext, useContext, type ReactNode } from "react";
import { UI_LABELS_DEFAULTS, type UiLabels } from "@/i18n/labels";

/**
 * Makes the locale's UI microcopy available to client components via
 * `useLabels()`. The provider is mounted once in the root layout with the
 * already-translated labels; components read what they need without prop
 * threading. Falls back to the Danish defaults if used outside a provider.
 */
const LabelsContext = createContext<UiLabels>(UI_LABELS_DEFAULTS);

export function LabelsProvider({
  value,
  children,
}: {
  value: UiLabels;
  children: ReactNode;
}) {
  return (
    <LabelsContext.Provider value={value}>{children}</LabelsContext.Provider>
  );
}

export function useLabels(): UiLabels {
  return useContext(LabelsContext);
}
