"use client";

import { Suspense } from "react";
import { AiSidebarHeader } from "./ai-sidebar-header";
import { AiChatPanel } from "./ai-chat-panel";
import { AiBreakdownPanel } from "./ai-breakdown-panel";
import { WeeklyReviewPanel } from "./weekly-review-panel";
import { AiCoachPanel } from "./ai-coach-panel";
import { AiCalendarPanel } from "./ai-calendar-panel";
import { AiSidebarContent as Content, AiSidebarFooter } from "@/components/ui/ai-sidebar";
import { getWeeklyReviewStatus } from "@/lib/api/loop/get-weekly-review-status";
import { getAttentionCoach } from "@/lib/api/loop/get-loop-data";
import { Skeleton } from "@/components/ui/skeleton";

interface AiSidebarContentProps {
  sessionToken: string;
  ambitionId?: string;
}

async function WeeklyReviewSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-1/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-10 w-1/3" />
    </div>
  );
}

async function CoachSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-1/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

async function AiSidebarContentInner(props: AiSidebarContentProps) {
  const [status, coach] = await Promise.all([
    getWeeklyReviewStatus(props.sessionToken),
    getAttentionCoach(props.sessionToken),
  ]);

  return (
    <>
      <AiSidebarHeader />
      <Content className="flex-1 overflow-y-auto">
        <AiChatPanel />
        <AiBreakdownPanel ambitionId={props.ambitionId} />
        <Suspense fallback={<WeeklyReviewSkeleton />}>
          <WeeklyReviewPanel initialPayload={{
            review: status.hasCompletedReview ? { 
              id: "", 
              userId: "", 
              ambitionId: "", 
              weekStartDate: status.weekStartDate, 
              moved: "", 
              stalled: "", 
              skipReason: null, 
              nextWeekContract: "", 
              createdAt: new Date(), 
              updatedAt: new Date() 
            } : null,
            weekStartDate: status.weekStartDate,
            title: `Weekly review ${status.weekStartDate}`
          }} />
        </Suspense>
        <Suspense fallback={<CoachSkeleton />}>
          <AiCoachPanel coach={coach} />
        </Suspense>
        <AiCalendarPanel />
      </Content>
      <AiSidebarFooter />
    </>
  );
}

export function AiSidebarContent(props: AiSidebarContentProps) {
  return <AiSidebarContentInner {...props} />;
}