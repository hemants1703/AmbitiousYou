import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/** Mirrors {@link DashboardActivity}'s layout (contribution calendar above the movement chart) to avoid layout shift. */
export function ActivitySkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-hidden="true">
      <Card>
        <CardHeader className="gap-2">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-4 w-56 max-w-full" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-72 max-w-full" />
          <Skeleton className="h-[120px] w-full rounded-2xl" />
          <Skeleton className="ml-auto h-4 w-28" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="gap-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-48 max-w-full" />
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
          <Skeleton className="aspect-[16/5] w-full rounded-2xl" />
        </CardContent>
      </Card>
    </div>
  );
}
