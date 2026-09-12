"use client";

import { SparklesIcon } from "lucide-react";
import { FadeIn } from "@/components/motion-wrapper";

export function AskAiHeader() {
  return (
    <FadeIn>
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <SparklesIcon className="size-7 text-accent-brand" />
          Ask AI
        </h1>
        <p className="mt-1 text-muted-foreground">
          Grounded answers over your ambitions, tasks, milestones, and notes.
        </p>
      </div>
    </FadeIn>
  );
}