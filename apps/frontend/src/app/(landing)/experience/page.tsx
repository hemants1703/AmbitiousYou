import ExperienceFlow from "@/components/(landing)/experience/experience-flow";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience - AmbitiousYou | Interactive Demo",
  description: "Discover how AmbitiousYou transforms your goals into reality. Choose your journey, interact with real features, and create an ambition that's waiting for you.",
  openGraph: {
    title: "Experience - AmbitiousYou | Interactive Demo",
    description: "Discover how AmbitiousYou transforms your goals into reality. Choose your journey, interact with real features, and create an ambition that's waiting for you.",
    url: "https://www.ambitiousyou.com/experience",
    siteName: "AmbitiousYou",
    images: [
      {
        url: "https://www.ambitiousyou.com/og-image.png",
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
    title: "Experience - AmbitiousYou | Interactive Demo",
    description: "Discover how AmbitiousYou transforms your goals into reality. Choose your journey, interact with real features, and create an ambition that's waiting for you.",
    images: ["https://www.ambitiousyou.com/og-image.png"],
  },
};

export default function ExperiencePage() {
  return <ExperienceFlow />;
}
