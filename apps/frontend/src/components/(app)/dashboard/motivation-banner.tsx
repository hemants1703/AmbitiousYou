import { ChevronRightIcon, QuoteIcon } from "lucide-react";
import Link from "next/link";

interface MotivationBannerProps {
  ambitionId: string;
  ambitionName: string;
  motivation: string;
}

/**
 * Hero "why" surfaced at the very top of the dashboard — above the next-moves
 * board so it's read before anything else. Soft accent (calming) but clickable
 * straight to the ambition it belongs to (attentive), anchoring the day's work to
 * the reason the user started.
 */
export function MotivationBanner(props: MotivationBannerProps) {
  return (
    <Link
      href={`/ambitions/${props.ambitionId}`}
      prefetch
      aria-label={`Remember your why for ${props.ambitionName}`}
      className="group block rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:p-6">
      <div className="flex items-start gap-3 sm:gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary" aria-hidden="true">
          <QuoteIcon className="size-5" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary/80">Remember your why</p>
          <blockquote className="mt-1.5 line-clamp-3 wrap-anywhere text-base font-medium leading-relaxed text-foreground sm:text-lg">{props.motivation}</blockquote>
          <p className="mt-2 truncate text-xs text-muted-foreground" translate="no">
            {props.ambitionName}
          </p>
        </div>

        <ChevronRightIcon className="mt-0.5 size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </div>
    </Link>
  );
}
