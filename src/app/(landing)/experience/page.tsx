import ExperienceFlow from "@/features/(landing)/experience/ExperienceFlow";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience AmbitiousYou | Interactive Demo",
  description:
    "Discover how AmbitiousYou transforms your goals into reality. Choose your journey, interact with real features, and create an ambition that's waiting for you.",
  openGraph: {
    title: "Experience AmbitiousYou | Interactive Demo",
    description:
      "See yourself in action. Explore how ambitious professionals, students, entrepreneurs, and more achieve their goals with AmbitiousYou.",
    type: "website",
  },
};

export default function ExperiencePage() {
  return <ExperienceFlow />;
}
