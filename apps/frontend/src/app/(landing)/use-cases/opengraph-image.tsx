import { createOgImageResponse, ogImageContentType, ogImageSize } from "@/lib/seo/og-image";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function OgImage() {
  return createOgImageResponse({
    title: "Use Cases",
    subtitle: "Goal tracking for students, professionals, founders, and personal growth.",
  });
}
