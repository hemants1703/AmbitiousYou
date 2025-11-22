"use client";

import { Button } from "@/components/ui/button";
import * as Dialog from "@/components/ui/dialog";
import { IconCirclePlus } from "@tabler/icons-react";
import { useState } from "react";
import CreateMilestoneForm from "./CreateMilestoneForm";

interface CreateMilestoneDialogProps {
  ambitionId: string;
  ambitionStartDate: string;
  ambitionEndDate: string;
  ambitionColor: string;
}

export default function CreateMilestoneDialog(props: CreateMilestoneDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog.Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.DialogTrigger asChild>
        <Button
          size="tiny"
          className="text-shadow-md dark:text-white"
          style={{
            backgroundColor: props.ambitionColor,
          }}
        >
          <IconCirclePlus /> Create Milestone
        </Button>
      </Dialog.DialogTrigger>
      <Dialog.DialogContent>
        <Dialog.DialogHeader>
          <Dialog.DialogTitle>Create New Milestone</Dialog.DialogTitle>
          <Dialog.DialogDescription>
            Create a new milestone for this ambition.
          </Dialog.DialogDescription>
        </Dialog.DialogHeader>
        <CreateMilestoneForm
          ambitionId={props.ambitionId}
          ambitionColor={props.ambitionColor}
          ambitionStartDate={props.ambitionStartDate}
          ambitionEndDate={props.ambitionEndDate}
          onSuccess={() => setIsOpen(false)}
        />
      </Dialog.DialogContent>
    </Dialog.Dialog>
  );
}
