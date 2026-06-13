import { ActivitySkeleton } from "@/components/(app)/dashboard/activity-skeleton";
import { DashboardSkeleton } from "@/components/(app)/dashboard/dashboard-skeleton";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Instant-navigation fallback for /dashboard. Next renders this the moment the
 * user navigates here — before the server responds — so moving to the dashboard
 * feels immediate instead of staring at a blank screen while the session is
 * validated and the ambitions load. The default <Link> prefetch warms this
 * static shell without touching the backend, so it costs nothing extra.
 *
 * Mirrors the real page (welcome header → stat grid → insights → activity) to
 * avoid layout shift when the streamed content swaps in.
 */
export default function DashboardLoading() {
  return (
    <div className="mx-auto flex w-full max-w-350 flex-col gap-6" aria-hidden="true">
      {/* Welcome header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-8 w-64 max-w-full" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <div className="flex w-full shrink-0 gap-2 sm:w-auto">
          <Skeleton className="h-9 w-full sm:w-36" />
        </div>
      </div>

      {/* Stat grid — mirrors DashboardStats / StatCard */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} size="sm" className="gap-3">
            <div className="flex items-start justify-between gap-3 px-4">
              <div className="min-w-0 space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-7 w-12" />
              </div>
              <Skeleton className="size-9 shrink-0 rounded-2xl" />
            </div>
            <div className="px-4">
              <Skeleton className="h-3 w-24" />
            </div>
          </Card>
        ))}
      </div>

      <DashboardSkeleton />
      <ActivitySkeleton />
    </div>
  );
}
