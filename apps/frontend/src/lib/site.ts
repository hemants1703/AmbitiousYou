// Single source of truth for the public site's identity and canonical origin.
//
// Imported by the root layout metadata, the generated sitemap/robots/manifest
// routes, every public page's `metadata`, and the JSON-LD schemas — so the
// domain and brand copy live in exactly one place. The canonical host is the
// www apex (configure an apex -> www redirect at the host/DNS level); override
// per environment via NEXT_PUBLIC_SITE_URL (e.g. preview deployments).

import { brandCopy } from "@/lib/brand";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ambitiousyou.pro";

export const siteConfig = {
  name: brandCopy.name,
  title: `${brandCopy.name} — ${brandCopy.tagline}`,
  description: brandCopy.description,
  url: SITE_URL,
  ogImage: "https://res.cloudinary.com/dej4ks4wd/image/upload/v1781083117/OG_IMAGE_AY.png",
  creator: "@AmbitiousYouHQ",
  keywords: [
    "goal tracking",
    "ambition management",
    "productivity app",
    "goal setting",
    "milestone tracking",
    "task management",
    "personal development",
    "life goals",
    "achievement tracking",
    "progress tracking",
    "AI goal planning",
    "habit tracking",
    "self improvement",
    "goal breakdown",
    "priority management",
  ],
};

/** Resolve a root-relative path to an absolute URL on the canonical origin. */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}
