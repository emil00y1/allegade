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
  async redirects() {
    return [
      // Event cards used to link to /events/:slug, which was never a route.
      // Keep those links (and anything already shared) working.
      { source: "/events", destination: "/begivenheder", permanent: true },
      {
        source: "/events/:slug",
        destination: "/begivenheder/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
