import { Bricolage_Grotesque } from "next/font/google";
import { BatteryLowIcon, EyeOffIcon, FrownIcon, LayersIcon } from "lucide-react";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const painPoints = [
  {
    icon: <LayersIcon className="h-6 w-6 text-red-500" />,
    title: "Goals scattered everywhere",
    description: "Notes apps, reminders, sticky notes, your head — your ambitions live in ten places and none of them talk to each other.",
  },
  {
    icon: <BatteryLowIcon className="h-6 w-6 text-amber-500" />,
    title: "Motivation runs the show",
    description: "Every week starts strong and quietly loses to everything that feels more urgent than your own dreams.",
  },
  {
    icon: <EyeOffIcon className="h-6 w-6 text-slate-500" />,
    title: "Progress you can’t see",
    description: "With no clear signal that you’re actually moving, the big goals always feel impossibly far away.",
  },
];

export default function ProblemAgitation() {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="rounded-3xl border border-border bg-muted/30 backdrop-blur-sm p-8 md:p-14">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center px-4 py-1 mb-6 rounded-full bg-amber-500/10 backdrop-blur-sm text-amber-600 dark:text-amber-400 font-medium text-sm">
              <FrownIcon className="mr-2 h-4 w-4" />
              Sound familiar?
            </div>
            <h2 className={`${bricolage.className} tracking-tight text-3xl md:text-5xl font-bold mb-6`}>You’re not short on ambition. You’re short on a system.</h2>
            <p className="text-xl text-muted-foreground">Big dreams don’t fail because you stop caring. They fade because nothing holds them together, day to day.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {painPoints.map((point) => (
              <div key={point.title} className="bg-card/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-border hover:border-primary/50 hover:shadow-lg transition-all ease-in-out">
                <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3 mb-4">{point.icon}</div>
                <h3 className="text-xl font-bold mb-2">{point.title}</h3>
                <p className="text-muted-foreground">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
