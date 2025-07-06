import { notFound } from "next/navigation";
import { IndividualAmbitionClient } from "./IndividualAmbitionClient";
import type { Ambition, AmbitionTask, AmbitionMilestone } from "@/src/types";
import { createClient } from "@/src/utils/supabase/server";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{
    ambitionId: string;
  }>;
}

export default async function IndividualAmbitionPage({ params }: PageProps) {
  const { ambitionId } = await params;
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    redirect("/login");
  }

  // Try to fetch from Supabase first
  const { data: ambition } = await supabase
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
  } catch (error) {
    // If fetching related data fails, use the data from test ambition
    console.error("Error fetching related data:", error);
  }

  return (
    <IndividualAmbitionClient
      ambition={ambition as Ambition}
      tasks={tasks}
      milestones={milestones}
    />
  );
}
