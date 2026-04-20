import { BetaAnalyticsDataClient } from "@google-analytics/data";
import type {
  AnalyticsRange,
  AnalyticsTotals,
  DailyPoint,
  TopPage,
} from "./types";
import { getGoogleAuth } from "./auth";

let cachedClient: BetaAnalyticsDataClient | null = null;

function getClient(): BetaAnalyticsDataClient {
  if (cachedClient) return cachedClient;
  const auth = getGoogleAuth();
  cachedClient = new BetaAnalyticsDataClient({ authClient: auth });
  return cachedClient;
}

function normalizeProperty(raw: string): string {
  return raw.startsWith("properties/") ? raw : `properties/${raw}`;
}

function rangeToDays(range: AnalyticsRange): number {
  return range === "30d" ? 30 : 7;
}

function toNumber(value: string | null | undefined): number {
  if (value == null) return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function formatDate(yyyymmdd: string): string {
  if (yyyymmdd.length !== 8) return yyyymmdd;
  return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`;
}

export interface GA4Result {
  totals: AnalyticsTotals;
  daily: DailyPoint[];
  topPages: TopPage[];
  timezone: string;
}

export async function fetchGA4(range: AnalyticsRange): Promise<GA4Result> {
  const propertyRaw = process.env.GOOGLE_GA4_PROPERTY_ID;
  if (!propertyRaw) {
    throw new Error("Missing GOOGLE_GA4_PROPERTY_ID");
  }
  const property = normalizeProperty(propertyRaw);
  const days = rangeToDays(range);
  const client = getClient();

  const startDate = `${days - 1}daysAgo`;
  const endDate = "today";

  const [dailyReport, topPagesReport] = await Promise.all([
    client.runReport({
      property,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "date" }],
      metrics: [
        { name: "sessions" },
        { name: "totalUsers" },
        { name: "screenPageViews" },
        { name: "averageSessionDuration" },
      ],
      orderBys: [{ dimension: { dimensionName: "date" }, desc: false }],
    }),
    client.runReport({
      property,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
      metrics: [{ name: "screenPageViews" }, { name: "sessions" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 10,
    }),
  ]);

  const [dailyResponse] = dailyReport;
  const [topPagesResponse] = topPagesReport;

  const daily: DailyPoint[] = [];
  let totalSessions = 0;
  let totalUsers = 0;
  let totalPageviews = 0;
  let weightedDurationSum = 0;

  for (const row of dailyResponse.rows ?? []) {
    const rawDate = row.dimensionValues?.[0]?.value ?? "";
    const sessions = toNumber(row.metricValues?.[0]?.value);
    const users = toNumber(row.metricValues?.[1]?.value);
    const pageviews = toNumber(row.metricValues?.[2]?.value);
    const avgDuration = toNumber(row.metricValues?.[3]?.value);

    daily.push({
      date: formatDate(rawDate),
      sessions,
      users,
    });

    totalSessions += sessions;
    totalUsers += users;
    totalPageviews += pageviews;
    weightedDurationSum += avgDuration * sessions;
  }

  const avgSessionDurationSec =
    totalSessions > 0 ? weightedDurationSum / totalSessions : 0;

  const topPages: TopPage[] = (topPagesResponse.rows ?? []).map((row) => ({
    path: row.dimensionValues?.[0]?.value ?? "",
    title: row.dimensionValues?.[1]?.value ?? "",
    pageviews: toNumber(row.metricValues?.[0]?.value),
    sessions: toNumber(row.metricValues?.[1]?.value),
  }));

  return {
    totals: {
      sessions: totalSessions,
      users: totalUsers,
      pageviews: totalPageviews,
      avgSessionDurationSec,
    },
    daily,
    topPages,
    timezone: dailyResponse.metadata?.timeZone ?? "UTC",
  };
}
