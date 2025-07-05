import { notFound } from "next/navigation";
import { IndividualAmbitionClient } from "./IndividualAmbitionClient";
import type { AmbitionData, AmbitionTask, AmbitionMilestone, TimeEntry } from "@/src/types";
import { createClient } from "@/src/utils/supabase/server";
import { redirect } from "next/navigation";

interface PageProps {
  params: {
    ambitionId: string;
  };
}

export default async function IndividualAmbitionPage({ params }: PageProps) {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    redirect("/login");
  }

  const { ambitionId } = params;

  // Try to fetch from Supabase first
  const { data: ambition, error: ambitionError } = await supabase
    .from("ambitions")
    .select("*")
    .eq("id", ambitionId)
    .single();

  if (!ambition) {
    notFound();
  }

  // Fetch related data from Supabase
  let tasks: AmbitionTask[] = [];
  let milestones: AmbitionMilestone[] = [];
  let timeEntries: TimeEntry[] = [];

  try {
    // Fetch tasks
    const { data: tasksData } = await supabase
      .from("tasks")
      .select("*")
      .eq("ambitionId", ambitionId)
      .order("createdAt", { ascending: true });

    if (tasksData) {
      tasks = tasksData as AmbitionTask[];
    }

    // Fetch milestones
    const { data: milestonesData } = await supabase
      .from("milestones")
      .select("*")
      .eq("ambitionId", ambitionId)
      .order("createdAt", { ascending: true });

    if (milestonesData) {
      milestones = milestonesData as AmbitionMilestone[];
    }

    // Fetch time entries
    const { data: timeEntriesData } = await supabase
      .from("time_entries")
      .select("*")
      .eq("ambitionId", ambitionId)
      .order("date", { ascending: false })
      .limit(5);

    if (timeEntriesData) {
      timeEntries = timeEntriesData as TimeEntry[];
    }
  } catch (error) {
    // If fetching related data fails, use the data from test ambition
    console.error("Error fetching related data:", error);
  }

  return (
    <IndividualAmbitionClient
      ambition={ambition as AmbitionData}
      tasks={tasks}
      milestones={milestones}
    />
  );
}
