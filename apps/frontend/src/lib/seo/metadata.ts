import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site";

export interface CreatePageMetadataOptions {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
  ogImageAlt?: string;
}

const googleBotIndexable = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large" as const,
    "max-snippet": -1,
  },
};

const googleBotNoIndex = {
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false,
  },
};

/** Build consistent page metadata from `siteConfig` — canonical, OG, Twitter, robots. */
export function createPageMetadata(options: CreatePageMetadataOptions): Metadata {
  const { title, description, path, keywords, noIndex = false, ogImageAlt } = options;
  const url = absoluteUrl(path);
  const imageAlt = ogImageAlt ?? title;

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    robots: noIndex ? googleBotNoIndex : googleBotIndexable,
    alternates: noIndex ? undefined : { canonical: path },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: imageAlt,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteConfig.ogImage],
      creator: siteConfig.creator,
      site: siteConfig.creator,
    },
  };
}

/** Metadata for authenticated app routes — never indexed. */
export function createPrivateMetadata(title: string, description?: string): Metadata {
  return {
    title,
    ...(description ? { description } : {}),
    robots: googleBotNoIndex,
  };
}

/** Root layout defaults — homepage canonical and global indexing. */
export function createRootMetadata(): Metadata {
  const verification: Metadata["verification"] = {};
  if (process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION) {
    verification.google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
  }
  if (process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION) {
    verification.other = {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
    };
  }

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      template: `%s | ${siteConfig.name}`,
      default: siteConfig.title,
    },
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    robots: googleBotIndexable,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      siteName: siteConfig.name,
      title: siteConfig.title,
      description: siteConfig.description,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 675,
          alt: siteConfig.title,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.title,
      description: siteConfig.description,
      images: [siteConfig.ogImage],
      creator: siteConfig.creator,
      site: siteConfig.creator,
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/svg_logos/favicon_32px.svg", type: "image/svg+xml" },
        { url: "/svg_logos/favicon_16px.svg", type: "image/svg+xml" },
        { url: "/png_logos/favicon_32px.png", type: "image/png", sizes: "32x32" },
        { url: "/png_logos/favicon_16px.png", type: "image/png", sizes: "16x16" },
        { url: "/png_logos/icon_192.png", type: "image/png", sizes: "192x192" },
        { url: "/png_logos/icon_512.png", type: "image/png", sizes: "512x512" },
      ],
      shortcut: "/favicon.ico",
    },
    appleWebApp: {
      capable: true,
      title: siteConfig.name,
      statusBarStyle: "default",
    },
    formatDetection: { telephone: false },
    category: "productivity",
    ...(Object.keys(verification).length > 0 ? { verification } : {}),
  };
}
