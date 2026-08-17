"use client";

import { useEffect, useState } from "react";
import { fetchWeeklyReviewCurrent, getWeeklyReviewStatus } from "@/lib/api/loop/get-weekly-review-status";
import type { WeeklyReviewPayload, WeeklyReviewStatusPayload } from "@/types";

function readSessionToken(): string {
  const match = document.cookie.match(/sessionToken=([^;]+)/);
  return match ? match[1] : "";
}

export function useWeeklyReview() {
  const [status, setStatus] = useState<WeeklyReviewStatusPayload | null>(null);
  const [reviewPayload, setReviewPayload] = useState<WeeklyReviewPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function checkStatus() {
      try {
        const sessionToken = readSessionToken();
        if (!sessionToken) {
          if (mounted) setLoading(false);
          return;
        }

        const data = await getWeeklyReviewStatus(sessionToken);
        if (!mounted) return;

        if (data) {
          setStatus(data);

          if (data.isWeekEnd && !data.hasCompletedReview) {
            const review = await fetchWeeklyReviewCurrent(sessionToken);
            if (mounted) setReviewPayload(review);
          }
        }
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
