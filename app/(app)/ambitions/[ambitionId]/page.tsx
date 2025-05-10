import { testAmbitions } from "@/app/(app)/ambitions/testData";
import { notFound } from "next/navigation";
import { IndividualAmbitionClient } from "@/app/(app)/ambitions/[ambitionId]/IndividualAmbitionClient";
import type { Ambition, Task, Milestone, TimeEntry } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

interface PageProps {
  params: {
    ambitionId: string;
  };
}

// Helper function to convert test data to match the Ambition interface
function convertTestDataToAmbition(testData: any): Ambition {
  return {
    ...testData,
    tasks: testData.tasks?.map((task: any) => ({
      ...task,
      userId: "test-user",
      ambitionId: testData.id,
      createdAt: new Date(),
      updatedAt: new Date()
    })) || [],
    milestones: testData.milestones?.map((milestone: any) => ({
      ...milestone,
      userId: "test-user",
      ambitionId: testData.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      milestoneTargetDate: new Date(milestone.milestoneTargetDate || milestone.createdAt)
    })) || [],
    timeEntries: testData.timeEntries?.map((entry: any) => ({
      ...entry,
      userId: "test-user",
      ambitionId: testData.id
    })) || []
  };
}

export default async function IndividualAmbitionPage({ params }: PageProps) {
  const supabase = await createClient();

  // Check if user is authenticated
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    redirect("/login");
  }

  const { ambitionId } = await params;

  // Try to fetch from Supabase first
  const { data: ambition, error: ambitionError } = await supabase
    .from("ambitions")
    .select("*")
    .eq("id", ambitionId)
    .single();

  // If Supabase fetch fails, fall back to test data
  let finalAmbition: Ambition | undefined = ambition;
  if (ambitionError || !ambition) {
    const testAmbition = testAmbitions.find((a) => a.id === params.ambitionId);
    if (testAmbition) {
      finalAmbition = convertTestDataToAmbition(testAmbition);
    }
  }

  if (!finalAmbition) {
    notFound();
  }

  // Fetch related data from Supabase
  let tasks: Task[] = [];
  let milestones: Milestone[] = [];
  let timeEntries: TimeEntry[] = [];

  try {
    // Fetch tasks
    const { data: tasksData } = await supabase
      .from("tasks")
      .select("*")
      .eq("ambitionId", ambitionId)
      .order("createdAt", { ascending: true });

    if (tasksData) {
      tasks = tasksData as Task[];
    }

    // Fetch milestones
    const { data: milestonesData } = await supabase
      .from("milestones")
      .select("*")
      .eq("ambitionId", ambitionId)
      .order("createdAt", { ascending: true });

    if (milestonesData) {
      milestones = milestonesData as Milestone[];
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
    if (finalAmbition.id === params.ambitionId) {
      tasks = finalAmbition.tasks;
      milestones = finalAmbition.milestones;
      timeEntries = finalAmbition.timeEntries;
    }
  }

  return (
    <IndividualAmbitionClient
      ambition={finalAmbition}
      tasks={tasks}
      milestones={milestones}
      timeEntries={timeEntries}
    />
  );
}