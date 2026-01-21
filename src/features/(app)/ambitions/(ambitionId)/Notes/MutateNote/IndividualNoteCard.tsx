"use client";

import * as Dialog from "@/components/ui/dialog";
import { Note } from "@/db/schema";
import DeleteNoteAlertDialog from "./DeleteNoteAlertDialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IconFilePencilFilled, IconTrashFilled } from "@tabler/icons-react";
import EditNoteDialog from "./EditNoteDialog";

interface IndividualNoteCardProps {
  children: React.ReactNode;

  note: Note;
}

export default function IndividualNoteCard(props: IndividualNoteCardProps) {
  const [isDeleteAlertDialogOpen, setIsDeleteAlertDialogOpen] = useState(false);
  const [isEditNoteDialogOpen, setIsEditNoteDialogOpen] = useState(false);

  if (isDeleteAlertDialogOpen) {
    return (
      <DeleteNoteAlertDialog
        noteId={props.note.id}
        ambitionId={props.note.ambitionId}
        open={isDeleteAlertDialogOpen}
        setIsOpen={setIsDeleteAlertDialogOpen}
      />
    );
  }

  if (isEditNoteDialogOpen) {
    return (
      <EditNoteDialog
        id={props.note.id}
        ambitionId={props.note.ambitionId}
        note={props.note.note}
        open={isEditNoteDialogOpen}
        setIsOpen={setIsEditNoteDialogOpen}
      />
    );
  }

  return (
    <Dialog.Dialog>
      <Dialog.DialogTrigger asChild className="cursor-pointer">{props.children}</Dialog.DialogTrigger>
      <Dialog.DialogContent>
        <Dialog.DialogHeader>
          <Dialog.DialogTitle>Your Note</Dialog.DialogTitle>
          <Dialog.DialogDescription>View your note for this ambition.</Dialog.DialogDescription>
        </Dialog.DialogHeader>
        <div className="group flex items-start justify-between max-h-96 overflow-y-auto gap-2 bg-yellow-200/50 dark:bg-yellow-900/50 border border-yellow-400 dark:border-yellow-800 hover:bg-yellow-200/80 hover:border-yellow-500/80 dark:hover:bg-yellow-900/80 p-2 rounded-lg">
          <p className="text-sm max-w-full wrap-break-words">{props.note.note}</p>
        </div>

        <Dialog.DialogFooter>
          <Button
            variant="destructive"
            size="tiny"
            onClick={() => setIsDeleteAlertDialogOpen(true)}
          >
            <IconTrashFilled className="size-4" />
            <span>Delete Note</span>
          </Button>
          <Button variant="outline" size="tiny" onClick={() => setIsEditNoteDialogOpen(true)}>
            <IconFilePencilFilled className="size-4" />
            <span>Edit Note</span>
          </Button>
        </Dialog.DialogFooter>
      </Dialog.DialogContent>
    </Dialog.Dialog>
  );
}
