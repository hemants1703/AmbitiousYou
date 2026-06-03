/**
 * Persists the in-progress create-ambition form to localStorage so a half-filled
 * form survives navigation/reload and restores on return. The draft is cleared
 * only once the ambition is actually created (see create-ambition-form.tsx).
 *
 * All access is SSR-guarded and failure-tolerant: a missing window, corrupt JSON,
 * an old schema version, or a write that throws (quota / private mode) degrades to
 * "no draft" rather than crashing the form.
 */

export type TaskDraft = {
  id: string;
  task: string;
  taskDescription: string;
  taskDeadline: string;
};

export type MilestoneDraft = {
  id: string;
  milestone: string;
  milestoneDescription: string;
  milestoneTargetDate: string;
};

export interface CreateAmbitionDraft {
  ambitionName: string;
  ambitionDefinition: string;
  trackingMethod: "task" | "milestone";
  priority: "low" | "medium" | "high";
  startDate: string; // "YYYY-MM-DD" | ""  (dateRange is reconstructed from these on load)
  endDate: string; // "YYYY-MM-DD" | ""
  tasks: TaskDraft[];
  milestones: MilestoneDraft[];
}

const STORAGE_KEY = "ambitiousyou:create-ambition-draft:v1";
const DRAFT_VERSION = 1;

type DraftEnvelope = {
  version: number;
  draft: CreateAmbitionDraft;
};

function normalizeTasks(value: unknown): TaskDraft[] {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => {
    const record = (entry ?? {}) as Partial<TaskDraft>;
    return {
      id: typeof record.id === "string" && record.id ? record.id : crypto.randomUUID(),
      task: typeof record.task === "string" ? record.task : "",
      taskDescription: typeof record.taskDescription === "string" ? record.taskDescription : "",
      taskDeadline: typeof record.taskDeadline === "string" ? record.taskDeadline : "",
    };
  });
}

function normalizeMilestones(value: unknown): MilestoneDraft[] {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => {
    const record = (entry ?? {}) as Partial<MilestoneDraft>;
    return {
      id: typeof record.id === "string" && record.id ? record.id : crypto.randomUUID(),
      milestone: typeof record.milestone === "string" ? record.milestone : "",
      milestoneDescription: typeof record.milestoneDescription === "string" ? record.milestoneDescription : "",
      milestoneTargetDate: typeof record.milestoneTargetDate === "string" ? record.milestoneTargetDate : "",
    };
  });
}

export function loadDraft(): CreateAmbitionDraft | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<DraftEnvelope>;
    if (parsed?.version !== DRAFT_VERSION || !parsed.draft || typeof parsed.draft !== "object") {
      return null;
    }

    const draft = parsed.draft;
    return {
      ambitionName: typeof draft.ambitionName === "string" ? draft.ambitionName : "",
      ambitionDefinition: typeof draft.ambitionDefinition === "string" ? draft.ambitionDefinition : "",
      trackingMethod: draft.trackingMethod === "milestone" ? "milestone" : "task",
      priority: draft.priority === "low" || draft.priority === "high" ? draft.priority : "medium",
      startDate: typeof draft.startDate === "string" ? draft.startDate : "",
      endDate: typeof draft.endDate === "string" ? draft.endDate : "",
      tasks: normalizeTasks(draft.tasks),
      milestones: normalizeMilestones(draft.milestones),
    };
  } catch {
    return null;
  }
}

export function saveDraft(draft: CreateAmbitionDraft): void {
  if (typeof window === "undefined") return;

  try {
    const envelope: DraftEnvelope = { version: DRAFT_VERSION, draft };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
  } catch {
    // Quota exceeded / private mode — persistence is best-effort, so swallow.
  }
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore — nothing actionable if removal fails.
  }
}

/** True when the restored draft holds something worth telling the user about. */
export function draftHasContent(draft: CreateAmbitionDraft): boolean {
  return Boolean(
    draft.ambitionName ||
      draft.ambitionDefinition ||
      draft.startDate ||
      draft.endDate ||
      draft.tasks.some((task) => task.task || task.taskDescription || task.taskDeadline) ||
      draft.milestones.some((milestone) => milestone.milestone || milestone.milestoneDescription || milestone.milestoneTargetDate),
  );
}
