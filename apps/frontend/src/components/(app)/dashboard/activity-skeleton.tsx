import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDaysIcon, TrendingUpIcon } from "lucide-react";

/** Mirrors DashboardActivity layout with real card titles; heatmap/chart stay skeleton. */
export function ActivitySkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-hidden="true">
      <Card>
        <CardHeader>
          <div className="space-y-1.5">
            <CardTitle className="flex items-center gap-2">
              <CalendarDaysIcon className="size-4 text-foreground" />
              Activity calendar
            </CardTitle>
            <CardDescription>Every move you&apos;ve completed over the last year.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-30 w-full rounded-2xl" />
          <div className="hidden gap-3 lg:grid lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full rounded-2xl" />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUpIcon className="size-4 text-foreground" />
            Your movement
          </CardTitle>
          <CardDescription>Moves you&apos;ve completed, day by day.</CardDescription>
          <CardAction>
            <Skeleton className="h-8 w-32 rounded-3xl" />
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full rounded-2xl" />
            ))}
          </div>
          <Skeleton className="aspect-16/5 w-full rounded-2xl" />
        </CardContent>
      </Card>
    </div>
  );
}
