import { DashboardActivity } from "@/components/(app)/dashboard/dashboard-activity";
import { DashboardInsights } from "@/components/(app)/dashboard/dashboard-insights";
import { ActivitySkeleton } from "@/components/(app)/dashboard/activity-skeleton";
import { DashboardStats } from "@/components/(app)/dashboard/dashboard-stats";
import { ReviveMissed } from "@/components/(app)/dashboard/revive-missed";
import { WelcomeHeader } from "@/components/(app)/dashboard/welcome-header";
import { DashboardMovesProvider } from "@/lib/(app)/mutations/dashboard-moves-context";
import { getActiveAmbitionDetails } from "@/lib/api/ambitions/get-active-ambition-details";
import { getAmbitions } from "@/lib/api/ambitions/get-ambitions";
import { flattenOpenItems, groupUpcomingByDay, pickLeadMotivation, summarizeAttention } from "@/lib/dashboard/tracked-items";
import { getSessionToken, requireUser } from "@/lib/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const sessionToken = await getSessionToken();
  const [{ user: userDetails }, ambitions] = await Promise.all([requireUser(), getAmbitions(sessionToken)]);

  if (!ambitions || ambitions.length === 0) {
    redirect("/ambitions/create?initiation=1");
  }

  const activeAmbitions = ambitions.filter((ambition) => ambition.ambitionStatus === "active");
  const { details, hadErrors } = await getActiveAmbitionDetails(sessionToken, activeAmbitions);
  const openItems = flattenOpenItems(details);
  const loadFailed = activeAmbitions.length > 0 && details.length === 0;
  const attentionSummary = summarizeAttention(details, openItems);
  const missed = ambitions.filter((ambition) => ambition.ambitionStatus === "missed");

  return (
    <DashboardMovesProvider initialOpenItems={openItems}>
      <div className="mx-auto flex w-full max-w-350 flex-col gap-6">
        <WelcomeHeader user={userDetails} ambitions={ambitions} />
        <DashboardStats ambitions={ambitions} attentionSummary={attentionSummary} loadFailed={loadFailed} />

        <DashboardInsights
          hadErrors={hadErrors}
          loadFailed={loadFailed}
          openItems={openItems}
          upcoming={groupUpcomingByDay(openItems, 2, 1)}
          weekGroups={groupUpcomingByDay(openItems, 7, 1)}
          leadMotivation={pickLeadMotivation(openItems, details)}
        />

        <ReviveMissed ambitions={missed} />

        <Suspense fallback={<ActivitySkeleton />}>
          <DashboardActivity sessionToken={sessionToken} ambitions={ambitions} />
        </Suspense>
      </div>
    </DashboardMovesProvider>
  );
}
