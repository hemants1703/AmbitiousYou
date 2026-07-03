import type { MetadataRoute } from "next";
import { indexablePages } from "@/lib/seo/pages";
import { absoluteUrl } from "@/lib/site";

/**
 * Public, indexable routes only — auth/app routes are disallowed in robots.ts
 * and carry noindex metadata. Generated at build time on the canonical origin.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return indexablePages.map((page) => ({
    url: absoluteUrl(page.path),
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
