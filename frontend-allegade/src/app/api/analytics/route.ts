import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { fetchGA4 } from "@/lib/analytics/ga4";
import { fetchSearchConsole } from "@/lib/analytics/gsc";
import { buildCorsHeaders, resolveAllowedOrigin } from "@/lib/analytics/cors";
import type {
  AnalyticsErrorCode,
  AnalyticsRange,
  AnalyticsResponse,
} from "@/lib/analytics/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const MEMO_TTL_MS = 60_000;
type MemoEntry = { at: number; data: AnalyticsResponse };
const memo = new Map<AnalyticsRange, MemoEntry>();

function parseRange(value: string | null): AnalyticsRange {
  return value === "30d" ? "30d" : "7d";
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function errorResponse(
  message: string,
  code: AnalyticsErrorCode,
  status: number,
  corsHeaders: Record<string, string> | null,
): NextResponse {
  return NextResponse.json(
    { error: message, code },
    { status, headers: corsHeaders ?? undefined },
  );
}

export async function OPTIONS(req: NextRequest): Promise<NextResponse> {
  const origin = resolveAllowedOrigin(req.headers.get("origin"));
  if (!origin) {
    return new NextResponse(null, { status: 403 });
  }
  return new NextResponse(null, {
    status: 204,
    headers: buildCorsHeaders(origin),
  });
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const origin = resolveAllowedOrigin(req.headers.get("origin"));
  const corsHeaders = origin ? buildCorsHeaders(origin) : null;

  if (!origin) {
    return errorResponse("Origin not allowed", "forbidden_origin", 403, null);
  }

  const secret = process.env.ANALYTICS_API_SECRET;
  const provided = req.headers.get("x-api-key");
  if (!secret || !provided || !safeEqual(secret, provided)) {
    return errorResponse("Invalid API key", "unauthorized", 401, corsHeaders);
  }

  const range = parseRange(req.nextUrl.searchParams.get("range"));

  const cached = memo.get(range);
  if (cached && Date.now() - cached.at < MEMO_TTL_MS) {
    return NextResponse.json(cached.data, {
      headers: {
        ...corsHeaders,
        "Cache-Control": "private, max-age=60",
      },
    });
  }

  try {
    const [ga4, searchConsole] = await Promise.all([
      fetchGA4(range),
      fetchSearchConsole(),
    ]);

    const payload: AnalyticsResponse = {
      range,
      generatedAt: new Date().toISOString(),
      timezone: ga4.timezone,
      totals: ga4.totals,
      daily: ga4.daily,
      topPages: ga4.topPages,
      searchConsole,
    };

    memo.set(range, { at: Date.now(), data: payload });

    return NextResponse.json(payload, {
      headers: {
        ...corsHeaders,
        "Cache-Control": "private, max-age=60",
      },
    });
  } catch (err) {
    console.error("Analytics upstream error:", err);
    return errorResponse(
      "Failed to fetch analytics data",
      "upstream",
      502,
      corsHeaders,
    );
  }
}
