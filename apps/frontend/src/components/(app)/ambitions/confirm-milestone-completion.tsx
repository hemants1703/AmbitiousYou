"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { FlagIcon } from "lucide-react";
import type { ReactNode } from "react";

interface ConfirmMilestoneCompletionProps {
  title: string;
  onConfirm: () => void;
  children: ReactNode;
}

/**
 * Confirms the irreversible completion of a milestone. Wrap the completion control
 * as `children` (it becomes the AlertDialog trigger); `onConfirm` fires when the
 * user accepts. Shared by the Execution Board row and the dashboard "Your next
 * moves" queue so the "milestones are one-time" copy stays identical everywhere.
 */
export function ConfirmMilestoneCompletion(props: ConfirmMilestoneCompletionProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{props.children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-primary/10 text-primary">
            <FlagIcon aria-hidden="true" />
          </AlertDialogMedia>
          <AlertDialogTitle>Mark this milestone as reached?</AlertDialogTitle>
          <AlertDialogDescription>
            Milestones are one-time achievements. Marking <span className="font-medium text-foreground">{props.title}</span> as reached is permanent — you won&rsquo;t be able to reopen it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={props.onConfirm}>Yes, mark reached</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
