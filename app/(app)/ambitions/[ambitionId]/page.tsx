import { notFound } from "next/navigation";
import { IndividualAmbitionClient } from "@/app/(app)/ambitions/[ambitionId]/IndividualAmbitionClient";
import type { AmbitionData, AmbitionTask, AmbitionMilestone, TimeEntry } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteAmbitionAction } from "./actions";

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
    toast.error("Error fetching related data", {
      description: "Seems like this ambition does not exist...",
    });
  }

  return (
    <IndividualAmbitionClient
      ambition={ambition as AmbitionData}
      tasks={tasks}
      milestones={milestones}
    />
  );
}

export function DeleteAmbitionDialog({
  ambitionId,
  ambitionTrackingMethod,
  deleteAmbitionDialogOpen,
  setDeleteAmbitionDialogOpen,
}: {
  ambitionId: string;
  ambitionTrackingMethod: string;
  deleteAmbitionDialogOpen: boolean;
  setDeleteAmbitionDialogOpen: (open: boolean) => void;
}) {
  return (
    <AlertDialog open={deleteAmbitionDialogOpen} onOpenChange={setDeleteAmbitionDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this ambition and remove all
            associated data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant={"destructive"}
              onClick={async () => {
                const { success, error } = await deleteAmbitionAction(
                  ambitionId,
                  ambitionTrackingMethod
                );
                if (success) {
                  toast.success("Ambition deleted successfully");
                  redirect("/ambitions");
                } else if (error) {
                  toast.error("Error deleting ambition");
                }
              }}
            >
              Yes, Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
