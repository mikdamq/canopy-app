import type { MetadataRoute } from "next";
import { baseUrl } from "@/lib/site";

// Search engines and AI assistants are all welcome to read the site (so Lamina can show up
// in their answers); only the form's API is off limits.
const AI_CRAWLERS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Google-Extended", "Applebot-Extended", "Bingbot"];

export default function robots(): MetadataRoute.Robots {
  const base = baseUrl();
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: ["/api/"] },
    ],
    sitemap: new URL("/sitemap.xml", base).href,
    host: base.origin,
  };
}
