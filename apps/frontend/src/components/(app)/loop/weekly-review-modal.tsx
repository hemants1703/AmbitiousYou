"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveWeeklyReview } from "@/lib/actions/(app)/loop/review-actions";
import { toastMutation } from "@/lib/(app)/toast-mutation";
import type { WeeklyReviewPayload, WeeklyReview } from "@/types";
import { CalendarCheckIcon, Loader2Icon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface WeeklyReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  weekStartDate: string;
  weekEndDate: string;
  existingReview?: WeeklyReview | null;
}

export function WeeklyReviewModal(props: WeeklyReviewModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [moved, setMoved] = useState(props.existingReview?.moved ?? "");
  const [stalled, setStalled] = useState(props.existingReview?.stalled ?? "");
  const [skipReason, setSkipReason] = useState(props.existingReview?.skipReason ?? "");
  const [nextWeekContract, setNextWeekContract] = useState(props.existingReview?.nextWeekContract ?? "");

  // Reset form when modal opens/closes or week changes
  useEffect(() => {
    if (props.isOpen && props.existingReview) {
      setMoved(props.existingReview.moved);
      setStalled(props.existingReview.stalled);
      setSkipReason(props.existingReview.skipReason ?? "");
      setNextWeekContract(props.existingReview.nextWeekContract);
    } else if (props.isOpen) {
      setMoved("");
      setStalled("");
      setSkipReason("");
      setNextWeekContract("");
    }
  }, [props.isOpen, props.existingReview, props.weekStartDate]);

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
        router.refresh();
      }
    });
  }

  const saved = Boolean(props.existingReview);

  if (!props.isOpen) return null;

  return (
    <Dialog open={props.isOpen} onOpenChange={props.onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarCheckIcon className="size-6 text-accent-brand" />
            Weekly Review
          </DialogTitle>
          <DialogDescription>
            Week of {props.weekStartDate} – {props.weekEndDate}. Four prompts: what moved, what stalled, what to skip, and next week&apos;s contract.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="review-moved">What moved this week?</Label>
            <Textarea id="review-moved" value={moved} onChange={(e) => setMoved(e.target.value)} rows={3} placeholder="What progress did you make? What shipped?" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="review-stalled">What stalled?</Label>
            <Textarea id="review-stalled" value={stalled} onChange={(e) => setStalled(e.target.value)} rows={3} placeholder="What got stuck? What blocked you?" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="review-skip">What should you skip or defer? (optional)</Label>
            <Textarea id="review-skip" value={skipReason} onChange={(e) => setSkipReason(e.target.value)} rows={2} placeholder="What can you let go of this week?" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="review-next">Next week&apos;s contract</Label>
            <Textarea id="review-next" value={nextWeekContract} onChange={(e) => setNextWeekContract(e.target.value)} rows={3} placeholder="What's the one thing you'll commit to next week?" />
          </div>
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleSkip} disabled={isPending}>
              <XIcon className="size-4 mr-2" />
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