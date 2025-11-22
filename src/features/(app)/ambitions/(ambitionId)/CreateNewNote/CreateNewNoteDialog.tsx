"use client";

import { Button } from "@/components/ui/button";
import * as Dialog from "@/components/ui/dialog";
import { IconCirclePlus } from "@tabler/icons-react";
import CreateNewNoteForm from "./CreateNewNoteForm";
import { useState } from "react";

interface CreateNewNoteDialogProps {
  ambitionId: string;
}

export default function CreateNewNoteDialog(props: CreateNewNoteDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog.Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.DialogTrigger asChild>
        <Button size="tiny" className="bg-yellow-500 text-white text-shadow-md">
          <IconCirclePlus />
          Create Note
        </Button>
      </Dialog.DialogTrigger>
      <Dialog.DialogContent>
        <Dialog.DialogHeader>
          <Dialog.DialogTitle>Create New Note</Dialog.DialogTitle>
          <Dialog.DialogDescription>Create a new note for this ambition.</Dialog.DialogDescription>
        </Dialog.DialogHeader>
        <CreateNewNoteForm ambitionId={props.ambitionId} onSuccess={() => setIsOpen(false)} />
      </Dialog.DialogContent>
    </Dialog.Dialog>
  );
}
