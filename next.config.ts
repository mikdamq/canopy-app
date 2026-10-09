import type { NextConfig } from "next";

/** Basic security headers on every response. Set here, not in a host's config, so they work on any host. */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  // The live site runs as a Node.js app on cPanel: `STANDALONE=1 pnpm build` makes a
  // self-contained server (.next/standalone) to upload. Netlify staging builds normally.
  output: process.env.STANDALONE === "1" ? "standalone" : undefined,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
