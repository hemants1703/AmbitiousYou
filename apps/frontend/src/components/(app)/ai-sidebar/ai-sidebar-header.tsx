"use client";

import { XIcon, SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AiSidebarHeader as Header } from "@/components/ui/ai-sidebar";
import { useAiSidebar } from "@/components/ui/ai-sidebar";

export function AiSidebarHeader() {
  const { setOpen } = useAiSidebar();

  return (
    <Header className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <SparklesIcon className="size-5 text-accent-brand" />
        <h2 className="font-semibold text-foreground">AI Assistant</h2>
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setOpen(false)}
        aria-label="Close AI sidebar"
        className="text-muted-foreground hover:text-foreground">
        <XIcon className="size-4" />
      </Button>
    </Header>
  );
}