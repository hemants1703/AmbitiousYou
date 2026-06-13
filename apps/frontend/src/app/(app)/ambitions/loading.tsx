import * as Card from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Instant-navigation fallback for /ambitions. Shows immediately on navigation
 * (the default <Link> prefetch warms this static shell with no backend call),
 * so the page feels instant while the session is validated and the ambitions
 * load. Mirrors AmbitionsClientView (header → filter bar → card grid) to avoid
 * layout shift when the real content arrives.
 */
export default function AmbitionsLoading() {
  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-6" aria-hidden="true">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <Skeleton className="h-9 w-full md:w-44" />
      </div>

      {/* Filter bar — mirrors AmbitionFilters (search + favourites + 2 selects) */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-end">
        <div className="flex w-full gap-2 lg:min-w-176 lg:justify-end">
          <Skeleton className="h-9 flex-1 lg:max-w-md" />
          <Skeleton className="size-9 shrink-0" />
          <Skeleton className="h-9 w-24 shrink-0" />
          <Skeleton className="h-9 w-24 shrink-0" />
        </div>
      </div>

      {/* Card grid — mirrors AmbitionCard */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card.Card key={index}>
            <Card.CardHeader>
              <div className="mt-2 flex items-center justify-between gap-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-56 max-w-full" />
            </Card.CardHeader>
            <Card.CardContent>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <Skeleton className="h-1 w-full" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
            </Card.CardContent>
            <Card.CardFooter>
              <div className="flex w-full items-center justify-between">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="size-4" />
              </div>
            </Card.CardFooter>
          </Card.Card>
        ))}
      </div>
    </div>
  );
}
