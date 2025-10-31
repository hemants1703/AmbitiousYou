"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { favouriteAmbitionAction } from "../actions";
import { DeleteAmbitionDialog } from "./DeleteAmbitionDialog";

interface IndividualAmbitionClientProps {
  ambitionId: string;
  userId: string;
  isFavourited: boolean;
  ambitionTrackingMethod: "task" | "milestone";
}

export function IndividualAmbitionClient({
  ambitionId,
  userId,
  isFavourited,
  ambitionTrackingMethod,
}: IndividualAmbitionClientProps) {
  const [deleteAmbitionDialogOpen, setDeleteAmbitionDialogOpen] = useState(false);

  return (
    <>
      {/* DELETE AMBITION DIALOG */}
      <DeleteAmbitionDialog
        ambitionId={ambitionId}
        ambitionTrackingMethod={ambitionTrackingMethod}
        deleteAmbitionDialogOpen={deleteAmbitionDialogOpen}
        setDeleteAmbitionDialogOpen={setDeleteAmbitionDialogOpen}
      />

      {/* Interactive Actions Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Edit className="h-4 w-4 mr-2" /> Edit Ambition
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => {
              const { success, message, description, error } = await favouriteAmbitionAction(
                userId,
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
