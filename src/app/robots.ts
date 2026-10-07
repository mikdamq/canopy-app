import type { MetadataRoute } from "next";
import { baseUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = baseUrl();
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: new URL("/sitemap.xml", base).href,
  };
}
