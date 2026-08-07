import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

const privatePaths = [
  "/api/",
  "/dashboard",
  "/ambitions",
  "/settings",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

/** Citation / search AI bots — allow public marketing pages so engines can cite us. */
const aiCitationBots = [
  "GPTBot",
  "ChatGPT-User",
  "PerplexityBot",
  "ClaudeBot",
  "anthropic-ai",
  "Google-Extended",
  "Bingbot",
] as const;

/**
 * Allow the public marketing pages; keep authenticated app, auth, and API
 * routes out of the index. Explicitly permits AI citation crawlers; blocks
 * Common Crawl training-only bot as a middle ground.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: privatePaths,
      },
      ...aiCitationBots.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: privatePaths,
      })),
      {
        userAgent: "CCBot",
        disallow: ["/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
