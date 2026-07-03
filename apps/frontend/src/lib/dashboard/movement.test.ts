import type { AmbitionDetails } from "@/lib/api/ambitions/get-ambition-details";
import { buildMovementSeries } from "@/lib/dashboard/movement";
import type { Milestone, Task } from "@ambitiousyou/shared/types";
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

function buildMilestone(overrides: Partial<Milestone> = {}): Milestone {
  return {
    id: "ms-1",
    ambitionId: "amb-1",
    milestone: "Launch",
    milestoneDescription: null,
    milestoneTargetDate: new Date("2026-07-01"),
    milestoneCompleted: true,
    milestoneCompletedAt: new Date("2026-06-15T09:00:00"),
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
    ...overrides,
  };
}

describe("buildMovementSeries", () => {
  it("returns exactly window days, oldest to newest", () => {
    const series = buildMovementSeries([], 7, FIXED_NOW);

    expect(series.days).toHaveLength(7);
    expect(series.days[0]?.dateKey).toBe("2026-06-09");
    expect(series.days[6]?.dateKey).toBe("2026-06-15");
  });

  it("buckets completed tasks and milestones into the correct day", () => {
    const ambitions = [
      buildAmbition({
        tasks: [buildTask()],
        milestones: [buildMilestone()],
      }),
    ];

    const series = buildMovementSeries(ambitions, 7, FIXED_NOW);
    const yesterday = series.days.find((day) => day.dateKey === "2026-06-14");
    const today = series.days.find((day) => day.dateKey === "2026-06-15");

    expect(yesterday).toMatchObject({ taskCount: 1, milestoneCount: 0, total: 1 });
    expect(today).toMatchObject({ taskCount: 0, milestoneCount: 1, total: 1 });
    expect(series.stats.totalCompleted).toBe(2);
    expect(series.stats.taskCount).toBe(1);
    expect(series.stats.milestoneCount).toBe(1);
    expect(series.stats.hasAnyCompletionEver).toBe(true);
  });

  it("computes current streak ending today", () => {
    const ambitions = [
      buildAmbition({
        tasks: [
          buildTask({ taskCompletedAt: new Date("2026-06-14T10:00:00") }),
          buildTask({ id: "task-2", taskCompletedAt: new Date("2026-06-15T10:00:00") }),
        ],
        milestones: [],
      }),
    ];

    const series = buildMovementSeries(ambitions, 7, FIXED_NOW);

    expect(series.stats.currentStreak).toBe(2);
    expect(series.stats.bestDay?.total).toBe(1);
    expect(series.stats.dailyAverage).toBe(0.3);
  });

  it("ignores completions outside the window", () => {
    const ambitions = [
      buildAmbition({
        tasks: [buildTask({ taskCompletedAt: new Date("2026-05-01T10:00:00") })],
      }),
    ];

    const series = buildMovementSeries(ambitions, 7, FIXED_NOW);

    expect(series.stats.totalCompleted).toBe(0);
    expect(series.stats.hasAnyCompletionEver).toBe(true);
  });
});
