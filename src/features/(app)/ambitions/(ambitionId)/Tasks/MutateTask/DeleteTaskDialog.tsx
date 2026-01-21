"use client";

import * as AlertDialog from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { deleteTaskAction } from "./actions";

interface DeleteTaskDialogProps {
    children: React.ReactNode;
    taskId: string;
}

export default function DeleteTaskDialog(props: DeleteTaskDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    return <AlertDialog.AlertDialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
        <AlertDialog.AlertDialogTrigger asChild>
            {props.children}
        </AlertDialog.AlertDialogTrigger>
        <AlertDialog.AlertDialogContent>
            <AlertDialog.AlertDialogHeader>
                <AlertDialog.AlertDialogTitle>Are you absolutely sure?</AlertDialog.AlertDialogTitle>
                <AlertDialog.AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this task and remove all
                    associated data from our servers.
                </AlertDialog.AlertDialogDescription>
            </AlertDialog.AlertDialogHeader>
            <AlertDialog.AlertDialogFooter>
                <AlertDialog.AlertDialogCancel onClick={() => setIsOpen(!isOpen)}>
                    Cancel
                </AlertDialog.AlertDialogCancel>
                <AlertDialog.AlertDialogAction asChild>
                    <Button
                        variant={"destructive"}
                        onClick={async () => {
                            const { success, error } = await deleteTaskAction(props.taskId);
                            if (success) {
                                toast.success("Task deleted successfully");
                            } else if (error) {
                                toast.error("Error deleting task");
                            }
                        }}
                    >
                        Yes, Delete
                    </Button>
                </AlertDialog.AlertDialogAction>
            </AlertDialog.AlertDialogFooter>
        </AlertDialog.AlertDialogContent>
    </AlertDialog.AlertDialog>;
}