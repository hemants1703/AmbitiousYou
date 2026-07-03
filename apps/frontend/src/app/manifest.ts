import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

/**
 * PWA manifest. PNG icons are generated at build time via scripts/generate-icons.mjs.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "AmbitiousYou",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { src: "/svg_logos/favicon_32px.svg", sizes: "32x32", type: "image/svg+xml" },
      { src: "/svg_logos/favicon_16px.svg", sizes: "16x16", type: "image/svg+xml" },
      { src: "/png_logos/favicon_32px.png", sizes: "32x32", type: "image/png" },
      { src: "/png_logos/favicon_16px.png", sizes: "16x16", type: "image/png" },
      { src: "/png_logos/icon_192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/png_logos/icon_512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
