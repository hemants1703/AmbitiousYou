import { DashboardClient } from "@/src/features/app/dashboard/DashboardClient";
import { createClient } from "@/src/utils/supabase/server";
import {
  getAmbitionsTableData,
  getMilestonesTableData,
  // getPlansTableData,
  getProfilesTableData,
  getTasksTableData,
} from "@/src/utils/supabase/tablesDataProvider";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { motivationalQuotes } from "@/src/lib/motivationalQuotes";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data, error: userDoesNotExist } = await supabase.auth.getUser();
  if (userDoesNotExist) {
    redirect("/login");
  }
  const userData = data.user;
  const { id } = userData;
  const profileData = await getProfilesTableData(id);
  const ambitions = await getAmbitionsTableData(id);
  const tasks = await getTasksTableData(id);
  const milestones = await getMilestonesTableData(id);
  // const plans = await getPlansTableData(id);
  // const isProUser = plans[0]?.planMonthlyPrice > 0;

  // Precompute stats for SSR
  const firstName = profileData[0]?.firstName || "";
  const totalTasksAndMilestones = tasks.length + milestones.length;
  const completedTasksAndMilestones =
    tasks.filter((task) => task.taskCompleted === true).length +
    milestones.filter((milestone) => milestone.milestoneCompleted === true).length;
  const nearCompletionAmbitions = ambitions.filter(
    (ambition) => ambition.ambitionPercentageCompleted >= 80
  );
  // Pick a random motivational quote (SSR)
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
  const randomMotivationalQuote = motivationalQuotes[randomIndex];

  // Prepare ambitions summary for dashboard (active ambitions only)
  const activeAmbitions = ambitions.filter((a) => a.ambitionStatus === "active");
  const ambitionsSummary = activeAmbitions.map((ambition) => {
    const ambitionTasks = tasks.filter((t) => t.ambitionId === ambition.id);
    const ambitionMilestones = milestones.filter((m) => m.ambitionId === ambition.id);
    const completed =
      ambition.ambitionTrackingMethod === "task"
        ? ambitionTasks.filter((t) => t.taskCompleted).length
        : ambitionMilestones.filter((m) => m.milestoneCompleted).length;
    const total =
      ambition.ambitionTrackingMethod === "task" ? ambitionTasks.length : ambitionMilestones.length;
    return {
      id: ambition.id,
      name: ambition.ambitionName,
      color: ambition.ambitionColor,
      percentage: ambition.ambitionPercentageCompleted,
      trackingMethod: ambition.ambitionTrackingMethod,
      completed,
      total,
      priority: ambition.ambitionPriority,
    };
  });

  return (
    <DashboardClient
      firstName={firstName}
      ambitionsSummary={ambitionsSummary}
      totalTasksAndMilestones={totalTasksAndMilestones}
      completedTasksAndMilestones={completedTasksAndMilestones}
      nearCompletionCount={nearCompletionAmbitions.length}
      motivationalQuote={randomMotivationalQuote}
      // isProUser={isProUser}
    />
  );
}
