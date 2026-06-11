import type { NextConfig } from "next";
import path from "path";

const isProd = process.env.NODE_ENV === "production";

/**
 * Static-compatible CSP — no nonces, because nonces would force every page
 * dynamic and break the `force-static` landing surface (the Hobby-tier cost
 * lever). `script-src 'unsafe-inline'` is required for Next's inline
 * bootstrap/flight scripts on static output; acceptable here because the
 * public pages render no user-generated HTML.
 *
 * Vercel Analytics + Speed Insights load and beacon same-origin under
 * /_vercel/* in production — covered by 'self'. In dev, @vercel/analytics
 * swaps to the va.vercel-scripts.com debug script, and React Refresh needs
 * 'unsafe-eval' + a websocket.
 *
 * Rollout: set CSP_REPORT_ONLY=1 on a preview deployment first, click through
 * every page (both themes + login/signup round-trip) with the console open,
 * then unset to enforce.
 */
const csp = [
  "default-src 'self'",
  isProd ? "script-src 'self' 'unsafe-inline'" : "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'", // Next inlines styles; mock/persona colours use style attributes
  "img-src 'self' data: blob: https://res.cloudinary.com", // data: covers the SVG grain in auth-background.css
  "font-src 'self'", // next/font self-hosts
  isProd ? "connect-src 'self'" : "connect-src 'self' ws:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'", // Server Actions POST same-origin
  "object-src 'none'",
  "manifest-src 'self'",
].join("; ");

const cspHeaderKey = process.env.CSP_REPORT_ONLY === "1" ? "Content-Security-Policy-Report-Only" : "Content-Security-Policy";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Transpile the workspace `@ambitiousyou/shared` package's TS source
  // directly. NOTE: this only handles transpilation — module resolution
  // still follows the package's `exports` map, which points at `dist/`.
  // So `next build`'s type-check needs `@ambitiousyou/shared` built first.
  // That's wired via this app's `prebuild` script (see package.json), and
  // Vercel triggers it by running `pnpm build` (see vercel.json) rather
  // than bare `next build`.
  transpilePackages: ["@ambitiousyou/shared"],
  turbopack: {
    root: path.join(__dirname, "../.."),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dej4ks4wd/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: cspHeaderKey, value: csp },
          // No `preload` yet — preload-list inclusion is effectively
          // irreversible; add deliberately once the apex→www setup is final.
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
          // Legacy redundancy for frame-ancestors 'none'
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default nextConfig;
