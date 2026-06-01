"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { DeleteAmbitionDialog } from "./delete-ambition-dialog";
import EditAmbitionDialog from "./edit-ambition-dialog";

type AmbitionOptionsDropdownProps = {
  ambitionId: string;
  userId: string;
  isFavourited: boolean;
};

export type DialogStateProps = {
  open: boolean;
  ambitionId: string;
};

export default function AmbitionOptionsDropdown(props: AmbitionOptionsDropdownProps) {
  const [openDeleteAmbitionDialog, setOpenDeleteAmbitionDialog] = useState<DialogStateProps>();
  const [openEditAmbitionDialog, setOpenEditAmbitionDialog] = useState<DialogStateProps>();

  return (
    <>
      {/* DIALOGS */}
      {/* Delete Dialog */}
      {openDeleteAmbitionDialog?.open && <DeleteAmbitionDialog ambitionId={openDeleteAmbitionDialog.ambitionId} toggleDeleteDialog={setOpenDeleteAmbitionDialog} />}

      {/* Edit Dialog */}
      {openEditAmbitionDialog?.open && <EditAmbitionDialog ambitionId={openEditAmbitionDialog.ambitionId} toggleEditDialog={setOpenEditAmbitionDialog} />}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon-sm" aria-label="Open ambition actions">
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setOpenEditAmbitionDialog({ open: true, ambitionId: props.ambitionId })}>Edit ambition</DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={() => setOpenDeleteAmbitionDialog({ open: true, ambitionId: props.ambitionId })}>
            Delete ambition
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
