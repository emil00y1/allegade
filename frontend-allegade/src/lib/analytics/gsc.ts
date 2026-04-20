import { google } from "googleapis";
import type { SearchConsoleBlock, TopQuery } from "./types";
import { getGoogleAuth } from "./auth";

const WINDOW_DAYS = 28 as const;

function daysAgoISO(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

export async function fetchSearchConsole(): Promise<SearchConsoleBlock> {
  const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL;
  if (!siteUrl) {
    throw new Error("Missing GOOGLE_SEARCH_CONSOLE_SITE_URL");
  }

  const auth = getGoogleAuth();
  const webmasters = google.webmasters({ version: "v3", auth });

  const endDate = daysAgoISO(1);
  const startDate = daysAgoISO(WINDOW_DAYS);

  const res = await webmasters.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ["query"],
      rowLimit: 10,
    },
  });

  const topQueries: TopQuery[] = (res.data.rows ?? []).map((row) => ({
    query: row.keys?.[0] ?? "",
    clicks: row.clicks ?? 0,
    impressions: row.impressions ?? 0,
    ctr: row.ctr ?? 0,
    position: row.position ?? 0,
  }));

  return {
    siteUrl,
    windowDays: WINDOW_DAYS,
    topQueries,
  };
}
