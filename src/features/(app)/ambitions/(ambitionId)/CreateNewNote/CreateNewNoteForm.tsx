"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { IconLoader2, IconCirclePlusFilled } from "@tabler/icons-react";
import { useActionState, useEffect, useState } from "react";
import { createNewNote, CreateNewNoteFormActionState } from "./actions";
import { toast } from "sonner";

interface CreateNewNoteFormProps {
  ambitionId: string;
  onSuccess: () => void;
}

export default function CreateNewNoteForm(props: CreateNewNoteFormProps) {
  const [formState, setFormState] = useState<CreateNewNoteFormActionState>({
    ambitionId: props.ambitionId as string,
    note: "",
  });
  const [formErrors, formAction, isPending] = useActionState<
    CreateNewNoteFormActionState,
    FormData
  >(createNewNote, formState);

  useEffect(() => {
    if (formErrors?.errors) {
      toast.error("Error", {
        description: formErrors.errors.general.join(", "),
        closeButton: true,
      });
    } else if (formErrors?.success) {
      toast.success("Success", {
        description: "Note created successfully",
        closeButton: true,
      });
      props.onSuccess();
    }
  }, [formErrors]);

  return (
    <form action={formAction} className="flex flex-col items-end gap-4">
      <input type="hidden" name="ambitionId" value={props.ambitionId} />

      <Textarea
        name="note"
        placeholder="Enter your note here..."
        className="max-h-96 bg-yellow-200/50 dark:bg-yellow-900/50 border border-yellow-500 dark:border-yellow-700 hover:bg-yellow-200/80 hover:border-yellow-500/80 dark:hover:bg-yellow-900/80  dark:selection:text-white"
        value={formState.note}
        onChange={(e) => setFormState({ ...formState, note: e.target.value })}
      />

      <Button
        size="tiny"
        type="submit"
        disabled={isPending}
        className="bg-yellow-500 text-shadow-md hover:brightness-110"
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <IconLoader2 />
            Creating Note...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <IconCirclePlusFilled />
            Create Note
          </span>
        )}
      </Button>
    </form>
  );
}
