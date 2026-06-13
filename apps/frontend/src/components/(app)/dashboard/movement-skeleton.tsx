import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/** Mirrors {@link MovementChart}'s layout (header + range toggle, stat row, chart area) to avoid layout shift. */
export function MovementSkeleton() {
  return (
    <Card aria-hidden="true">
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
  );
}
