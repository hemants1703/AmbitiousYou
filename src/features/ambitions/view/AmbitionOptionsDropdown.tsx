"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import { IconMenu } from "@tabler/icons-react";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { favouriteAmbitionAction } from "../actions";
import { DeleteAmbitionDialog } from "./DeleteAmbitionDialog";

interface AmbitionOptionsDropdownProps {
  ambitionId: string;
  userId: string;
  isFavourited: boolean;
}

export function AmbitionOptionsDropdown({
  ambitionId,
  userId,
  isFavourited,
}: AmbitionOptionsDropdownProps) {
  const [deleteAmbitionDialogOpen, setDeleteAmbitionDialogOpen] = useState(false);

  return (
    <>
      {/* DELETE AMBITION DIALOG */}
      <DeleteAmbitionDialog
        ambitionId={ambitionId}
        deleteAmbitionDialogOpen={deleteAmbitionDialogOpen}
        setDeleteAmbitionDialogOpen={setDeleteAmbitionDialogOpen}
      />

      {/* Interactive Actions Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconMenu className="size-8 text-background text-shadow-lg" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Edit className="h-4 w-4 mr-2" /> Edit Ambition
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => {
              const { success, message, description, error } = await favouriteAmbitionAction(
                ambitionId,
                !isFavourited
              );
              if (success) {
                toast.success(message, {
                  description: description,
                });
              } else if (error) {
                toast.error("Error adding ambition to favorites", {
                  description: "Please try again",
                });
              }
            }}
          >
            {isFavourited ? (
              <StarFilledIcon className="h-4 w-4 mr-2 text-yellow-500" />
            ) : (
              <StarIcon className="h-4 w-4 mr-2 text-yellow-500" />
            )}{" "}
            {isFavourited ? "Remove from Favorites" : "Add to Favorites"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDeleteAmbitionDialogOpen(true)}>
            <Trash2 className="h-4 w-4 mr-2 text-red-500" /> Delete Ambition
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
