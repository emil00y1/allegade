import { JWT } from "google-auth-library";

const SCOPES = [
  "https://www.googleapis.com/auth/analytics.readonly",
  "https://www.googleapis.com/auth/webmasters.readonly",
];

let cached: JWT | null = null;

export function getGoogleAuth(): JWT {
  if (cached) return cached;

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (!email || !rawKey) {
    throw new Error(
      "Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY",
    );
  }

  const key = rawKey.replace(/\\n/g, "\n");

  cached = new JWT({
    email,
    key,
    scopes: SCOPES,
  });

  return cached;
}
