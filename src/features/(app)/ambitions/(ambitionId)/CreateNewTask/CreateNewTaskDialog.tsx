"use client";

import { Button } from "@/components/ui/button";
import * as Dialog from "@/components/ui/dialog";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import CreateNewTaskForm from "./CreateNewTaskForm";

interface CreateNewTaskDialogProps {
  ambitionId: string;
  ambitionStartDate: string;
  ambitionEndDate: string;
  ambitionColor: string;
}

export default function CreateNewTaskDialog(props: CreateNewTaskDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog.Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.DialogTrigger asChild>
        <Button
          size="tiny"
          className="text-shadow-md dark:text-white hover:brightness-110"
          style={{
            backgroundColor: props.ambitionColor,
          }}
        >
          <IconPlus /> Add Task
        </Button>
      </Dialog.DialogTrigger>
      <Dialog.DialogContent>
        <Dialog.DialogHeader>
          <Dialog.DialogTitle>Create New Task</Dialog.DialogTitle>
          <Dialog.DialogDescription>Create a new task for this ambition.</Dialog.DialogDescription>
        </Dialog.DialogHeader>
        <CreateNewTaskForm
          ambitionId={props.ambitionId}
          ambitionStartDate={props.ambitionStartDate}
          ambitionEndDate={props.ambitionEndDate}
          ambitionColor={props.ambitionColor}
          onSuccess={() => setIsOpen(false)}
        />
      </Dialog.DialogContent>
    </Dialog.Dialog>
  );
}
