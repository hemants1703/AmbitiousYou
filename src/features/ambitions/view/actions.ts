"use server";

import { createClient } from "@/lib/utils/supabase/server";

export async function deleteAmbitionAction(ambitionId: string, ambitionTrackingMethod: string) {
  const supabase = await createClient();

  const { data: deletedAmbition, error } = await supabase
    .from("ambitions")
    .delete()
    .eq("id", ambitionId)
    .select();

  if (error) {
    console.error("Error deleting ambition", error);
    return {
      success: false,
      error: error.message,
    };
  }

  if (ambitionTrackingMethod === "task") {
    const { error: tasksError } = await supabase
      .from("tasks")
      .delete()
      .eq("ambitionId", ambitionId);

    if (tasksError) {
      console.error("Error deleting tasks", tasksError);
      return {
        success: false,
        error: tasksError.message,
      };
    }
  }

  if (ambitionTrackingMethod === "milestone") {
    const { error: milestonesError } = await supabase
      .from("milestones")
      .delete()
      .eq("ambitionId", ambitionId);

    if (milestonesError) {
      console.error("Error deleting milestones", milestonesError);
      return {
        success: false,
        error: milestonesError.message,
      };
    }
  }

  return { success: true, data: deletedAmbition };
}
