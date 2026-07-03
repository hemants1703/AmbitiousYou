import { createOgImageResponse, ogImageContentType, ogImageSize } from "@/lib/seo/og-image";
import { siteConfig } from "@/lib/site";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function TwitterImage() {
  return createOgImageResponse({
    title: "Where ambitious goals become inevitable outcomes",
    subtitle: siteConfig.description,
  });
}
