"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon, PencilIcon, Trash2Icon } from "lucide-react";

interface DetailActionsMenuProps {
  disabled?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  editLabel?: string;
  deleteLabel?: string;
}

export function DetailActionsMenu(props: DetailActionsMenuProps) {
  const showEdit = Boolean(props.onEdit);
  const showDelete = Boolean(props.onDelete);

  if (!showEdit && !showDelete) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="icon-sm" className="rounded-xl" disabled={props.disabled} aria-label="More options">
          <MoreVerticalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {showEdit ? (
          <DropdownMenuItem disabled={props.disabled} onClick={props.onEdit}>
            <PencilIcon className="size-4" />
            {props.editLabel ?? "Edit"}
          </DropdownMenuItem>
        ) : null}
        {showEdit && showDelete ? <DropdownMenuSeparator /> : null}
        {showDelete ? (
          <DropdownMenuItem variant="destructive" disabled={props.disabled} onClick={props.onDelete}>
            <Trash2Icon className="size-4" />
            {props.deleteLabel ?? "Delete"}
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
