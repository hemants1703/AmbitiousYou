import { createOgImageResponse, ogImageContentType, ogImageSize } from "@/lib/seo/og-image";

export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function OgImage() {
  return createOgImageResponse({
    title: "Pricing",
    subtitle: "Free for a limited time. Create your account today.",
  });
}
