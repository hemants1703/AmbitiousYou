import { createOgImageResponse, ogImageContentType, ogImageSize } from "@/lib/seo/og-image";
import { useCaseSlugs } from "@/lib/seo/pages";
import { getUseCaseContent } from "@/lib/seo/use-case-content";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const dynamic = "force-static";

export function generateStaticParams() {
  return useCaseSlugs.map((slug) => ({ slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function OgImage(props: Props) {
  const { slug } = await props.params;
  const content = getUseCaseContent(slug);

  return createOgImageResponse({
    title: content?.title ?? "Use cases",
    subtitle: content?.description ?? "How different people use AmbitiousYou for their goals.",
  });
}
