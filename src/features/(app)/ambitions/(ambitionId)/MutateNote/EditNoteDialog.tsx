import { Button } from "@/components/ui/button";
import * as Dialog from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { IconLoader2, IconFilePencilFilled, IconX } from "@tabler/icons-react";
import { useActionState, useEffect, useState } from "react";
import { editNoteAction, EditNoteFormActionState } from "./actions";
import { toast } from "sonner";

interface EditNoteDialogProps {
  noteId: string;
  ambitionId: string;
  note: string;
  open: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function EditNoteDialog(props: EditNoteDialogProps) {
  const [formState, setFormState] = useState<EditNoteFormActionState>({
    noteId: props.noteId,
    ambitionId: props.ambitionId,
    note: props.note,
  });
  const [formErrors, formAction, isPending] = useActionState<EditNoteFormActionState, FormData>(
    editNoteAction,
    formState
  );

  useEffect(() => {
    if (formErrors?.errors) {
      toast.error("Error", {
        description: formErrors.errors.general.join(", "),
        closeButton: true,
      });
    } else if (formErrors?.success) {
      toast.success("Success", {
        description: "Note updated successfully",
        closeButton: true,
      });
      props.setIsOpen(false);
    }
  }, [formErrors]);

  return (
    <Dialog.Dialog open={props.open} onOpenChange={props.setIsOpen}>
      <Dialog.DialogContent>
        <Dialog.DialogHeader>
          <Dialog.DialogTitle>Edit Note</Dialog.DialogTitle>
          <Dialog.DialogDescription>Edit your note for this ambition.</Dialog.DialogDescription>
        </Dialog.DialogHeader>
        <form action={formAction} className="flex flex-col items-end gap-4">
          <input type="hidden" name="noteId" value={props.noteId} />
          <input type="hidden" name="ambitionId" value={props.ambitionId} />

          <Textarea
            name="note"
            placeholder="Enter your note here..."
            noteTextarea={true}
            value={formState.note}
            onChange={(e) => setFormState({ ...formState, note: e.target.value })}
          />

          <Button type="submit" size="tiny" disabled={isPending}>
            {isPending ? (
              <span className="flex items-center gap-2">
                <IconLoader2 className="animate-spin" />
                Updating Note...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <IconFilePencilFilled className="size-4" />
                Update Note
              </span>
            )}
          </Button>
        </form>
      </Dialog.DialogContent>
    </Dialog.Dialog>
  );
}
