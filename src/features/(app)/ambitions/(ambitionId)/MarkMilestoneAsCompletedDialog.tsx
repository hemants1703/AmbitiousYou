"use client";

import * as AlertDialog from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Milestone } from "@/db/schema";
import { format } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";
import { markMilestoneAsCompletedAction } from "../actions";
import { useRouter } from "next/navigation";
import { IconCheck } from "@tabler/icons-react";

interface MarkMilestoneAsCompletedDialogProps {
    milestone: Milestone;
    ambitionId: string;
}

export default function MarkMilestoneAsCompletedDialog(props: MarkMilestoneAsCompletedDialogProps) {
    const router = useRouter();

    const handleMarkMilestoneAsCompleted = async () => {
        toast.promise(markMilestoneAsCompletedAction(props.milestone.id), {
            loading: "Marking milestone as complete...",
            success: (data) => {
                router.push(`/ambitions/${props.ambitionId}`);
                return "Milestone marked as complete";
            },
            error: (error) => error
        });
    }

    return (
        <AlertDialog.AlertDialog open={true}>
            <AlertDialog.AlertDialogContent>
                <AlertDialog.AlertDialogHeader>
                    <AlertDialog.AlertDialogTitle>Mark as Complete?</AlertDialog.AlertDialogTitle>
                    <AlertDialog.AlertDialogDescription>
                        Are you sure you want to mark this milestone as complete?<br /> <strong><i>This action cannot be undone.</i></strong>
                    </AlertDialog.AlertDialogDescription>
                </AlertDialog.AlertDialogHeader>

                <div className="space-y-4">
                    <div>
                        <h4 className="text-base font-medium">
                            {props.milestone.milestone}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            {format(new Date(props.milestone.milestoneTargetDate), "MMMM d, yyyy")}
                        </p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                        {props.milestone.milestoneDescription}
                    </p>
                </div>

                <AlertDialog.AlertDialogFooter>
                    <AlertDialog.AlertDialogCancel asChild>
                        <Button variant="outline" size="tiny" asChild>
                            <Link href={`/ambitions/${props.ambitionId}`} prefetch={true}>
                                Cancel
                            </Link>
                        </Button>
                    </AlertDialog.AlertDialogCancel>
                    <AlertDialog.AlertDialogAction asChild>
                        <Button variant="default" size="tiny" onClick={handleMarkMilestoneAsCompleted}>
                            <IconCheck className="text-green-500" /> Mark as Complete
                        </Button>
                    </AlertDialog.AlertDialogAction>
                </AlertDialog.AlertDialogFooter>
            </AlertDialog.AlertDialogContent>
        </AlertDialog.AlertDialog>
    )
}