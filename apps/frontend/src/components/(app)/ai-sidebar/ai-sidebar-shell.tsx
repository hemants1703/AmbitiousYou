"use client";

import { Suspense, use } from "react";
import { AiSidebarHeader, type AiSidebarTab, useAiSidebarTab } from "./ai-sidebar-header";
import { AiChatPanel } from "./ai-chat-panel";
import { AiBreakdownPanel } from "./ai-breakdown-panel";
import { AiCoachPanel } from "./ai-coach-panel";
import type { AttentionCoachPayload } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface AiSidebarShellProps {
  ambitionId?: string;
  coachPromise: Promise<AttentionCoachPayload | null>;
}

export function AiSidebarShell(props: AiSidebarShellProps) {
  const [tab, setTab] = useAiSidebarTab("chat");

  return (
    <div className="flex size-full min-h-0 flex-col">
      <AiSidebarHeader tab={tab} onTabChange={setTab} />
      <AiSidebarTabPanel tab={tab} ambitionId={props.ambitionId} coachPromise={props.coachPromise} />
    </div>
  );
}

interface AiSidebarTabPanelProps {
  tab: AiSidebarTab;
  ambitionId?: string;
  coachPromise: Promise<AttentionCoachPayload | null>;
}

function AiSidebarTabPanel(props: AiSidebarTabPanelProps) {
  switch (props.tab) {
    case "breakdown":
      return <AiBreakdownPanel ambitionId={props.ambitionId} />;
    case "coach":
      return (
        <Suspense fallback={<CoachPanelSkeleton />}>
          <AiCoachPanelFromPromise coachPromise={props.coachPromise} />
        </Suspense>
      );
    case "chat":
    default:
      return <AiChatPanel />;
  }
}

function AiCoachPanelFromPromise(props: { coachPromise: Promise<AttentionCoachPayload | null> }) {
  const coach = use(props.coachPromise);
  return <AiCoachPanel coach={coach} />;
}

function CoachPanelSkeleton() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 px-4 py-2 md:px-5">
      <Skeleton className="h-28 w-full rounded-2xl" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}
