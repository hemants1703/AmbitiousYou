import { createOgImageResponse, ogImageContentType, ogImageSize } from "@/lib/seo/og-image";
import { getGuideContent, guideSlugs } from "@/lib/seo/guide-content";

export const size = ogImageSize;
export const contentType = ogImageContentType;

export function generateStaticParams() {
  return guideSlugs.map((slug) => ({ slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function OgImage(props: Props) {
  const { slug } = await props.params;
  const content = getGuideContent(slug);

  return createOgImageResponse({
    title: content?.title ?? "Guide",
    subtitle: content?.summary ?? "Practical ambition management guidance.",
  });
}
