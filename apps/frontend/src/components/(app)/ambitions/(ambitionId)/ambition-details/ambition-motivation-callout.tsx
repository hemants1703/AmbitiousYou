import { cn } from "@/lib/utils";
import { PencilLineIcon, QuoteIcon } from "lucide-react";
import Link from "next/link";
import { AMBITION_DIMENSION_LABEL, AMBITION_DIMENSION_ROW } from "./ambition-tracking";

interface AmbitionMotivationCalloutProps {
  ambitionId: string;
  motivation: string | null;
}

/**
 * The "Why" row in the ambition anchor — same ledger grid as Work and Time so the
 * detail hero reads: why you started → work completed → time elapsed. Dashboard
 * teases the promise; here the user's words get room to land before the metrics.
 */
export function AmbitionMotivationCallout(props: AmbitionMotivationCalloutProps) {
  const motivation = props.motivation?.trim();

  if (!motivation) {
    return (
      <div className={AMBITION_DIMENSION_ROW}>
        <p className={cn(AMBITION_DIMENSION_LABEL, "sm:pt-2")}>Why</p>
        <Link
          href={`/ambitions/${props.ambitionId}/edit`}
          prefetch
          className="group flex min-h-11 items-center gap-3 rounded-2xl border border-dashed border-border/70 bg-muted/20 px-4 py-3 text-sm text-muted-foreground transition-[border-color,background-color,color] duration-200 hover:border-accent-brand/35 hover:bg-accent-brand/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-background/80 text-accent-brand ring-1 ring-border/60 transition-colors group-hover:ring-accent-brand/30" aria-hidden="true">
            <QuoteIcon className="size-4" />
          </span>
          <span className="min-w-0 text-left">
            <span className="block font-medium text-foreground/90">Add your why</span>
            <span className="mt-0.5 block text-xs leading-snug">Captured while motivation is high — we resurface it when you start slipping.</span>
          </span>
          <PencilLineIcon className="ml-auto size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-70" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  return (
    <div className={AMBITION_DIMENSION_ROW}>
      <p className={cn(AMBITION_DIMENSION_LABEL, "sm:pt-3")}>Why</p>
      <figure className="relative min-w-0 overflow-hidden rounded-2xl border border-accent-brand/15 bg-linear-to-br from-accent-brand/10 via-accent-brand/5 to-transparent px-4 py-3.5 sm:px-5 sm:py-4">
        <span aria-hidden="true" className="pointer-events-none absolute -left-0.5 top-1 select-none font-serif text-[4.5rem] leading-none text-accent-brand/12">
          &ldquo;
        </span>

        <div className="relative flex items-start justify-between gap-3">
          <blockquote className="min-w-0 wrap-anywhere text-pretty text-sm leading-relaxed text-foreground sm:text-base">{motivation}</blockquote>
          <Link
            href={`/ambitions/${props.ambitionId}/edit`}
            prefetch
            className="shrink-0 rounded-full px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-background/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            Edit…
          </Link>
        </div>

        <figcaption className="sr-only">Your motivation</figcaption>
      </figure>
    </div>
  );
}
