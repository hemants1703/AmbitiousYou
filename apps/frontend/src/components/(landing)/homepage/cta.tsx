import PrimaryCta from "@/components/(landing)/primary-cta";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { brandCopy } from "@/lib/brand";

export default function CTA() {
  return (
    <section className="w-full overflow-hidden py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="lp-reveal relative overflow-hidden rounded-3xl border border-accent-brand/20 bg-card/80 p-10 shadow-elevated backdrop-blur-sm md:p-14">
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent-brand/50 to-transparent" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-24 h-48" style={{ background: "radial-gradient(28rem 12rem at 50% 0%, color-mix(in oklch, oklch(0.56 0.24 300) 20%, transparent) 0%, transparent 70%)" }} />

          <div className="relative mx-auto mb-10 max-w-2xl text-center">
            <h2 className="font-brand text-3xl font-semibold tracking-[-0.02em] text-balance md:text-4xl">Join the ambitious ones</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">Declare one ambition, add your first moves, and prove you&apos;re serious. Getting started takes about a minute.</p>
          </div>

          <div className="relative flex flex-col items-center justify-center gap-4 sm:flex-row">
            <PrimaryCta loggedOutLabel={brandCopy.cta.claimFirst} loggedOutHref="/signup" size="lg" className="h-12 px-8 shadow-lg shadow-primary/20" />
            <Button asChild size="lg" variant="outline" className="h-12 px-8">
              <Link prefetch={true} href="/manifesto" className="flex items-center gap-2">
                Read the manifesto <ArrowRightIcon aria-hidden="true" className="size-4" />
              </Link>
            </Button>
          </div>

          <p className="relative mt-6 text-center text-sm text-muted-foreground">Free to use · Private by default · No credit card</p>
        </div>
      </div>
    </section>
  );
}
