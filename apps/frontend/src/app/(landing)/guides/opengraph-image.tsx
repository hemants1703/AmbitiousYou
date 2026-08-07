import { createOgImageResponse, ogImageContentType, ogImageSize } from "@/lib/seo/og-image";

export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function OgImage() {
  return createOgImageResponse({
    title: "Guides",
    subtitle: "Ambition management, long-term goals, and honest momentum — explained clearly.",
  });
}
