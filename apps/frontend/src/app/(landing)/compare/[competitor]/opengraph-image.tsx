import { createOgImageResponse, ogImageContentType, ogImageSize } from "@/lib/seo/og-image";
import { getCompareContent } from "@/lib/seo/compare-content";
import { compareSlugs } from "@/lib/seo/pages";

export const size = ogImageSize;
export const contentType = ogImageContentType;

export function generateStaticParams() {
  return compareSlugs.map((competitor) => ({ competitor }));
}

interface Props {
  params: Promise<{ competitor: string }>;
}

export default async function OgImage(props: Props) {
  const { competitor } = await props.params;
  const content = getCompareContent(competitor);

  return createOgImageResponse({
    title: content?.title ?? "Compare",
    subtitle: content?.summary ?? "Honest comparisons for long-term goal tracking.",
  });
}
