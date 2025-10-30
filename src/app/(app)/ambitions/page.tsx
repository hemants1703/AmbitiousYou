import AmbitionsClient from "../../../features/app/ambitions/AmbitionsClient";
import { Ambition, AmbitionTask, AmbitionMilestone } from "@/types/globals";
import { Metadata } from "next";
import { AmbitionsService } from "@/src/services/ambitionsService";
import { TasksService } from "@/src/services/tasksService";
import { MilestonesService } from "@/src/services/milestonesService";

export const metadata: Metadata = {
  title: "All Ambitions | AmbitiousYou",
};

export default async function AmbitionsPage() {
  // TODO: Implement proper authentication check with BetterAuth
  // For now, using placeholder user ID
  const userId = "placeholder-user-id";

  try {
    // Fetch data concurrently using new services
    const [ambitions, tasks, milestones] = await Promise.all([
      AmbitionsService.fetchActiveAmbitions(userId),
      TasksService.fetchUserTasks(userId),
      MilestonesService.fetchUserMilestones(userId),
    ]);

    return (
      <AmbitionsClient
        ambitions={ambitions}
        ambitionTasks={tasks}
        ambitionMilestones={milestones}
      />
    );
  } catch (error) {
    console.error("Error loading ambitions data:", error);
    // Return empty state on error
    return (
      <AmbitionsClient
        ambitions={[]}
        ambitionTasks={[]}
        ambitionMilestones={[]}
      />
    );
  }
}
