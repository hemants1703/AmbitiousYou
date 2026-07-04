import { ChevronRightIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";

interface MotivationBannerProps {
  ambitionId: string;
  ambitionName: string;
  motivation: string;
}

/**
 * Hero "promise" at the very top of the dashboard, above the next-moves board so it's
 * read first. The layout tells a one-glance story, top to bottom: *You promised
 * yourself* (the frame) → the ambition itself (the prominent dream) → the why in the
 * user's own words (the intimate reason). So opening the day reconnects today's work to
 * the promise behind it — instead of the old order that led the eye to the quote, then a
 * label, then the ambition name buried tiny at the bottom.
 *
 * Soft accent and generous spacing keep it calm (subtle); the dream's size, weight and
 * clear hierarchy make it impossible to miss (prominent). The whole card links to the
 * ambition.
 */
export function MotivationBanner(props: MotivationBannerProps) {
  return (
    <Link
      href={`/ambitions/${props.ambitionId}?ref=dashboard`}
      prefetch
      aria-label={`Open ${props.ambitionName} and revisit why you started it`}
      className="group block rounded-3xl border border-accent-brand/20 bg-linear-to-br from-accent-brand/10 via-accent-brand/5 to-transparent p-6 shadow-sm transition-colors hover:border-accent-brand/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:p-7">
      {/* The frame: this is a promise *you* made — read before anything else. */}
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-accent-brand/80">
          <SparklesIcon className="size-3.5 shrink-0" aria-hidden="true" />
          Remember why you started this!
        </p>
        <ChevronRightIcon className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </div>

      {/* The dream: the thing promised — the prominent line the eye lands on. */}
      <h2 className="mt-2 line-clamp-2 wrap-anywhere text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl" translate="no">
        {props.ambitionName}
      </h2>

      {/* The why: the reason, in the user's own words — intimate, set just beneath. */}
      <blockquote className="mt-4 line-clamp-3 wrap-anywhere border-l-2 border-accent-brand/30 pl-3.5 text-sm leading-relaxed text-foreground/80 sm:text-base">
        {props.motivation}
      </blockquote>
    </Link>
  );
}
