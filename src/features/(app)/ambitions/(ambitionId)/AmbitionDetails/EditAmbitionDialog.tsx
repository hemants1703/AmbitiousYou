"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import * as Dialog from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as Popover from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Ambition } from "@/db/schema";
import { IconCalendar, IconFilePencilFilled, IconLoader2 } from "@tabler/icons-react";
import { format, isBefore, startOfToday } from "date-fns";
import { redirect } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { editAmbitionDetails, EditAmbitionDetailsActionState } from "./actions";

interface EditAmbitionDialogProps {
    ambition: Partial<Ambition>;
}

export default function EditAmbitionDialog(props: EditAmbitionDialogProps) {
    const [formState, setFormState] = useState<EditAmbitionDetailsActionState>(props.ambition);
    const [formErrors, formAction, isPending] = useActionState<EditAmbitionDetailsActionState, FormData>(editAmbitionDetails, formState);

    useEffect(() => {
        if (formErrors?.errors) {
            const errorReason = formErrors.errors[Object.keys(formErrors.errors)[0]]
            toast.error("Error", {
                description: errorReason ?? "There was an error updating your Ambition Details. Please try again.",
                closeButton: true,
            });
        } else if (formErrors?.success) {
            toast.success("Success", {
                description: "Ambition Details updated successfully",
                closeButton: true,
            });
            redirect(`/ambitions/${props.ambition.id}`)
        }
    }, [formErrors]);

    return <Dialog.Dialog open={true} onOpenChange={() => redirect(`/ambitions/${props.ambition.id}`)}>
        <Dialog.DialogContent>
            <Dialog.DialogHeader>
                <Dialog.DialogTitle>Edit your Ambition Details</Dialog.DialogTitle>
                <Dialog.DialogDescription>You can update the following details about your Ambition.</Dialog.DialogDescription>
            </Dialog.DialogHeader>
            <form action={formAction} className="flex flex-col items-end gap-4">
                <input type="hidden" name="userId" value={formState.userId} />
                <input type="hidden" name="ambitionId" value={formState.id} />

                <div className="flex flex-col w-full space-y-5">
                    <div className="space-y-1">
                        <Label htmlFor="ambitionName">Name</Label>
                        <Input
                            id="ambitionName"
                            name="ambitionName"
                            type="text"
                            value={formState.ambitionName}
                            placeholder="E.g. Learn Spanish, Run a Marathon..."
                            onChange={(e) => setFormState({ ...formState, ambitionName: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="ambitionDefinition">Definition</Label>
                        <Textarea
                            id="ambitionDefinition"
                            name="ambitionDefinition"
                            placeholder="Define your ambition in detail..."
                            value={formState.ambitionDefinition ?? ""}
                            onChange={(e) => setFormState({ ...formState, ambitionDefinition: e.target.value })}
                        />
                    </div>
                </div>

                <Button type="submit" size="tiny" disabled={isPending}>
                    {isPending ? (
                        <span className="flex items-center gap-2">
                            <IconLoader2 className="animate-spin" />
                            Updating Ambition Details...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <IconFilePencilFilled className="size-4" />
                            Update Ambition Details
                        </span>
                    )}
                </Button>
            </form>
        </Dialog.DialogContent>
    </Dialog.Dialog >
}