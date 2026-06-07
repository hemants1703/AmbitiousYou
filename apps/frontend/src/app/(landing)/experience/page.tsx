import ExperienceFlow from "@/components/(landing)/experience/experience-flow";
import { Metadata } from "next";
import JsonLd from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const dynamic = "force-static";

const title = "Experience - AmbitiousYou | Interactive Demo";
const description = "Discover how AmbitiousYou transforms your goals into reality. Choose your journey, interact with real features, and create an ambition that's waiting for you.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/experience" },
  openGraph: {
    title,
    description,
    url: absoluteUrl("/experience"),
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Experience AmbitiousYou - Interactive Demo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [siteConfig.ogImage],
  },
};

export default function ExperiencePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Experience", path: "/experience" },
        ])}
      />
      <ExperienceFlow />
    </>
  );
}
