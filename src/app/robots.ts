import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Open to search engines AND AI/answer-engine crawlers: this is a public portfolio and
// being cited accurately by ChatGPT, Claude, Perplexity and Gemini is a goal (GEO).
const AI_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Do NOT block /_next/: Google needs the JS/CSS to render the page.
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      { userAgent: AI_BOTS, allow: "/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
