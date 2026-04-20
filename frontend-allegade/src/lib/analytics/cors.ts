function parseAllowedOrigins(): string[] {
  const raw = process.env.ANALYTICS_ALLOWED_ORIGINS ?? "";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function resolveAllowedOrigin(origin: string | null): string | null {
  if (!origin) return null;
  const allowed = parseAllowedOrigins();
  return allowed.includes(origin) ? origin : null;
}

export function buildCorsHeaders(origin: string): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, x-api-key",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}
