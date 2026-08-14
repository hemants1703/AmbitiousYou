"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveWeeklyReview } from "@/lib/actions/(app)/loop/review-actions";
import { toastMutation } from "@/lib/(app)/toast-mutation";
import type { WeeklyReviewPayload } from "@/types";
import { CalendarCheckIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AiSidebarGroup, AiSidebarGroupLabel, AiSidebarGroupContent } from "@/components/ui/ai-sidebar";

interface WeeklyReviewPanelProps {
  initialPayload: WeeklyReviewPayload;
}

export function WeeklyReviewPanel(props: WeeklyReviewPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [moved, setMoved] = useState(props.initialPayload.review?.moved ?? "");
  const [stalled, setStalled] = useState(props.initialPayload.review?.stalled ?? "");
  const [skipReason, setSkipReason] = useState(props.initialPayload.review?.skipReason ?? "");
  const [nextWeekContract, setNextWeekContract] = useState(props.initialPayload.review?.nextWeekContract ?? "");

  function handleSave() {
    startTransition(async () => {
      const result = await toastMutation(
        () =>
          saveWeeklyReview({
            moved,
            stalled,
            skipReason: skipReason.trim() || undefined,
            nextWeekContract,
          }),
        {
          loading: "Saving review…",
          success: "Weekly review saved.",
          error: (msg) => msg,
        },
        { getError: (r) => r.error },
      );

      if (!result.error) {
        router.refresh();
      }
    });
  }

  const saved = Boolean(props.initialPayload.review);

  return (
    <AiSidebarGroup>
      <AiSidebarGroupLabel>Weekly Review</AiSidebarGroupLabel>
      <AiSidebarGroupContent className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarCheckIcon className="size-4 text-foreground" />
              {props.initialPayload.title}
            </CardTitle>
            <CardDescription>Four prompts: what moved, what stalled, what to skip, and next week&apos;s contract.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="review-moved">What moved this week?</Label>
              <Textarea id="review-moved" value={moved} onChange={(e) => setMoved(e.target.value)} rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="review-stalled">What stalled?</Label>
              <Textarea id="review-stalled" value={stalled} onChange={(e) => setStalled(e.target.value)} rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="review-skip">What should you skip or defer? (optional)</Label>
              <Textarea id="review-skip" value={skipReason} onChange={(e) => setSkipReason(e.target.value)} rows={2} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="review-next">Next week&apos;s contract</Label>
              <Textarea id="review-next" value={nextWeekContract} onChange={(e) => setNextWeekContract(e.target.value)} rows={3} />
            </div>
            <Button onClick={handleSave} disabled={isPending || !moved.trim() || !stalled.trim() || !nextWeekContract.trim()}>
              {isPending ? <Loader2Icon className="size-4 animate-spin" /> : null}
              {saved ? "Update review" : "Save review"}
            </Button>
          </CardContent>
        </Card>
      </AiSidebarGroupContent>
    </AiSidebarGroup>
  );
}