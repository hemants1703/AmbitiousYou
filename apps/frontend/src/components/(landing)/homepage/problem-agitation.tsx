import { BatteryLowIcon, EyeOffIcon, LayersIcon, type LucideIcon } from "lucide-react";
import { Eyebrow } from "../landing-section";

const painPoints: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: LayersIcon,
    title: "Goals scattered everywhere",
    description: "Notes apps, reminders, sticky notes, your head — your ambitions live in ten places and none of them talk to each other.",
  },
  {
    icon: BatteryLowIcon,
    title: "Motivation runs the show",
    description: "Every week starts strong and quietly loses to everything that feels more urgent than your own dreams.",
  },
  {
    icon: EyeOffIcon,
    title: "Progress you can’t see",
    description: "With no clear signal that you’re actually moving, the big goals always feel impossibly far away.",
  },
];

export default function ProblemAgitation() {
  return (
    <section className="w-full scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lp-reveal lg:col-span-5">
            <Eyebrow>Sound familiar?</Eyebrow>
            <h2 className="mt-4 font-brand text-3xl font-semibold tracking-[-0.02em] text-balance md:text-4xl">You’re not short on ambition. You’re short on a system.</h2>
            <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-muted-foreground md:text-lg">Big dreams don’t fail because you stop caring. They fade because nothing holds them together, day to day.</p>
          </div>

          <ul className="lg:col-span-7 lg:pt-2">
            {painPoints.map((point) => (
              <li key={point.title} className="lp-reveal flex gap-4 border-b border-border/60 py-6 first:pt-0 last:border-b-0 last:pb-0">
                <point.icon aria-hidden="true" className="mt-1 size-5 shrink-0 text-muted-foreground" />
                <div>
                  <h3 className="font-brand text-lg font-semibold tracking-[-0.01em] md:text-xl">{point.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground md:text-base">{point.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
