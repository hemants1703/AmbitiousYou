"use client";

import * as AlertDialog from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteNoteAction } from "./actions";
import { toast } from "sonner";
import { IconAlertCircleFilled, IconTrashFilled } from "@tabler/icons-react";

interface DeleteNoteAlertDialogProps {
  noteId: string;
  ambitionId: string;
  open: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function DeleteNoteAlertDialog(props: DeleteNoteAlertDialogProps) {
  return (
    <AlertDialog.AlertDialog open={props.open} onOpenChange={props.setIsOpen}>
      <AlertDialog.AlertDialogContent>
        <AlertDialog.AlertDialogHeader>
          <AlertDialog.AlertDialogTitle>Delete Note?</AlertDialog.AlertDialogTitle>
          <AlertDialog.AlertDialogDescription>
            Are you sure you want to delete this note?
            <br />
            <br />
            <strong className="text-destructive flex items-center gap-2">
              <IconAlertCircleFilled className="size-4" />
              This action cannot be undone.
            </strong>
          </AlertDialog.AlertDialogDescription>
        </AlertDialog.AlertDialogHeader>
        <AlertDialog.AlertDialogFooter>
          <AlertDialog.AlertDialogCancel asChild>
            <Button variant="outline" onClick={() => props.setIsOpen(false)}>
              Cancel
            </Button>
          </AlertDialog.AlertDialogCancel>
          <AlertDialog.AlertDialogAction asChild>
            <Button
              variant="destructive"
              size="tiny"
              onClick={async () => {
                const { error } = await deleteNoteAction(props.noteId, props.ambitionId);

                if (error) {
                  toast.error("Error", {
                    description: error,
                    closeButton: true,
                  });
                }
              }}
            >
              <IconTrashFilled className="size-4" />
              Delete
            </Button>
          </AlertDialog.AlertDialogAction>
        </AlertDialog.AlertDialogFooter>
      </AlertDialog.AlertDialogContent>
    </AlertDialog.AlertDialog>
  );
}
