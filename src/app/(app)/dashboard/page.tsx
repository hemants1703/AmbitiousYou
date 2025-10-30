import { DashboardClient } from "@/src/features/app/dashboard/DashboardClient";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { motivationalQuotes } from "@/src/lib/motivationalQuotes";
import { AmbitionsService } from "@/src/services/ambitionsService";
import { TasksService } from "@/src/services/tasksService";
import { MilestonesService } from "@/src/services/milestonesService";
import { ProfilesService } from "@/src/services/profilesService";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  // TODO: Implement proper authentication check with BetterAuth
  // For now, using placeholder user ID
  const userId = "placeholder-user-id";

  try {
    // Fetch data concurrently using new services
    const [profileData, ambitions, tasks, milestones] = await Promise.all([
      ProfilesService.fetchUserProfile(userId),
      AmbitionsService.fetchActiveAmbitions(userId),
      TasksService.fetchUserTasks(userId),
      MilestonesService.fetchUserMilestones(userId),
    ]);

    // Precompute stats for SSR
    const firstName = profileData?.firstName || "";
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
    const ambitionsSummary = ambitions.map((ambition) => {
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
  } catch (error) {
    console.error("Error loading dashboard data:", error);
    // Return empty state on error
    return (
      <DashboardClient
        firstName=""
        ambitionsSummary={[]}
        totalTasksAndMilestones={0}
        completedTasksAndMilestones={0}
        nearCompletionCount={0}
        motivationalQuote={motivationalQuotes[0]}
      />
    );
  }
}
