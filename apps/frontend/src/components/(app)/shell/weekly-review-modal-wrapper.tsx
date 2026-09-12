"use client";

import { useWeeklyReview } from "@/hooks/use-weekly-review";
import { WeeklyReviewModal } from "@/components/(app)/loop/weekly-review-modal";

export function WeeklyReviewModalWrapper() {
  const { status, reviewPayload, loading, shouldShowModal, dismissModal } = useWeeklyReview();

  if (loading || !status || !shouldShowModal) {
    return null;
  }

  return (
    <WeeklyReviewModal
      key={`${status.weekStartDate}-${reviewPayload?.review?.id ?? "draft"}`}
      isOpen={true}
      onClose={dismissModal}
      weekStartDate={status.weekStartDate}
      weekEndDate={status.weekEndDate}
      reviewPayload={reviewPayload}
    />
  );
}
