import { ActivitySkeleton } from "@/components/(app)/dashboard/activity-skeleton";
import { DashboardSkeleton } from "@/components/(app)/dashboard/dashboard-skeleton";
import { DashboardStatsSkeleton } from "@/components/(app)/dashboard/dashboard-stats-skeleton";
import { WelcomeHeaderSkeleton } from "@/components/(app)/dashboard/welcome-header-skeleton";

/**
 * Instant-navigation fallback for /dashboard. Static chrome (date, greeting,
 * CTA, stat labels, section titles) paints immediately; only API-backed values
 * and list rows are skeletonized.
 */
export default function DashboardLoading() {
  return (
    <div className="app-page flex flex-col gap-6" aria-busy="true" aria-label="Loading dashboard">
      <WelcomeHeaderSkeleton />
      <DashboardStatsSkeleton />
      <DashboardSkeleton />
      <ActivitySkeleton />
    </div>
  );
}
