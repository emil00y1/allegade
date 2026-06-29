import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/b0bkhf04/**",
      },
    ],
  },
  // The committed translation JSON is read from disk at request time by
  // getTranslated(). Make sure those files are traced into every serverless
  // function bundle (Vercel) so they exist at runtime.
  outputFileTracingIncludes: {
    "/**": ["./content/translations/**"],
  },
};

export default nextConfig;
