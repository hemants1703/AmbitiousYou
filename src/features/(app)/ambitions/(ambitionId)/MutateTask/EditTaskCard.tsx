"use client";

import * as Dialog from "@/components/ui/dialog";
import { Task } from "@/db/schema";
import { useState } from "react";
import EditTaskForm from "./EditTaskForm";

interface EditTaskCardProps {
  children: React.ReactNode;

  task: Task;
  ambitionStartDate: string;
  ambitionEndDate: string;
}

export default function EditTaskCard(props: EditTaskCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog.Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.DialogTrigger asChild>{props.children}</Dialog.DialogTrigger>
      <Dialog.DialogContent>
        <Dialog.DialogHeader>
          <Dialog.DialogTitle>Edit Your Task</Dialog.DialogTitle>
          <Dialog.DialogDescription>Edit your task for this ambition.</Dialog.DialogDescription>
        </Dialog.DialogHeader>
        <EditTaskForm
          task={props.task}
          setIsOpen={setIsOpen}
          ambitionStartDate={props.ambitionStartDate}
          ambitionEndDate={props.ambitionEndDate}
        />
      </Dialog.DialogContent>
    </Dialog.Dialog>
  );
}
