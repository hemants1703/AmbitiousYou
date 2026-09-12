"use client";

import { loadWeeklyReviewCurrent, loadWeeklyReviewStatus } from "@/lib/actions/(app)/loop/review-actions";
import type { WeeklyReviewPayload, WeeklyReviewStatusPayload } from "@/types";
import { useEffect, useState } from "react";

export function useWeeklyReview() {
  const [status, setStatus] = useState<WeeklyReviewStatusPayload | null>(null);
  const [reviewPayload, setReviewPayload] = useState<WeeklyReviewPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function checkStatus() {
      try {
        const data = await loadWeeklyReviewStatus();
        if (!mounted) return;

        if (data) {
          setStatus(data);

          if (data.isWeekEnd && !data.hasCompletedReview) {
            const review = await loadWeeklyReviewCurrent();
            if (mounted) setReviewPayload(review);
          }
        }
      } catch {
        // Backend unreachable or session invalid — modal stays hidden.
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void checkStatus();

    return () => {
      mounted = false;
    };
  }, []);

  const [dismissed, setDismissed] = useState(false);

  const shouldShowModal = Boolean(status?.isWeekEnd && !status.hasCompletedReview && !loading);

  const dismissedKey = status ? `weekly-review-dismissed-${status.weekStartDate}` : null;
  const wasDismissed = dismissedKey && typeof window !== "undefined" && localStorage.getItem(dismissedKey) === "true";

  return {
    status,
    reviewPayload,
    loading,
    shouldShowModal: shouldShowModal && !wasDismissed && !dismissed,
    dismissModal: () => {
      if (dismissedKey) {
        localStorage.setItem(dismissedKey, "true");
      }
      setDismissed(true);
    },
  };
}
