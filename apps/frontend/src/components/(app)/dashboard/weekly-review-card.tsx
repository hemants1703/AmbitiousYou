"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveWeeklyReview } from "@/lib/actions/(app)/loop/review-actions";
import { toastMutation } from "@/lib/(app)/toast-mutation";
import type { WeeklyReviewPayload } from "@/types";
import { CalendarCheckIcon, ChevronDownIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface WeeklyReviewCardProps {
  initialPayload: WeeklyReviewPayload;
}

function initialField(
  review: WeeklyReviewPayload["review"],
  draft: WeeklyReviewPayload["draft"],
  field: keyof NonNullable<WeeklyReviewPayload["draft"]>,
): string {
  if (review?.[field]) return review[field] ?? "";
  return draft?.[field] ?? "";
}

export function WeeklyReviewCard(props: WeeklyReviewCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { review, draft, reviewDue } = props.initialPayload;
  const saved = Boolean(review);

  const [expanded, setExpanded] = useState(!saved || reviewDue);
  const [moved, setMoved] = useState(() => initialField(review, draft, "moved"));
  const [stalled, setStalled] = useState(() => initialField(review, draft, "stalled"));
  const [skipReason, setSkipReason] = useState(() => initialField(review, draft, "skipReason"));
  const [nextWeekContract, setNextWeekContract] = useState(() => initialField(review, draft, "nextWeekContract"));

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
                ? "Weekend check-in — we drafted a starting point from your week. Edit anything before saving."
                : saved && !reviewDue
                  ? "Saved for this week. Open when you want to update."
                  : "Four prompts: what moved, what stalled, what to skip, and next week's contract."}
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
      ) : null}
    </Card>
  );
}
