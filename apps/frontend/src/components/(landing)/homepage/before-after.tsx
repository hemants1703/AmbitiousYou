import LandingSection from "../landing-section";
import ComparisonLedger from "../comparison-ledger";

const withoutPoints = [
  "Goals live in your head and a dozen half-used apps.",
  "Nothing happens unless motivation decides to show up.",
  "Every Monday is another fresh restart from zero.",
  "Progress is invisible, so big goals stay abstract.",
  "“Someday” keeps swallowing the things you care about most.",
];

const withPoints = [
  "Every ambition structured in one private place.",
  "A system carries you on the days motivation doesn’t.",
  "The streak you’ve built makes you want to keep it.",
  "Progress you can see, so momentum compounds.",
  "Big goals broken into the one move you make today.",
];

const pairs = withoutPoints.map((point, i) => ({ without: point, with: withPoints[i] }));

export default function BeforeAfter() {
  return (
    <LandingSection eyebrow="The shift" title="Same you. A completely different operating system." lede="This isn’t about working harder. It’s about becoming the person who actually finishes." align="center">
      <ComparisonLedger pairs={pairs} />
    </LandingSection>
  );
}
