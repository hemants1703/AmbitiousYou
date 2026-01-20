"use client";

import * as DropdownMenu from "@/components/ui/dropdown-menu";
import {
  IconDotsVertical,
  IconEdit,
  IconStar,
  IconStarFilled,
  IconTrash,
} from "@tabler/icons-react";
import Link from "next/link";
import { toast } from "sonner";
import { favouriteAmbitionAction } from "../actions";

interface AmbitionOptionsDropdownProps {
  ambitionId: string;
  userId: string;
  isFavourited: boolean;
}

export default function AmbitionOptionsDropdown(props: AmbitionOptionsDropdownProps) {
  const handleFavouriteToggle = async () => {
    toast.promise(favouriteAmbitionAction(props.ambitionId, !props.isFavourited), {
      loading: "Adding ambition to favorites...",
      success: "Ambition added to favorites",
      error: "Error adding ambition to favorites",
    });
  };

  return (
    <>
      {/* Interactive Actions Dropdown */}
      <DropdownMenu.DropdownMenu>
        <DropdownMenu.DropdownMenuTrigger asChild>
          <IconDotsVertical className="size-8 text-shadow-lg bg-foreground/10 rounded-full p-2" />
        </DropdownMenu.DropdownMenuTrigger>
        <DropdownMenu.DropdownMenuContent align="end">
          {/* <DropdownMenu.DropdownMenuItem asChild>
            <Link href={`/ambitions/${props.ambitionId}/edit`} prefetch={true}>
              <IconEdit className="size-4 mr-2" /> Edit Ambition
            </Link>
          </DropdownMenu.DropdownMenuItem> */}
          <DropdownMenu.DropdownMenuItem onClick={handleFavouriteToggle}>
            {props.isFavourited ? (
              <IconStarFilled className="size-4 mr-2 text-yellow-500" />
            ) : (
              <IconStar className="size-4 mr-2 text-yellow-500" />
            )}{" "}
            {props.isFavourited ? "Remove from Favorites" : "Add to Favorites"}
          </DropdownMenu.DropdownMenuItem>
          <DropdownMenu.DropdownMenuSeparator />
          <DropdownMenu.DropdownMenuItem asChild>
            <Link href={`/ambitions/${props.ambitionId}?delete_ambition=true`} prefetch={true}>
              <IconTrash className="size-4 mr-2 text-red-500" /> Delete Ambition
            </Link>
          </DropdownMenu.DropdownMenuItem>
        </DropdownMenu.DropdownMenuContent>
      </DropdownMenu.DropdownMenu>
    </>
  );
}
