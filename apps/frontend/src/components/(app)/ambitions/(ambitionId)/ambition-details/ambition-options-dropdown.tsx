"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import Link from "next/link";

type AmbitionOptionsDropdownProps = {
  ambitionId: string;
  userId: string;
  isFavourited: boolean;
};

export default function AmbitionOptionsDropdown(props: AmbitionOptionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon-sm" aria-label="Open ambition actions">
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link href={`/ambitions/${props.ambitionId}?edit_ambition=${props.ambitionId}`}>Edit ambition</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild variant="destructive">
          <Link href={`/ambitions/${props.ambitionId}?delete_ambition=${props.ambitionId}`}>Delete ambition</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
