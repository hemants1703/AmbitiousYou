import { deleteTaskAction } from "@/lib/actions/(app)/tasks/delete-task";
import { toggleTaskCompletionAction } from "@/lib/actions/(app)/tasks/toggle-task-completion";
import { createTaskAction } from "@/lib/actions/(app)/tasks/create-task";
import { useTrackedItems, type UseTrackedItemsParams } from "@/lib/(app)/use-tracked-items";
import type { Task } from "@ambitiousyou/shared/types";
import { act, renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/actions/(app)/tasks/create-task", () => ({ createTaskAction: vi.fn() }));
vi.mock("@/lib/actions/(app)/tasks/update-task", () => ({ updateTaskAction: vi.fn() }));
vi.mock("@/lib/actions/(app)/tasks/toggle-task-completion", () => ({ toggleTaskCompletionAction: vi.fn() }));
vi.mock("@/lib/actions/(app)/tasks/delete-task", () => ({ deleteTaskAction: vi.fn() }));
vi.mock("@/lib/actions/(app)/milestones/create-milestone", () => ({ createMilestoneAction: vi.fn() }));
vi.mock("@/lib/actions/(app)/milestones/update-milestone", () => ({ updateMilestoneAction: vi.fn() }));
vi.mock("@/lib/actions/(app)/milestones/toggle-milestone-completion", () => ({
  toggleMilestoneCompletionAction: vi.fn(),
}));
vi.mock("@/lib/actions/(app)/milestones/delete-milestone", () => ({ deleteMilestoneAction: vi.fn() }));
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));
vi.mock("@/lib/(app)/mutations/background-refresh", () => ({
  useBackgroundRefresh: () => vi.fn(),
}));

function buildTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "task-1",
    ambitionId: "amb-1",
    task: "Existing task",
    taskDescription: "",
    taskDeadline: new Date("2026-06-20"),
    taskCompleted: false,
    taskCompletedAt: null,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
    ...overrides,
  };
}

function renderTrackedItems(params: UseTrackedItemsParams) {
  return renderHook(() => useTrackedItems(params));
}

describe("useTrackedItems", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("splits open and completed items", () => {
    const sourceItems = [buildTask(), buildTask({ id: "task-2", taskCompleted: true, taskCompletedAt: new Date() })];

    const { result } = renderTrackedItems({ ambitionId: "amb-1", sourceItems });

    expect(result.current.openItems).toHaveLength(1);
    expect(result.current.completedItems).toHaveLength(1);
  });

  it("optimistically adds a task and keeps the server row on success", async () => {
    const sourceItems: Task[] = [];
    const created = buildTask({ id: "task-created", task: "New task" });
    vi.mocked(createTaskAction).mockResolvedValue({ task: created, error: null });

    const { result } = renderTrackedItems({ ambitionId: "amb-1", sourceItems });

    act(() => {
      result.current.create({ kind: "task", title: "New task", description: "", date: "2026-07-01" });
    });

    await waitFor(() => {
      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0]?.id).toBe("task-created");
      expect(result.current.error).toBeNull();
    });

    expect(createTaskAction).toHaveBeenCalledWith({
      ambitionId: "amb-1",
      task: "New task",
      taskDescription: "",
      taskDeadline: "2026-07-01",
    });
  });

  it("rolls back optimistic create when the server action fails", async () => {
    const sourceItems: Task[] = [];
    vi.mocked(createTaskAction).mockResolvedValue({ task: null, error: "Server error" });

    const { result } = renderTrackedItems({ ambitionId: "amb-1", sourceItems });

    act(() => {
      result.current.create({ kind: "task", title: "New task", description: "", date: "2026-07-01" });
    });

    await waitFor(() => {
      expect(result.current.items).toHaveLength(0);
      expect(result.current.error).toBe("Server error");
    });
  });

  it("rolls back optimistic toggle when the server action fails", async () => {
    const sourceItems = [buildTask()];
    vi.mocked(toggleTaskCompletionAction).mockResolvedValue({ task: null, error: "Cannot toggle" });

    const { result } = renderTrackedItems({ ambitionId: "amb-1", sourceItems });

    act(() => {
      result.current.toggle(sourceItems[0]!);
    });

    await waitFor(() => {
      expect(result.current.items[0]?.taskCompleted).toBe(false);
      expect(result.current.error).toBe("Cannot toggle");
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it("ignores create calls with missing title or date", async () => {
    const sourceItems: Task[] = [];
    const { result } = renderTrackedItems({ ambitionId: "amb-1", sourceItems });

    act(() => {
      result.current.create({ kind: "task", title: "   ", description: "", date: "2026-07-01" });
      result.current.create({ kind: "task", title: "Valid", description: "", date: "" });
    });

    await waitFor(() => {
      expect(result.current.items).toHaveLength(0);
    });
    expect(createTaskAction).not.toHaveBeenCalled();
  });

  it("optimistically removes an item and restores it on delete failure", async () => {
    const sourceItems = [buildTask()];
    vi.mocked(deleteTaskAction).mockResolvedValue({ error: "Delete failed" });

    const { result } = renderTrackedItems({ ambitionId: "amb-1", sourceItems });

    act(() => {
      result.current.remove("task-1");
    });

    await waitFor(() => {
      expect(result.current.items).toHaveLength(1);
      expect(result.current.error).toBe("Delete failed");
    });
  });
});
