import { createOgImageResponse, ogImageContentType, ogImageSize } from "@/lib/seo/og-image";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function OgImage() {
  return createOgImageResponse({
    title: "The Ambitious Ones",
    subtitle: "A manifesto for people who think in ambitions, not errands.",
  });
}
