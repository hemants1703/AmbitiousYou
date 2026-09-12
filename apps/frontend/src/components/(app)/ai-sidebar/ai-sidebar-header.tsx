"use client";

import { useState } from "react";
import { XIcon, SparklesIcon, ListTodoIcon, CompassIcon, MessageSquareIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AiSidebarHeader as Header, useAiSidebarOptional } from "@/components/ui/ai-sidebar";

export type AiSidebarTab = "chat" | "breakdown" | "coach";

interface AiSidebarHeaderProps {
  tab: AiSidebarTab;
  onTabChange: (tab: AiSidebarTab) => void;
}

export function AiSidebarHeader(props: AiSidebarHeaderProps) {
  const ai = useAiSidebarOptional();
  if (!ai) {
    return null;
  }
  const { setOpen, setOpenMobile } = ai;

  return (
    <Header>
      <div className="flex items-center justify-between gap-3 px-1">
        <div className="flex min-w-0 items-center gap-2">
          <SparklesIcon className="size-4 shrink-0 text-sidebar-foreground/70" aria-hidden="true" />
          <h2 className="truncate text-sm font-medium tracking-tight text-sidebar-foreground">Assistant</h2>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => {
            setOpen(false);
            setOpenMobile(false);
          }}
          aria-label="Close AI assistant"
          className="shrink-0 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
          <XIcon data-icon="inline-start" />
        </Button>
      </div>

      <ToggleGroup
        type="single"
        value={props.tab}
        onValueChange={(value) => {
          if (value === "chat" || value === "breakdown" || value === "coach") {
            props.onTabChange(value);
          }
        }}
        variant="outline"
        size="sm"
        spacing={0}
        className="w-full"
        aria-label="Assistant mode">
        <ToggleGroupItem value="chat" className="flex-1 gap-1.5 px-2">
          <MessageSquareIcon data-icon="inline-start" />
          Chat
        </ToggleGroupItem>
        <ToggleGroupItem value="breakdown" className="flex-1 gap-1.5 px-2">
          <ListTodoIcon data-icon="inline-start" />
          Plan
        </ToggleGroupItem>
        <ToggleGroupItem value="coach" className="flex-1 gap-1.5 px-2">
          <CompassIcon data-icon="inline-start" />
          Coach
        </ToggleGroupItem>
      </ToggleGroup>
    </Header>
  );
}

/** Local hook for server→client shell wiring when parent owns tab state. */
export function useAiSidebarTab(defaultTab: AiSidebarTab = "chat") {
  return useState<AiSidebarTab>(defaultTab);
}
