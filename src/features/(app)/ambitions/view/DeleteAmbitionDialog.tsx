"use client";

import { toast } from "sonner";
import { redirect } from "next/navigation";
import * as AlertDialog from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteAmbitionAction } from "./actions";
import Link from "next/link";

interface DeleteAmbitionDialogProps {
  ambitionId: string;
}

export function DeleteAmbitionDialog(props: DeleteAmbitionDialogProps) {
  return (
    <AlertDialog.AlertDialog open={true}>
      <AlertDialog.AlertDialogContent>
        <AlertDialog.AlertDialogHeader>
          <AlertDialog.AlertDialogTitle>Are you absolutely sure?</AlertDialog.AlertDialogTitle>
          <AlertDialog.AlertDialogDescription>
            This action cannot be undone. This will permanently delete this ambition and remove all
            associated data from our servers.
          </AlertDialog.AlertDialogDescription>
        </AlertDialog.AlertDialogHeader>
        <AlertDialog.AlertDialogFooter>
          <AlertDialog.AlertDialogCancel asChild>
            <Link href={`/ambitions/${props.ambitionId}`} prefetch={true}>
              Cancel
            </Link>
          </AlertDialog.AlertDialogCancel>
          <AlertDialog.AlertDialogAction asChild>
            <Button
              variant={"destructive"}
              onClick={async () => {
                const { success, error } = await deleteAmbitionAction(props.ambitionId);
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
          </AlertDialog.AlertDialogAction>
        </AlertDialog.AlertDialogFooter>
      </AlertDialog.AlertDialogContent>
    </AlertDialog.AlertDialog>
  );
}
