"use client";

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { DialogStateProps } from "./ambition-options-dropdown";
import { deleteAmbitionAction } from "@/lib/actions/(app)/ambitions/delete-ambition";

type DeleteAmbitionDialogProps = {
  ambitionId: string;
  ambitionName: string;
  toggleDeleteDialog: (state: DialogStateProps | undefined) => void;
};

export function DeleteAmbitionDialog(props: DeleteAmbitionDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    setError(null);

    startTransition(async () => {
      const result = await deleteAmbitionAction(props.ambitionId);

      if (result.error) {
        setError(result.error);
        return;
      }

      router.push("/ambitions");
    });
  };

  // Keep the dialog open while the delete is in-flight so the spinner stays visible.
  const handleOpenChange = (open: boolean) => {
    if (!open && !isPending) {
      props.toggleDeleteDialog(undefined);
    }
  };

  return (
    <AlertDialog open onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive">
            <Trash2Icon aria-hidden="true" />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete this ambition?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently deletes <span className="font-medium wrap-break-word text-foreground">{props.ambitionName}</span> along with its tasks, milestones, and notes. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error ? (
          <div role="alert" aria-live="polite" className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Deleting…
              </>
            ) : (
              <>
                <Trash2Icon className="size-4" />
                Delete ambition
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
