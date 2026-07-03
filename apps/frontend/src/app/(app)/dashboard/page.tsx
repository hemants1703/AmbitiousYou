import { DashboardInsights } from "@/components/(app)/dashboard/dashboard-insights";
import { DashboardActivity } from "@/components/(app)/dashboard/dashboard-activity";
import { DashboardSkeleton } from "@/components/(app)/dashboard/dashboard-skeleton";
import { ActivitySkeleton } from "@/components/(app)/dashboard/activity-skeleton";
import { DashboardStats } from "@/components/(app)/dashboard/dashboard-stats";
import { ReviveMissed } from "@/components/(app)/dashboard/revive-missed";
import { WelcomeHeader } from "@/components/(app)/dashboard/welcome-header";
import { getAmbitions } from "@/lib/api/ambitions/get-ambitions";
import { getSessionToken, requireUser } from "@/lib/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  // Validate the session and load the ambitions concurrently rather than in
  // series. getAmbitions only needs the raw cookie, and the /ambitions endpoint
  // enforces auth itself (SessionGuard), so overlapping the fetch with
  // requireUser's validation removes a backend round-trip WITHOUT weakening the
  // gate — requireUser still redirects on an invalid session before any of this
  // page renders.
  const sessionToken = await getSessionToken();
  const [{ user: userDetails }, ambitions] = await Promise.all([requireUser(), getAmbitions(sessionToken)]);

  if (!ambitions || ambitions.length === 0) {
    redirect("/ambitions/create?initiation=1");
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
