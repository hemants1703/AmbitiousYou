"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { formatDate } from "@/lib/(app)/tracked-item";
import { ListTodoIcon } from "lucide-react";
import type { ReactNode } from "react";

interface ConfirmTaskReopenProps {
  title: string;
  completedAt: Date | string | null;
  onConfirm: () => void;
  children: ReactNode;
}

/**
 * Confirms reopening a completed task. Uncompleting clears the server-stamped
 * completion date — shared wherever task rows can be toggled off.
 */
export function ConfirmTaskReopen(props: ConfirmTaskReopenProps) {
  const completedOn = props.completedAt ? formatDate(props.completedAt) : null;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{props.children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-amber-500/10 text-amber-700 dark:text-amber-300">
            <ListTodoIcon aria-hidden="true" />
          </AlertDialogMedia>
          <AlertDialogTitle>Mark this task as incomplete?</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-medium text-foreground">{props.title}</span> will move back to your open list
            {completedOn ? (
              <>
                {" "}
                and its completion date (<span className="font-medium text-foreground">{completedOn}</span>) will be reset
              </>
            ) : (
              " and its completion date will be reset"
            )}
            .
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep completed</AlertDialogCancel>
          <AlertDialogAction onClick={props.onConfirm}>Yes, mark incomplete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
