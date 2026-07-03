import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/**
 * Allow the public marketing pages; keep authenticated app, auth, and API
 * routes out of the index. Points crawlers at the generated sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard",
        "/ambitions",
        "/settings",
        "/login",
        "/signup",
        "/forgot-password",
        "/reset-password",
        "/verify-email",
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
