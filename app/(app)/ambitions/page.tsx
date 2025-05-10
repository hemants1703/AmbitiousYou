import { createClient } from "@/utils/supabase/server";
import AmbitionsClient from "./AmbitionsClient";
import { toast } from "sonner";
import { AmbitionData, Task, Milestone } from "@/types";

export default async function AmbitionsPage() {
  const supabase = await createClient();

  const { data: ambitions, error } = await supabase
    .from("ambitions")
    .select("*");

  if (error) {
    toast.error("Error fetching ambitions", {
      description: error.message,
    });
    console.error("Error fetching ambitions:", error);
    return <div>Error loading ambitions</div>;
  }

  // Fetch all tasks
  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select("*");

  if (tasksError) {
    toast.error("Error fetching tasks", {
      description: tasksError.message,
    });
    console.error("Error fetching tasks:", tasksError);
    return <div>Error loading tasks</div>;
  }

  // Fetch all milestones
  const { data: milestones, error: milestonesError } = await supabase
    .from("milestones")
    .select("*");

  if (milestonesError) {
    toast.error("Error fetching milestones", {
      description: milestonesError.message,
    });
    console.error("Error fetching milestones:", milestonesError);
    return <div>Error loading milestones</div>;
  }

  // console.log("Ambitions", ambitions);
  // console.log("Tasks", tasks);
  // console.log("Milestones", milestones);


  return (
    <AmbitionsClient
      ambitions={ambitions as AmbitionData[]}
      ambitionTasks={tasks as Task[]}
      ambitionMilestones={milestones as Milestone[]}
    />
  );
}
