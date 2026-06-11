import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

/**
 * Basic PWA manifest. Icons reference only assets that exist on disk; add
 * 192x192 and 512x512 PNGs later for full installability.
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
      { src: "/svg_logos/logo_150px.svg", sizes: "150x150", type: "image/svg+xml" },
      { src: "/svg_logos/logo_250px.svg", sizes: "250x250", type: "image/svg+xml" },
      { src: "/png_logos/favicon_32px.png", sizes: "32x32", type: "image/png" },
      { src: "/png_logos/favicon_16px.png", sizes: "16x16", type: "image/png" },
      { src: "/png_logos/logo_150px.png", sizes: "150x150", type: "image/png" },
      { src: "/png_logos/logo_250px.png", sizes: "250x250", type: "image/png" },
    ],
  };
}
