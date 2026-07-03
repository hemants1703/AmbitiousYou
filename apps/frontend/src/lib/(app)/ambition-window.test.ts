import { describe, expect, it } from "vitest";
import { getDaysBetween, summarizeAmbitionWindow } from "./ambition-window";

describe("summarizeAmbitionWindow", () => {
  const start = "2026-07-03";
  const end = "2026-07-31";

  it("reports a not-started window", () => {
    const summary = summarizeAmbitionWindow(start, end, { today: new Date("2026-07-01") });
    expect(summary.phase).toBe("not_started");
    expect(summary.totalDays).toBe(getDaysBetween(start, end));
    expect(summary.elapsedDays).toBe(0);
    expect(summary.remainingDays).toBe(summary.totalDays);
    expect(summary.daysUntilStart).toBe(2);
  });

  it("reports elapsed and remaining days while in progress", () => {
    const summary = summarizeAmbitionWindow(start, end, { today: new Date("2026-07-10") });
    expect(summary.phase).toBe("in_progress");
    expect(summary.elapsedDays).toBe(7);
    expect(summary.remainingDays).toBe(21);
    expect(summary.elapsedDays + summary.remainingDays).toBe(summary.totalDays);
  });

  it("reports overdue days after the target", () => {
    const summary = summarizeAmbitionWindow(start, end, { today: new Date("2026-08-05") });
    expect(summary.phase).toBe("overdue");
    expect(summary.overdueDays).toBe(5);
    expect(summary.remainingDays).toBe(0);
  });

  it("marks completed ambitions as finished", () => {
    const summary = summarizeAmbitionWindow(start, end, {
      today: new Date("2026-07-20"),
      ambitionStatus: "completed",
    });
    expect(summary.phase).toBe("completed");
    expect(summary.remainingDays).toBe(0);
    expect(summary.elapsedPercent).toBe(100);
  });
});
