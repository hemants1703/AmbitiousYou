"use client";

import { useEffect, useState } from "react";
import { getWeeklyReviewStatus } from "@/lib/api/loop/get-weekly-review-status";

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
        const match = document.cookie.match(/sessionToken=([^;]+)/);
        const sessionToken = match ? match[1] : "";
        if (!sessionToken) {
          setLoading(false);
          return;
        }

        const data = await getWeeklyReviewStatus(sessionToken);
        if (mounted && data) {
          // Transform WeeklyReviewPayload to WeeklyReviewStatus
          const review = data.review;
          const weekStart = data.weekStartDate ? new Date(data.weekStartDate) : null;
          const weekEnd = weekStart ? new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000) : null;
          const now = new Date();
          
          setStatus({
            isWeekEnd: weekEnd ? now >= weekEnd : false,
            weekStartDate: data.weekStartDate,
            weekEndDate: weekEnd ? weekEnd.toISOString().split("T")[0] : "",
            hasCompletedReview: review !== null,
            weekStartDay: weekStart ? weekStart.getDay() : 0,
            weekEndDay: weekEnd ? weekEnd.getDay() : 6,
          });
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