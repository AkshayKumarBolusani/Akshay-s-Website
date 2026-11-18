import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  poweredByHeader: false,
  compress: true,
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
        {
          key: "X-XSS-Protection",
          value: "1; mode=block",
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
      ],
    },
    // Cache rules are production-only. In dev they made the browser keep stale JS chunks for a year.
    ...(isProd
      ? [
          {
            // Next.js content-hashes everything under /_next/static, so it can be cached forever.
            source: "/_next/static/(.*)",
            headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
          },
          {
            // Files in /public keep the same name when you replace them (photos, icons, OG image),
            // so cache for a day and let browsers refresh in the background.
            source: "/(.*)\\.(jpg|jpeg|png|gif|webp|avif|svg)",
            headers: [
              { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
            ],
          },
        ]
      : []),
    {
      source: "/llms.txt",
      headers: [
        {
          key: "Content-Type",
          value: "text/plain; charset=utf-8",
        },
        {
          key: "Cache-Control",
          value: "public, max-age=86400",
        },
      ],
    },
    {
      source: "/humans.txt",
      headers: [
        {
          key: "Content-Type",
          value: "text/plain; charset=utf-8",
        },
        {
          key: "Cache-Control",
          value: "public, max-age=86400",
        },
      ],
    },
    {
      source: "/.well-known/(.*)",
      headers: [
        {
          key: "Content-Type",
          value: "text/plain; charset=utf-8",
        },
        {
          key: "Cache-Control",
          value: "public, max-age=86400",
        },
      ],
    },
  ],
  redirects: async () => [
    {
      source: "/security.txt",
      destination: "/.well-known/security.txt",
      permanent: true,
    },
  ],
};

export default nextConfig;
