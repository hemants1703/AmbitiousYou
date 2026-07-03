import { Button } from "@/components/ui/button";
import { ArrowRightIcon, CheckIcon } from "lucide-react";
import Link from "next/link";
import DashboardPreview from "./dashboard-preview";
import PrimaryCta from "../primary-cta";
import { brandCopy } from "@/lib/brand";

const proofPoints = ["Ambitions, not errands", "Honest momentum", "Private by default", "Free to use"];

export default function Hero() {
  return (
    <section className="relative flex w-full flex-col items-center justify-center px-4 pb-24 pt-10 md:pt-16">
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h1 className="lp-hero-enter mx-auto bg-linear-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text font-brand text-[2.625rem] font-semibold leading-[1.05] tracking-[-0.03em] text-balance text-transparent sm:text-5xl md:text-6xl lg:text-[4.25rem]">For the ambitious ones.</h1>

        <p className="lp-hero-enter-2 mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          You&apos;re not short on drive. You&apos;re short on a system built for goals that take months — not errands that take minutes. <span translate="no">AmbitiousYou</span> is where ambitious people run their ambitions.
        </p>

        <div className="lp-hero-enter-3 mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <PrimaryCta loggedOutLabel={brandCopy.cta.claimFirst} loggedOutHref="/signup" size="lg" />
          <Button asChild size="lg" variant="outline">
            <Link prefetch={true} href="/experience" className="flex items-center gap-2">
              Experience For Free <ArrowRightIcon aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        </div>

        <ul className="lp-hero-enter-3 mt-9 flex flex-wrap justify-center gap-x-7 gap-y-2 text-sm text-muted-foreground">
          {proofPoints.map((label) => (
            <li key={label} className="flex items-center gap-2">
              <CheckIcon aria-hidden="true" className="size-4 text-primary dark:text-chart-1" />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="lp-hero-enter-4 relative z-10 mx-auto mt-14 w-full max-w-5xl">
        <div className="rounded-xl bg-linear-to-tr from-primary/20 dark:from-chart-1/20 to-secondary/10 p-1 shadow-xl mask-[linear-gradient(to_bottom,black_72%,transparent)]">
          <DashboardPreview />
        </div>
        <p className="relative -mt-10 text-center text-sm text-muted-foreground">
          <Link href="/manifesto" className="underline underline-offset-4 hover:text-foreground">
            Read the manifesto
          </Link>
          {" · "}
          Claim your first ambition in about a minute
        </p>
      </div>
    </section>
  );
}
