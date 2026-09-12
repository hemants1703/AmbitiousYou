"use client";

import { Separator, type SeparatorProps } from "@/components/ui/separator";
import { SidebarTrigger, type SidebarTriggerProps } from "@/components/ui/sidebar";
import { AiSidebarTrigger } from "@/components/ui/ai-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { HeaderNav } from "@/components/header-nav";
import * as React from "react";
import { Suspense } from "react";
import type { SiteHeaderProps } from "@/components/site-header-props";

export type { SiteHeaderProps };

export function SiteHeader({ inboxSlot, showAiSidebar }: SiteHeaderProps): React.ReactElement {
  const sidebarTriggerProps: SidebarTriggerProps = { className: "-ml-1" };
  const separatorProps: SeparatorProps = { orientation: "vertical", className: "mx-2" };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-px border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="relative flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger {...sidebarTriggerProps} />
        <Separator {...separatorProps} />
        <Suspense fallback={null}>
          <HeaderNav />
        </Suspense>
        <div className="ml-auto flex items-center gap-1">
          {inboxSlot}
          {showAiSidebar ? <AiSidebarTrigger /> : null}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
