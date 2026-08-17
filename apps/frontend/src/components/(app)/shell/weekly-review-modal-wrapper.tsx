"use client";

import { useWeeklyReview } from "@/hooks/use-weekly-review";
import { WeeklyReviewModal } from "@/components/(app)/loop/weekly-review-modal";

export function WeeklyReviewModalWrapper() {
  const { status, loading, shouldShowModal, dismissModal } = useWeeklyReview();

  if (loading || !status || !shouldShowModal) {
    return null;
  }

  return (
    <WeeklyReviewModal
      isOpen={true}
      onClose={dismissModal}
      weekStartDate={status.weekStartDate}
      weekEndDate={status.weekEndDate}
    />
  );
}