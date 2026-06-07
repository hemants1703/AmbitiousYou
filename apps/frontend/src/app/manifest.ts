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
      { src: "/svg_logos/favicon_32px.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
