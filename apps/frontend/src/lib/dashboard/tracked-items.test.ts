import type { AmbitionDetails } from "@/lib/api/ambitions/get-ambition-details";
import type { QueueItem } from "@/lib/dashboard/tracked-items";
import {
  bucketByDeadline,
  computeAttentionFlags,
  summarizeAttention,
  dayKey,
  getDaysUntil,
  pickLeadMotivation,
  sortByUrgency,
} from "@/lib/dashboard/tracked-items";
import type { Task } from "@ambitiousyou/shared/types";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const FIXED_NOW = new Date("2026-06-15T12:00:00");

function buildAmbition(overrides: Partial<AmbitionDetails> = {}): AmbitionDetails {
  return {
    id: "amb-1",
    userId: "user-1",
    ambitionName: "Test Ambition",
    ambitionDefinition: "",
    ambitionMotivation: "Stay focused",
    ambitionStartDate: new Date("2026-01-01"),
    ambitionEndDate: new Date("2026-12-31"),
    ambitionPriority: "medium",
    ambitionStatus: "active",
    ambitionPercentageCompleted: 25,
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
    taskCompleted: false,
    taskCompletedAt: null,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
    ...overrides,
  };
}

function buildQueueItem(overrides: Partial<QueueItem> = {}): QueueItem {
  return {
    id: "item-1",
    kind: "task",
    title: "Task",
    description: null,
    date: new Date("2026-06-15"),
    daysUntil: 0,
    ambitionId: "amb-1",
    ambitionName: "Test Ambition",
    ambitionPriority: "medium",
    ambitionMotivation: "Stay focused",
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

  it("returns 0 for today", () => {
    expect(getDaysUntil(new Date("2026-06-15"))).toBe(0);
  });

  it("returns negative days for overdue dates", () => {
    expect(getDaysUntil(new Date("2026-06-10"))).toBe(-5);
  });

  it("returns positive days for future dates", () => {
    expect(getDaysUntil(new Date("2026-06-20"))).toBe(5);
  });
});

describe("sortByUrgency", () => {
  it("sorts by daysUntil ascending, then by priority", () => {
    const overdue = buildQueueItem({ id: "a", daysUntil: -2, ambitionPriority: "low" });
    const todayHigh = buildQueueItem({ id: "b", daysUntil: 0, ambitionPriority: "high" });
    const todayLow = buildQueueItem({ id: "c", daysUntil: 0, ambitionPriority: "low" });

    const sorted = [todayLow, overdue, todayHigh].sort(sortByUrgency);

    expect(sorted.map((item) => item.id)).toEqual(["a", "b", "c"]);
  });
});

describe("bucketByDeadline", () => {
  it("counts items in each deadline window", () => {
    const buckets = bucketByDeadline([
      buildQueueItem({ daysUntil: -1 }),
      buildQueueItem({ daysUntil: 0 }),
      buildQueueItem({ daysUntil: 3 }),
      buildQueueItem({ daysUntil: 10 }),
      buildQueueItem({ daysUntil: 20 }),
    ]);

    expect(buckets).toEqual({ overdue: 1, today: 1, thisWeek: 1, nextWeek: 1 });
  });
});

describe("dayKey", () => {
  it("formats dates as yyyy-mm-dd", () => {
    expect(dayKey(new Date("2026-06-05"))).toBe("2026-06-05");
  });
});

describe("summarizeAttention", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("counts overdue moves instead of ambition end dates", () => {
    const ambitions = [
      buildAmbition({
        ambitionEndDate: new Date("2026-12-31"),
        tasks: [
          buildTask({ id: "task-1", taskDeadline: new Date("2026-06-01"), taskCompleted: false }),
          buildTask({ id: "task-2", taskDeadline: new Date("2026-06-10"), taskCompleted: false }),
        ],
      }),
    ];

    const summary = summarizeAttention(ambitions);

    expect(summary.totalCount).toBe(2);
    expect(summary.overdueCount).toBe(2);
    expect(summary.dueTodayCount).toBe(0);
  });
});

describe("computeAttentionFlags", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("flags overdue ambitions first", () => {
    const ambitions = [
      buildAmbition({
        tasks: [buildTask({ taskDeadline: new Date("2026-06-01"), taskCompleted: false })],
      }),
    ];

    const flags = computeAttentionFlags(ambitions);

    expect(flags).toHaveLength(1);
    expect(flags[0]?.severity).toBe("overdue");
    expect(flags[0]?.reason).toBe("1 move overdue");
  });

  it("flags ready ambitions when all moves are done", () => {
    const ambitions = [
      buildAmbition({
        tasks: [buildTask({ taskCompleted: true, taskCompletedAt: new Date("2026-06-10") })],
      }),
    ];

    const flags = computeAttentionFlags(ambitions);

    expect(flags).toHaveLength(1);
    expect(flags[0]?.severity).toBe("ready");
  });

  it("flags stalled ambitions near deadline with low progress", () => {
    const ambitions = [
      buildAmbition({
        ambitionEndDate: new Date("2026-06-18"),
        ambitionPercentageCompleted: 20,
        tasks: [buildTask({ taskDeadline: new Date("2026-06-20"), taskCompleted: false })],
      }),
    ];

    const flags = computeAttentionFlags(ambitions);

    expect(flags).toHaveLength(1);
    expect(flags[0]?.severity).toBe("stalled");
  });
});

describe("pickLeadMotivation", () => {
  it("prefers motivation from the most urgent open item", () => {
    const openItems = [
      buildQueueItem({ ambitionId: "a", ambitionName: "First", ambitionMotivation: "  Win big  " }),
      buildQueueItem({ ambitionId: "b", ambitionName: "Second", ambitionMotivation: "Other" }),
    ];

    expect(pickLeadMotivation(openItems, [])).toEqual({
      ambitionId: "a",
      ambitionName: "First",
      motivation: "Win big",
    });
  });

  it("falls back to any active ambition with motivation", () => {
    const ambitions = [buildAmbition({ ambitionMotivation: "Keep going" })];

    expect(pickLeadMotivation([], ambitions)).toEqual({
      ambitionId: "amb-1",
      ambitionName: "Test Ambition",
      motivation: "Keep going",
    });
  });

  it("returns null when no motivation is set", () => {
    expect(pickLeadMotivation([], [buildAmbition({ ambitionMotivation: null })])).toBeNull();
  });
});
