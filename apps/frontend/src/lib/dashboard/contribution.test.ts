import type { AmbitionDetails } from "@/lib/api/ambitions/get-ambition-details";
import { buildContributionCalendar } from "@/lib/dashboard/contribution";
import type { Task } from "@ambitiousyou/shared/types";
import { describe, expect, it } from "vitest";

const FIXED_NOW = new Date("2026-06-15T12:00:00");

function buildAmbition(overrides: Partial<AmbitionDetails> = {}): AmbitionDetails {
  return {
    id: "amb-1",
    userId: "user-1",
    ambitionName: "Test Ambition",
    ambitionDefinition: "",
    ambitionMotivation: null,
    ambitionStartDate: new Date("2026-01-01"),
    ambitionEndDate: new Date("2026-12-31"),
    ambitionPriority: "medium",
    ambitionStatus: "active",
    ambitionPercentageCompleted: 0,
    isFavourited: false,
    ambitionCompletionDate: null,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
    tasks: [],
    milestones: [],
    notes: [],
    ...overrides,
  };
}

function buildTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "task-1",
    ambitionId: "amb-1",
    task: "Ship feature",
    taskDescription: null,
    taskDeadline: new Date("2026-06-20"),
    taskCompleted: true,
    taskCompletedAt: new Date("2026-06-14T15:00:00"),
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
    ...overrides,
  };
}

describe("buildContributionCalendar", () => {
  it("builds a Sunday-aligned week grid with weekday labels", () => {
    const calendar = buildContributionCalendar([], FIXED_NOW);

    expect(calendar.weekdayLabels).toEqual(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
    expect(calendar.numWeeks).toBeGreaterThan(50);
    expect(calendar.rangeEndKey).toBe("2026-06-15");
  });

  it("counts completions and scales levels against the busiest day", () => {
    const ambitions = [
      buildAmbition({
        tasks: [
          buildTask({ id: "t1", taskCompletedAt: new Date("2026-06-14T10:00:00") }),
          buildTask({ id: "t2", taskCompletedAt: new Date("2026-06-14T11:00:00") }),
          buildTask({ id: "t3", taskCompletedAt: new Date("2026-06-15T10:00:00") }),
        ],
      }),
    ];

    const calendar = buildContributionCalendar(ambitions, FIXED_NOW);

    expect(calendar.stats.totalCompleted).toBe(3);
    expect(calendar.stats.activeDays).toBe(2);
    expect(calendar.stats.taskCount).toBe(3);
    expect(calendar.stats.hasAnyCompletionEver).toBe(true);
    expect(calendar.stats.bestDay).toMatchObject({ dateKey: "2026-06-14", count: 2 });
    expect(calendar.stats.currentStreak).toBe(2);
  });

  it("returns zero stats when there are no completions", () => {
    const calendar = buildContributionCalendar([], FIXED_NOW);

    expect(calendar.stats.totalCompleted).toBe(0);
    expect(calendar.stats.activeDays).toBe(0);
    expect(calendar.stats.longestStreak).toBe(0);
    expect(calendar.stats.hasAnyCompletionEver).toBe(false);
  });
});
