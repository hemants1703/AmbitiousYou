"use client";

import { useEffect, useState } from "react";
import { getWeeklyReviewStatus } from "@/lib/api/loop/get-weekly-review-status";
import { getSessionToken } from "@/lib/cache/session-data";

interface WeeklyReviewStatus {
  isWeekEnd: boolean;
  weekStartDate: string;
  weekEndDate: string;
  hasCompletedReview: boolean;
  weekStartDay: number;
  weekEndDay: number;
}

export function useWeeklyReview() {
  const [status, setStatus] = useState<WeeklyReviewStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function checkStatus() {
      try {
        const sessionToken = await getSessionToken();
        if (!sessionToken) {
          setLoading(false);
          return;
        }

        const data = await getWeeklyReviewStatus(sessionToken);
        if (mounted) {
          setStatus(data);
          setLoading(false);
        }
      } catch {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    checkStatus();

    return () => {
      mounted = false;
    };
  }, []);

  const shouldShowModal = status?.isWeekEnd && !status?.hasCompletedReview && !loading;

  // Check localStorage for dismissal
  const dismissedKey = `weekly-review-dismissed-${status?.weekStartDate}`;
  const wasDismissed = typeof window !== "undefined" && localStorage.getItem(dismissedKey) === "true";

  return {
    status,
    loading,
    shouldShowModal: shouldShowModal && !wasDismissed,
    dismissModal: () => {
      if (status?.weekStartDate) {
        localStorage.setItem(`weekly-review-dismissed-${status.weekStartDate}`, "true");
      }
    },
  };
}