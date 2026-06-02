import { Bricolage_Grotesque } from "next/font/google";
import { TargetIcon } from "lucide-react";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const outcomes = [
  {
    color: "#00bfff",
    goal: "Land the promotion",
    value: 70,
    description: "Turn a fuzzy ‘grow my career’ into clear milestones you tick off, one quarter at a time.",
  },
  {
    color: "#32cd32",
    goal: "Finish the creative project",
    value: 55,
    description: "Break a daunting first draft into the pages you actually write today, instead of someday.",
  },
  {
    color: "#ff7733",
    goal: "Train for the big race",
    value: 80,
    description: "Go from ‘I should run’ to a plan you can see yourself finishing, week by week.",
  },
];

export default function Outcomes() {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-1 mb-6 rounded-full bg-foreground/10 backdrop-blur-sm text-foreground font-medium text-sm">
            <TargetIcon className="mr-2 h-4 w-4" />
            Made for real goals
          </div>
          <h2 className={`${bricolage.className} tracking-tight text-3xl md:text-5xl font-bold mb-6`}>Whatever you’re working toward, it fits here</h2>
          <p className="text-xl text-muted-foreground">From career moves to creative projects to big races — a few of the goals AmbitiousYou is built to help you finish.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {outcomes.map((outcome) => (
            <div key={outcome.goal} className="bg-card/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-border hover:border-primary/50 hover:shadow-lg transition-all ease-in-out">
              <div className="flex items-center gap-2 mb-3">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: outcome.color }} />
                <span className="font-bold">{outcome.goal}</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-4">
                <div className="h-full rounded-full" style={{ width: `${outcome.value}%`, backgroundColor: outcome.color }} />
              </div>
              <p className="text-muted-foreground">{outcome.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
