import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/**
 * Public, indexable routes only — the auth/app routes are disallowed in
 * robots.ts. Generated at build time on the canonical (www) origin.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/features"), lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/experience"), lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/privacy-policy"), lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/terms-and-conditions"), lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
