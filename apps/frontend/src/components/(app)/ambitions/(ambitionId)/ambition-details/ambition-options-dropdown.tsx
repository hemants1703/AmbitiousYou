"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HeartIcon, Loader2Icon, MoreVertical, PencilIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { DeleteAmbitionDialog } from "./delete-ambition-dialog";
import { toggleAmbitionFavouriteAction } from "@/lib/actions/(app)/ambitions/toggle-ambition-favourite";

type AmbitionOptionsDropdownProps = {
  ambitionId: string;
  ambitionName: string;
  userId: string;
  isFavourited: boolean;
};

export type DialogStateProps = {
  open: boolean;
  ambitionId: string;
};

export default function AmbitionOptionsDropdown(props: AmbitionOptionsDropdownProps) {
  const [openDeleteAmbitionDialog, setOpenDeleteAmbitionDialog] = useState<DialogStateProps>();
  const [isFavourited, setIsFavourited] = useState(props.isFavourited);
  const [isTogglingFavourite, startToggleFavourite] = useTransition();

  const handleToggleFavourite = () => {
    // Optimistically flip so the menu item reflects the new state immediately.
    const previous = isFavourited;
    setIsFavourited(!previous);

    startToggleFavourite(async () => {
      const result = await toggleAmbitionFavouriteAction(props.ambitionId);

      if (result.error) {
        setIsFavourited(previous);
        toast.error(result.error);
        return;
      }

      setIsFavourited(result.isFavourited);
      toast.success(result.isFavourited ? "Added to favourites" : "Removed from favourites");
    });
  };

  return (
    <>
      {/* DIALOGS */}
      {/* Delete Dialog */}
      {openDeleteAmbitionDialog?.open && <DeleteAmbitionDialog ambitionId={openDeleteAmbitionDialog.ambitionId} ambitionName={props.ambitionName} toggleDeleteDialog={setOpenDeleteAmbitionDialog} />}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon-sm" aria-label="Open ambition actions">
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleToggleFavourite} disabled={isTogglingFavourite} onSelect={(event) => event.preventDefault()}>
            {isTogglingFavourite ? <Loader2Icon className="size-4 animate-spin" /> : <HeartIcon className={isFavourited ? "size-4 fill-pink-500 text-pink-500" : "size-4"} />}
            {isFavourited ? "Remove favourite" : "Add to favourites"}
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link prefetch={true} href={`/ambitions/${props.ambitionId}/edit`}>
              <PencilIcon className="size-4" />
              Edit ambition
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={() => setOpenDeleteAmbitionDialog({ open: true, ambitionId: props.ambitionId })}>
            <Trash2Icon className="size-4" />
            Delete ambition
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
