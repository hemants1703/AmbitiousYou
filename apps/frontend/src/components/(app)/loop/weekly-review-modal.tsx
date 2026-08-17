"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveWeeklyReview } from "@/lib/actions/(app)/loop/review-actions";
import { initialWeeklyReviewField } from "@/lib/loop/weekly-review-initial";
import { toastMutation } from "@/lib/(app)/toast-mutation";
import type { WeeklyReviewPayload } from "@/types";
import { CalendarCheckIcon, Loader2Icon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface WeeklyReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  weekStartDate: string;
  weekEndDate: string;
  reviewPayload: WeeklyReviewPayload | null;
}

export function WeeklyReviewModal(props: WeeklyReviewModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const review = props.reviewPayload?.review;
  const draft = props.reviewPayload?.draft;

  const [moved, setMoved] = useState(() => initialWeeklyReviewField(review, draft, "moved"));
  const [stalled, setStalled] = useState(() => initialWeeklyReviewField(review, draft, "stalled"));
  const [skipReason, setSkipReason] = useState(() => initialWeeklyReviewField(review, draft, "skipReason"));
  const [nextWeekContract, setNextWeekContract] = useState(() => initialWeeklyReviewField(review, draft, "nextWeekContract"));

  const showDraftHint = !review && draft && (moved === draft.moved || stalled === draft.stalled);

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
        props.onClose();
        router.refresh();
      }
    });
  }

  function handleSkip() {
    startTransition(async () => {
      const result = await toastMutation(
        () =>
          saveWeeklyReview({
            moved: "(skipped)",
            stalled: "(skipped)",
            skipReason: "User skipped this week's review",
            nextWeekContract: "(skipped)",
          }),
        {
          loading: "Skipping…",
          success: "Weekly review skipped.",
          error: (msg) => msg,
        },
        { getError: (r) => r.error },
      );

      if (!result.error) {
        props.onClose();
        router.refresh();
      }
    });
  }

  const saved = Boolean(review);

  if (!props.isOpen) return null;

  return (
    <Dialog open={props.isOpen} onOpenChange={props.onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarCheckIcon className="size-6 text-accent-brand" />
            Weekly Review
          </DialogTitle>
          <DialogDescription>
            Week of {props.weekStartDate} – {props.weekEndDate}. We drafted a starting point from your week — edit anything before saving.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          {showDraftHint ? (
            <p className="rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
              Pre-filled from your activity — adjust as needed.
            </p>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="review-moved">What moved this week?</Label>
            <Textarea
              id="review-moved"
              value={moved}
              onChange={(e) => setMoved(e.target.value)}
              rows={3}
              placeholder="What progress did you make? What shipped?"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="review-stalled">What stalled?</Label>
            <Textarea
              id="review-stalled"
              value={stalled}
              onChange={(e) => setStalled(e.target.value)}
              rows={3}
              placeholder="What got stuck? What blocked you?"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="review-skip">What should you skip or defer? (optional)</Label>
            <Textarea
              id="review-skip"
              value={skipReason}
              onChange={(e) => setSkipReason(e.target.value)}
              rows={2}
              placeholder="What can you let go of this week?"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="review-next">Next week&apos;s contract</Label>
            <Textarea
              id="review-next"
              value={nextWeekContract}
              onChange={(e) => setNextWeekContract(e.target.value)}
              rows={3}
              placeholder="What's the one thing you'll commit to next week?"
            />
          </div>
          <div className="flex gap-3 border-t pt-4">
            <Button variant="outline" onClick={handleSkip} disabled={isPending}>
              <XIcon className="mr-2 size-4" />
              Skip this week
            </Button>
            <Button onClick={handleSave} disabled={isPending || !moved.trim() || !stalled.trim() || !nextWeekContract.trim()} className="ml-auto">
              {isPending ? <Loader2Icon className="size-4 animate-spin" /> : null}
              {saved ? "Update review" : "Save review"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
