import { toast } from "sonner";
import { redirect } from "next/navigation";
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

export function DeleteAmbitionDialog({
  ambitionId,
  deleteAmbitionDialogOpen,
  setDeleteAmbitionDialogOpen,
}: {
  ambitionId: string;
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
                const { success, error } = await deleteAmbitionAction(ambitionId);
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
