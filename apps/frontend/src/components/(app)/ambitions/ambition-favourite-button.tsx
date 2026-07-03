"use client";

import { toggleAmbitionFavouriteAction } from "@/lib/actions/(app)/ambitions/toggle-ambition-favourite";
import { cn } from "@/lib/utils";
import { HeartIcon, Loader2Icon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface AmbitionFavouriteButtonProps {
  ambitionId: string;
  isFavourited: boolean;
  className?: string;
  onChange?: (isFavourited: boolean) => void;
}

export function AmbitionFavouriteButton(props: AmbitionFavouriteButtonProps) {
  const [isFavourited, setIsFavourited] = useState(props.isFavourited);
  const [isPending, startTransition] = useTransition();

  function handleToggle(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const previous = isFavourited;
    setIsFavourited(!previous);

    startTransition(async () => {
      const result = await toggleAmbitionFavouriteAction(props.ambitionId);
      if (result.error) {
        setIsFavourited(previous);
        toast.error(result.error);
        return;
      }
      setIsFavourited(result.isFavourited);
      props.onChange?.(result.isFavourited);
    });
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      aria-label={isFavourited ? "Remove from favourites" : "Add to favourites"}
      className={cn("inline-flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-pink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", props.className)}>
      {isPending ? <Loader2Icon className="size-4 animate-spin" /> : <HeartIcon className={cn("size-4", isFavourited && "fill-pink-500 text-pink-500")} />}
    </button>
  );
}
