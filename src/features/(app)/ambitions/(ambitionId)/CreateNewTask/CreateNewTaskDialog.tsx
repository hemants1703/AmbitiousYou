"use client";

import { Button } from "@/components/ui/button";
import * as Dialog from "@/components/ui/dialog";
import { IconCirclePlus } from "@tabler/icons-react";
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
          variant="ay"
          className="text-shadow-md dark:text-black hover:brightness-110 bg-(--ambition-color)"
          style={{
            backgroundColor: props.ambitionColor,
          }}
        >
          <IconCirclePlus /> Create Task
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
