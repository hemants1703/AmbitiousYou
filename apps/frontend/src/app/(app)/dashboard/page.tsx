import { DashboardActivity } from "@/components/(app)/dashboard/dashboard-activity";
import { DashboardInsights } from "@/components/(app)/dashboard/dashboard-insights";
import { ActivitySkeleton } from "@/components/(app)/dashboard/activity-skeleton";
import { DashboardStats } from "@/components/(app)/dashboard/dashboard-stats";
import { MissedDayRecovery } from "@/components/(app)/dashboard/missed-day-recovery";
import { ReviveMissed } from "@/components/(app)/dashboard/revive-missed";
import { WelcomeHeader } from "@/components/(app)/dashboard/welcome-header";
import { DashboardMovesProvider } from "@/lib/(app)/mutations/dashboard-moves-context";
import { getActiveAmbitionDetails } from "@/lib/api/ambitions/get-active-ambition-details";
import { getLoopContract } from "@/lib/api/loop/get-contract";
import { getAttentionCoach, getMissedDay, getWeeklyReview } from "@/lib/api/loop/get-loop-data";
import { getCachedAmbitions } from "@/lib/cache/session-data";
import { flattenOpenItems, groupUpcomingByDay, pickLeadMotivation, startOfDay, summarizeAttention } from "@/lib/dashboard/tracked-items";
import { requireUser } from "@/lib/auth";
import { isPro } from "@/lib/plan";
import { Metadata } from "next";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import DashboardLoading from "./loading";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  await connection();

  const [{ user: userDetails, sessionToken }, ambitions] = await Promise.all([requireUser(), getCachedAmbitions()]);
  const pro = isPro(userDetails);
  const today = startOfDay();

  if (!ambitions || ambitions.length === 0) {
    redirect("/ambitions/create?initiation=1");
  }

  const activeAmbitions = ambitions.filter((ambition) => ambition.ambitionStatus === "active");
  const { details, hadErrors } = await getActiveAmbitionDetails(activeAmbitions);
  const openItems = flattenOpenItems(details, today);
  const loadFailed = activeAmbitions.length > 0 && details.length === 0;
  const attentionSummary = summarizeAttention(details, openItems, today);
  const missed = ambitions.filter((ambition) => ambition.ambitionStatus === "missed");
  const contractPayload = pro
    ? ((await getLoopContract(sessionToken)) ?? {
        contract: null,
        localDate: new Date().toISOString().slice(0, 10),
        primaryAmbition: null,
        suggestedMove: null,
        move: null,
      })
    : null;

  const [weeklyReview, coach, missedDay] = pro
    ? await Promise.all([
        getWeeklyReview(sessionToken),
        getAttentionCoach(sessionToken),
        getMissedDay(sessionToken),
      ])
    : [null, null, null];

  return (
    <DashboardMovesProvider initialOpenItems={openItems}>
      <div className="app-page flex flex-col gap-6">
        <WelcomeHeader user={userDetails} ambitions={ambitions} />
        <DashboardStats ambitions={ambitions} attentionSummary={attentionSummary} loadFailed={loadFailed} isPro={pro} coach={coach} />

        <DashboardInsights
          hadErrors={hadErrors}
          loadFailed={loadFailed}
          openItems={openItems}
          upcoming={groupUpcomingByDay(openItems, 2, 1)}
          weekGroups={groupUpcomingByDay(openItems, 7, 1)}
          leadMotivation={pickLeadMotivation(openItems, details)}
          isPro={pro}
          contractPayload={contractPayload}
          weeklyReview={weeklyReview}
        />

        {pro && missedDay ? <MissedDayRecovery missedDay={missedDay} /> : null}

        <ReviveMissed ambitions={missed} referenceDate={today} />

        <Suspense fallback={<ActivitySkeleton />}>
          <DashboardActivity ambitions={ambitions} />
        </Suspense>
      </div>
    </DashboardMovesProvider>
  );
}
