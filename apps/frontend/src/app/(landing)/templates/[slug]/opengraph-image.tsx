import { createOgImageResponse, ogImageContentType, ogImageSize } from "@/lib/seo/og-image";
import { templateSlugs } from "@/lib/seo/pages";
import { getAmbitionTemplate } from "@/lib/seo/template-content";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const dynamic = "force-static";

export function generateStaticParams() {
  return templateSlugs.map((slug) => ({ slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function OgImage(props: Props) {
  const { slug } = await props.params;
  const template = getAmbitionTemplate(slug);

  return createOgImageResponse({
    title: template?.title ?? "Templates",
    subtitle: template?.description ?? "Ready-made ambition structures to start faster.",
  });
}
