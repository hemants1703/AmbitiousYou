import { createOgImageResponse, ogImageContentType, ogImageSize } from "@/lib/seo/og-image";

export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function OgImage() {
  return createOgImageResponse({
    title: "Privacy Policy",
    subtitle: "How AmbitiousYou collects, uses, and protects your data.",
  });
}
