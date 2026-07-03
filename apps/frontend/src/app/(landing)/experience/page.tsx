import nextDynamic from "next/dynamic";
import ExperienceSkeleton from "@/components/(landing)/experience/experience-skeleton";
import JsonLd from "@/components/seo/json-ld";
import { createPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo/schemas";
import type { Metadata } from "next";

const ExperienceFlow = nextDynamic(() => import("@/components/(landing)/experience/experience-flow"), {
  loading: () => <ExperienceSkeleton />,
});

export const dynamic = "force-static";

const title = "Experience";
const description =
  "Discover how AmbitiousYou transforms your goals into reality. Choose your journey, interact with real features, and create an ambition that's waiting for you.";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path: "/experience",
  ogImageAlt: "Experience AmbitiousYou - Interactive Demo",
});

export default function ExperiencePage() {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ title, description, path: "/experience" }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Experience", path: "/experience" },
          ]),
        ]}
      />
      <ExperienceFlow />
    </>
  );
}
