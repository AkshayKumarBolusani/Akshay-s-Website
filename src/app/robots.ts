import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/private/"],
      },
      {
        userAgent: "GPTBot",
        allow: ["/", "/blog/", "/project/"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: ["/", "/blog/", "/project/"],
      },
      {
        userAgent: "Google-Extended",
        allow: ["/", "/blog/", "/project/"],
      },
      {
        userAgent: "Anthropic-AI",
        allow: ["/", "/blog/", "/project/"],
      },
      {
        userAgent: "Claude-Web",
        allow: ["/", "/blog/", "/project/"],
      },
      {
        userAgent: "CCBot",
        allow: ["/", "/blog/", "/project/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: ["/", "/blog/", "/project/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
      },
      {
        userAgent: "Bingbot",
        allow: "/",
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
