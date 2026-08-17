"use client";

import { PlusIcon, TrophyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion-wrapper";

export function WinsHeader() {
  return (
    <FadeIn>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <TrophyIcon className="size-7 text-accent-brand" />
            Wins
          </h1>
          <p className="mt-1 text-muted-foreground">
            Private log of meaningful progress. Revisit when momentum dips.
          </p>
        </div>
        <Button asChild>
          <a href="#wins-new">
            <PlusIcon className="size-4 mr-2" />
            Log a win
          </a>
        </Button>
      </div>
    </FadeIn>
  );
}