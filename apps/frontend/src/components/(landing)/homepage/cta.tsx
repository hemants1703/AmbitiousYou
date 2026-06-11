import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import PrimaryCta from "../primary-cta";

export default function CTA() {
  return (
    <section className="w-full overflow-hidden py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="lp-reveal relative overflow-hidden rounded-3xl border border-primary/20 bg-card/80 p-10 shadow-xl backdrop-blur-sm md:p-14">
          {/* Gradient hairline along the top edge */}
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
          {/* Local aurora bloom */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-24 h-48" style={{ background: "radial-gradient(28rem 12rem at 50% 0%, color-mix(in oklch, oklch(0.56 0.24 300) 20%, transparent) 0%, transparent 70%)" }} />

          <div className="relative mx-auto mb-10 max-w-2xl text-center">
            <h2 className="font-brand text-3xl font-semibold tracking-[-0.02em] text-balance md:text-4xl">Your next twelve months can look completely different</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">Set one goal, break it into today’s actions, and let the momentum build. Getting started takes about a minute.</p>
          </div>

          <div className="relative flex flex-col justify-center gap-4 sm:flex-row">
            <PrimaryCta loggedOutLabel="Set your first goal" loggedOutHref="/signup" size="lg" className="h-12 px-8 shadow-lg shadow-primary/20" />
            <Button asChild size="lg" variant="outline" className="h-12 px-8">
              <Link prefetch={true} href="/experience" className="flex items-center gap-2">
                Experience For Free <ArrowRightIcon aria-hidden="true" className="size-4" />
              </Link>
            </Button>
          </div>

          <p className="relative mt-6 text-center text-sm text-muted-foreground">Free to use · Set up in about a minute · Private by default</p>
        </div>
      </div>
    </section>
  );
}
