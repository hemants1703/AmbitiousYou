export type AmbitionWindowPhase = "not_started" | "in_progress" | "overdue" | "completed" | "missed";

export interface AmbitionWindowSummary {
  totalDays: number;
  elapsedDays: number;
  remainingDays: number;
  overdueDays: number;
  daysUntilStart: number;
  phase: AmbitionWindowPhase;
  elapsedPercent: number;
  encouragement: string;
}

export function startOfDay(dateValue: Date | string) {
  const date = new Date(dateValue);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function getDaysBetween(startDate: Date | string, endDate: Date | string) {
  const dayInMs = 1000 * 60 * 60 * 24;
  const from = startOfDay(startDate);
  const to = startOfDay(endDate);
  return Math.ceil((to.getTime() - from.getTime()) / dayInMs);
}

export function formatAmbitionDate(dateValue: Date | string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(dateValue));
}

function encouragementForProgress(remainingDays: number, elapsedRatio: number) {
  if (elapsedRatio < 0.2) {
    return "Early runway — small daily moves add up fast.";
  }
  if (elapsedRatio < 0.55) {
    return "You are in motion — guard the time you still have.";
  }
  if (remainingDays <= 7) {
    return "Final stretch — make each remaining day count.";
  }
  return "Past the halfway mark — keep leaning in.";
}

export function summarizeAmbitionWindow(
  startDate: Date | string,
  endDate: Date | string,
  options?: { today?: Date; ambitionStatus?: "active" | "completed" | "missed" },
): AmbitionWindowSummary {
  const today = startOfDay(options?.today ?? new Date());
  const start = startOfDay(startDate);
  const end = startOfDay(endDate);
  const totalDays = Math.max(1, getDaysBetween(start, end));
  const status = options?.ambitionStatus ?? "active";

  if (status === "completed") {
    return {
      totalDays,
      elapsedDays: totalDays,
      remainingDays: 0,
      overdueDays: 0,
      daysUntilStart: 0,
      phase: "completed",
      elapsedPercent: 100,
      encouragement: "You closed the loop on this ambition. Take a moment to appreciate the win.",
    };
  }

  if (status === "missed") {
    const overdueDays = today > end ? getDaysBetween(end, today) : 0;
    return {
      totalDays,
      elapsedDays: today < start ? 0 : Math.min(totalDays, getDaysBetween(start, today)),
      remainingDays: today > end ? 0 : getDaysBetween(today, end),
      overdueDays,
      daysUntilStart: today < start ? getDaysBetween(today, start) : 0,
      phase: "missed",
      elapsedPercent: today < start ? 0 : Math.min(100, Math.round((getDaysBetween(start, today) / totalDays) * 100)),
      encouragement: "This window closed without a finish — revive it or carry the lesson forward.",
    };
  }

  if (today < start) {
    const daysUntilStart = getDaysBetween(today, start);
    return {
      totalDays,
      elapsedDays: 0,
      remainingDays: totalDays,
      overdueDays: 0,
      daysUntilStart,
      phase: "not_started",
      elapsedPercent: 0,
      encouragement: `You chose a ${totalDays}-day runway — line up your first move before it opens.`,
    };
  }

  if (today > end) {
    const overdueDays = getDaysBetween(end, today);
    return {
      totalDays,
      elapsedDays: totalDays,
      remainingDays: 0,
      overdueDays,
      daysUntilStart: 0,
      phase: "overdue",
      elapsedPercent: 100,
      encouragement: "The target date passed, but progress is still possible — one deliberate move today.",
    };
  }

  const elapsedDays = getDaysBetween(start, today);
  const remainingDays = getDaysBetween(today, end);
  const elapsedPercent = Math.min(100, Math.round((elapsedDays / totalDays) * 100));

  return {
    totalDays,
    elapsedDays,
    remainingDays,
    overdueDays: 0,
    daysUntilStart: 0,
    phase: "in_progress",
    elapsedPercent,
    encouragement: encouragementForProgress(remainingDays, elapsedDays / totalDays),
  };
}
