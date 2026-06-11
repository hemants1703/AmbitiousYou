import LandingSection from "../landing-section";
import PreviewAmbitionCard, { type PreviewAmbition } from "./preview-ambition-card";

const outcomes: PreviewAmbition[] = [
  {
    name: "Land the promotion",
    color: "#00bfff",
    progress: 70,
    priority: "high",
    due: "Dec 18, 2026",
    definition: "Turn a fuzzy ‘grow my career’ into clear milestones you tick off, one quarter at a time.",
  },
  {
    name: "Finish the creative project",
    color: "#32cd32",
    progress: 55,
    priority: "medium",
    due: "Apr 2, 2027",
    definition: "Break a daunting first draft into the pages you actually write today, instead of someday.",
  },
  {
    name: "Train for the big race",
    color: "#ff7733",
    progress: 80,
    priority: "high",
    due: "Oct 12, 2026",
    definition: "Go from ‘I should run’ to a plan you can see yourself finishing, week by week.",
  },
];

export default function Outcomes() {
  return (
    <LandingSection eyebrow="Made for real goals" title="Whatever you’re working toward, it fits here" lede="From career moves to creative projects to big races — a few of the goals AmbitiousYou is built to help you finish.">
      <div aria-hidden="true" className="lp-reveal grid grid-cols-1 gap-5 md:grid-cols-3">
        {outcomes.map((outcome) => (
          <PreviewAmbitionCard key={outcome.name} ambition={outcome} />
        ))}
      </div>
      <ul className="sr-only">
        {outcomes.map((outcome) => (
          <li key={outcome.name}>
            {outcome.name} — {outcome.definition}
          </li>
        ))}
      </ul>
    </LandingSection>
  );
}
