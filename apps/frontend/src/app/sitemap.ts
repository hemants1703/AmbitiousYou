import type { MetadataRoute } from "next";
import { cacheLife } from "next/cache";
import { indexablePages } from "@/lib/seo/pages";
import { absoluteUrl } from "@/lib/site";

/**
 * Public, indexable routes only — auth/app routes are disallowed in robots.ts
 * and carry noindex metadata. Cached at build / revalidate so Cache Components
 * can prerender without a blocking `new Date()` at request time.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  "use cache";
  cacheLife("days");

  const lastModified = new Date();

  return indexablePages.map((page) => ({
    url: absoluteUrl(page.path),
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
