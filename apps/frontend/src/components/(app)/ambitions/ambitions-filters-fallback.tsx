import { HeartIcon } from "lucide-react";

/**
 * Static filter chrome for loading shells — Server Component, no client JS.
 * Mirrors AmbitionFilters layout for CLS; not interactive (AGENTS: if it looks
 * clickable it must be clickable — so we use inert placeholders, not noop controls).
 */
export function AmbitionsFiltersFallback() {
  return (
    <div
      className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-end"
      aria-busy="true"
      aria-label="Loading ambition filters"
    >
      <div className="flex w-full gap-2 justify-between lg:min-w-176">
        <div className="flex h-9 min-w-0 flex-1 items-center rounded-3xl border border-transparent bg-input/50 px-3 text-base text-muted-foreground md:text-sm lg:max-w-md">
          Search ambitions…
        </div>
        <div className="flex gap-2">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-3xl border border-transparent bg-input/50 text-muted-foreground"
            aria-hidden="true"
          >
            <HeartIcon className="size-4" />
          </div>
          <div className="flex h-9 w-24 shrink-0 items-center rounded-3xl border border-transparent bg-input/50 px-3 text-sm text-muted-foreground">
            Status
          </div>
          <div className="flex h-9 w-24 shrink-0 items-center rounded-3xl border border-transparent bg-input/50 px-3 text-sm text-muted-foreground">
            Priority
          </div>
        </div>
      </div>
    </div>
  );
}
