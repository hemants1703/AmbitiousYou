import { DashboardEmptyState } from "@/components/(app)/dashboard/dashboard-empty-state";
import { DashboardInsights } from "@/components/(app)/dashboard/dashboard-insights";
import { DashboardActivity } from "@/components/(app)/dashboard/dashboard-activity";
import { DashboardSkeleton } from "@/components/(app)/dashboard/dashboard-skeleton";
import { ActivitySkeleton } from "@/components/(app)/dashboard/activity-skeleton";
import { DashboardStats } from "@/components/(app)/dashboard/dashboard-stats";
import { ReviveMissed } from "@/components/(app)/dashboard/revive-missed";
import { WelcomeHeader } from "@/components/(app)/dashboard/welcome-header";
import { getAmbitions } from "@/lib/api/ambitions/get-ambitions";
import { requireUser } from "@/lib/auth";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const { user: userDetails, sessionToken } = await requireUser();
  const ambitions = await getAmbitions(sessionToken);

  const firstName = userDetails.name.trim().split(/\s+/)[0] || userDetails.name;

  if (!ambitions || ambitions.length === 0) {
    return <DashboardEmptyState firstName={firstName} />;
  }

  const missed = ambitions.filter((ambition) => ambition.ambitionStatus === "missed");

  return (
    <div className="mx-auto flex w-full max-w-350 flex-col gap-6">
      <WelcomeHeader user={userDetails} ambitions={ambitions} />
      <DashboardStats ambitions={ambitions} />

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardInsights sessionToken={sessionToken} ambitions={ambitions} />
      </Suspense>

      <ReviveMissed ambitions={missed} />

      <Suspense fallback={<ActivitySkeleton />}>
        <DashboardActivity sessionToken={sessionToken} ambitions={ambitions} />
      </Suspense>
    </div>
  );
}
