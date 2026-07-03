import {
  formatCompletedLabel,
  getCompletedVerb,
  getDaysUntil,
  getKind,
  isCompleted,
  isMilestone,
  sortByPriority,
  toDateInputValue,
  toMoveDetail,
  toSelectedDate,
} from "@/lib/(app)/tracked-item";
import type { Milestone, Task } from "@ambitiousyou/shared/types";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const FIXED_NOW = new Date("2026-06-15T12:00:00");

function buildTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "task-1",
    ambitionId: "amb-1",
    task: "Ship feature",
    taskDescription: "Details",
    taskDeadline: new Date("2026-06-20"),
    taskCompleted: false,
    taskCompletedAt: null,
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
    milestoneDescription: "",
    milestoneTargetDate: new Date("2026-07-01"),
    milestoneCompleted: false,
    milestoneCompletedAt: null,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
    ...overrides,
  };
}

describe("getDaysUntil", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("uses whole calendar days with Math.ceil semantics", () => {
    expect(getDaysUntil(new Date("2026-06-15"))).toBe(0);
    expect(getDaysUntil(new Date("2026-06-10"))).toBe(-5);
    expect(getDaysUntil(new Date("2026-06-20"))).toBe(5);
  });
});

describe("sortByPriority", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("ranks overdue items before upcoming ones", () => {
    const overdue = buildTask({ id: "overdue", taskDeadline: new Date("2026-06-01") });
    const upcoming = buildTask({ id: "upcoming", taskDeadline: new Date("2026-06-25") });

    expect(sortByPriority(overdue, upcoming)).toBeLessThan(0);
    expect(sortByPriority(upcoming, overdue)).toBeGreaterThan(0);
  });

  it("sorts upcoming items by soonest date", () => {
    const sooner = buildTask({ id: "sooner", taskDeadline: new Date("2026-06-18") });
    const later = buildTask({ id: "later", taskDeadline: new Date("2026-06-25") });

    expect(sortByPriority(sooner, later)).toBeLessThan(0);
  });
});

describe("toDateInputValue and toSelectedDate", () => {
  it("round-trips a calendar day without UTC drift", () => {
    const inputValue = toDateInputValue(new Date("2026-06-15T15:30:00"));
    const selected = toSelectedDate(inputValue);

    expect(inputValue).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(selected?.getFullYear()).toBe(2026);
    expect(selected?.getMonth()).toBe(5);
    expect(selected?.getDate()).toBe(15);
  });

  it("returns undefined for an empty date string", () => {
    expect(toSelectedDate("")).toBeUndefined();
  });
});

describe("toMoveDetail", () => {
  it("projects tasks and milestones into a shared shape", () => {
    const task = buildTask();
    const milestone = buildMilestone({ milestoneCompleted: true });

    expect(toMoveDetail(task)).toEqual({
      id: task.id,
      kind: "task",
      ambitionId: task.ambitionId,
      title: "Ship feature",
      description: "Details",
      date: task.taskDeadline,
      completed: false,
      completedAt: null,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    });

    expect(toMoveDetail(milestone)).toMatchObject({
      kind: "milestone",
      title: "Launch",
      completed: true,
    });
  });
});

describe("structural helpers", () => {
  it("distinguishes tasks from milestones", () => {
    const task = buildTask();
    const milestone = buildMilestone();

    expect(isMilestone(task)).toBe(false);
    expect(isMilestone(milestone)).toBe(true);
    expect(getKind(task)).toBe("task");
    expect(getKind(milestone)).toBe("milestone");
    expect(isCompleted(task)).toBe(false);
    expect(getCompletedVerb(task)).toBe("completed");
    expect(getCompletedVerb(milestone)).toBe("reached");
  });

  it("formats completion labels with dates", () => {
    const completedAt = new Date("2026-07-03");
    const task = buildTask({ taskCompleted: true, taskCompletedAt: completedAt });
    const milestone = buildMilestone({ milestoneCompleted: true, milestoneCompletedAt: completedAt });

    expect(formatCompletedLabel(task)).toBe("Completed Jul 3, 2026");
    expect(formatCompletedLabel(milestone)).toBe("Reached Jul 3, 2026");
  });
});
