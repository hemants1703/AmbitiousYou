"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AiSidebarGroup, AiSidebarGroupContent, AiSidebarGroupLabel } from "@/components/ui/ai-sidebar";
import { saveWeeklyReview } from "@/lib/actions/(app)/loop/review-actions";
import { initialWeeklyReviewField } from "@/lib/loop/weekly-review-initial";
import { toastMutation } from "@/lib/(app)/toast-mutation";
import type { WeeklyReviewPayload } from "@/types";
import { CalendarCheckIcon, ChevronDownIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface WeeklyReviewPanelProps {
  initialPayload: WeeklyReviewPayload;
}

export function WeeklyReviewPanel(props: WeeklyReviewPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { review, draft, reviewDue } = props.initialPayload;
  const saved = Boolean(review);

  const [expanded, setExpanded] = useState(!saved || reviewDue);
  const [moved, setMoved] = useState(() => initialWeeklyReviewField(review, draft, "moved"));
  const [stalled, setStalled] = useState(() => initialWeeklyReviewField(review, draft, "stalled"));
  const [skipReason, setSkipReason] = useState(() => initialWeeklyReviewField(review, draft, "skipReason"));
  const [nextWeekContract, setNextWeekContract] = useState(() => initialWeeklyReviewField(review, draft, "nextWeekContract"));

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
        if (!reviewDue) setExpanded(false);
        router.refresh();
      }
    });
  }

  const showDraftHint = !saved && draft && (moved === draft.moved || stalled === draft.stalled);

  return (
    <AiSidebarGroup>
      <AiSidebarGroupLabel>Weekly Review</AiSidebarGroupLabel>
      <AiSidebarGroupContent className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5">
                <CardTitle className="flex items-center gap-2">
                  <CalendarCheckIcon className="size-4 text-foreground" />
                  {props.initialPayload.title}
                </CardTitle>
                <CardDescription>
                  {reviewDue && !saved
                    ? "We drafted a starting point from your week — edit before saving."
                    : saved && !reviewDue
                      ? "Saved for this week. Open when you want to update."
                      : "What moved, what stalled, what to skip, and next week's contract."}
                </CardDescription>
              </div>
              {saved && !reviewDue ? (
                <Button variant="ghost" size="sm" className="shrink-0" onClick={() => setExpanded((open) => !open)}>
                  {expanded ? "Hide" : "View"}
                  <ChevronDownIcon className={`size-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
                </Button>
              ) : null}
            </div>
          </CardHeader>
          {expanded ? (
            <CardContent className="space-y-4">
              {showDraftHint ? (
                <p className="rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
                  Pre-filled from your activity — adjust as needed.
                </p>
              ) : null}
              <div className="space-y-2">
                <Label htmlFor="sidebar-review-moved">What moved this week?</Label>
                <Textarea id="sidebar-review-moved" value={moved} onChange={(e) => setMoved(e.target.value)} rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sidebar-review-stalled">What stalled?</Label>
                <Textarea id="sidebar-review-stalled" value={stalled} onChange={(e) => setStalled(e.target.value)} rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sidebar-review-skip">What should you skip or defer? (optional)</Label>
                <Textarea id="sidebar-review-skip" value={skipReason} onChange={(e) => setSkipReason(e.target.value)} rows={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sidebar-review-next">Next week&apos;s contract</Label>
                <Textarea id="sidebar-review-next" value={nextWeekContract} onChange={(e) => setNextWeekContract(e.target.value)} rows={3} />
              </div>
              <Button onClick={handleSave} disabled={isPending || !moved.trim() || !stalled.trim() || !nextWeekContract.trim()}>
                {isPending ? <Loader2Icon className="size-4 animate-spin" /> : null}
                {saved ? "Update review" : "Save review"}
              </Button>
            </CardContent>
          ) : null}
        </Card>
      </AiSidebarGroupContent>
    </AiSidebarGroup>
  );
}
