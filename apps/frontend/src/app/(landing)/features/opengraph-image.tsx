import { createOgImageResponse, ogImageContentType, ogImageSize } from "@/lib/seo/og-image";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function OgImage() {
  return createOgImageResponse({
    title: "Features",
    subtitle: "Momentum tracking, streaks, and a dashboard that turns every move into visible progress.",
  });
}
