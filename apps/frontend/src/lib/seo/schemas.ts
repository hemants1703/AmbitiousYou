import { siteConfig, absoluteUrl } from "@/lib/site";

// JSON-LD structured-data factories. All copy/identity is derived from
// `siteConfig` so the schemas can never drift from the rest of the metadata.
// Rendered via <JsonLd> (src/components/seo/json-ld.tsx).

export type JsonLdSchema = Record<string, unknown>;

export interface FaqItem {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export const softwareFeatureList = [
  "Ambition-based goal structure with tasks and milestones",
  "Automatic progress recalculation",
  "Momentum charts over 7, 14, and 30 days",
  "Year-long contribution calendar",
  "Honest day-streak tracking",
  "Priority management and colour coding",
  "Private notes per ambition",
  "Dashboard insights and activity feed",
] as const;

export function organizationSchema(): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: siteConfig.name,
    url: siteConfig.url,
    logo: siteConfig.ogImage,
    description: siteConfig.description,
    sameAs: [
      "https://x.com/AmbitiousYouHQ",
      "https://github.com/hemants1703/AmbitiousYou",
      "https://linkedin.com/in/hemants1703",
      "https://bsky.app/profile/hemantsharma.tech",
    ],
  };
}

export function webSiteSchema(): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: { "@id": absoluteUrl("/#organization") },
  };
}

export function softwareApplicationSchema(): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    applicationCategory: "ProductivityApplication",
    operatingSystem: "Web",
    isAccessibleForFree: true,
    featureList: [...softwareFeatureList],
    screenshot: siteConfig.ogImage,
    author: { "@id": absoluteUrl("/#organization") },
    creator: { "@id": absoluteUrl("/#organization") },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

export interface WebPageSchemaOptions {
  title: string;
  description: string;
  path: string;
}

export function webPageSchema(options: WebPageSchemaOptions): JsonLdSchema {
  const url = absoluteUrl(options.path);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    name: options.title,
    description: options.description,
    url,
    isPartOf: { "@id": absoluteUrl("/#website") },
    about: { "@id": absoluteUrl("/#organization") },
  };
}

export function faqPageSchema(faqs: readonly FaqItem[]): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function breadcrumbSchema(items: readonly BreadcrumbItem[]): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export interface ItemListSchemaOptions {
  name: string;
  items: readonly string[];
}

export function itemListSchema(options: ItemListSchemaOptions): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: options.name,
    itemListElement: options.items.map((name, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
    })),
  };
}
