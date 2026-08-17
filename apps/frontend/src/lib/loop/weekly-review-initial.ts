import type { WeeklyReview, WeeklyReviewDraft } from "@/types";

export function initialWeeklyReviewField(
  review: WeeklyReview | null | undefined,
  draft: WeeklyReviewDraft | null | undefined,
  field: keyof WeeklyReviewDraft,
): string {
  const saved = review?.[field];
  if (typeof saved === "string" && saved.length > 0) return saved;
  return draft?.[field] ?? "";
}
