/**
 * Persists the in-progress create-ambition form to localStorage so a half-filled
 * form survives navigation/reload and restores on return. The draft is cleared
 * only once the ambition is actually created (see create-ambition-form.tsx).
 *
 * All access is SSR-guarded and failure-tolerant: a missing window, corrupt JSON,
 * an old schema version, or a write that throws (quota / private mode) degrades to
 * "no draft" rather than crashing the form.
 */

export type MoveKind = "task" | "milestone";

/** One "move" being drafted — a task or a milestone. The form works on a single mixed list. */
export type MoveDraft = {
  id: string;
  kind: MoveKind;
  title: string;
  description: string;
  date: string; // "YYYY-MM-DD" | ""
};

export interface CreateAmbitionDraft {
  ambitionName: string;
  ambitionDefinition: string;
  ambitionMotivation: string;
  priority: "low" | "medium" | "high";
  startDate: string; // "YYYY-MM-DD" | ""  (dateRange is reconstructed from these on load)
  endDate: string; // "YYYY-MM-DD" | ""
  moves: MoveDraft[];
}

// v2: ambitions hold a free mix of tasks + milestones ("moves"), replacing the v1
// trackingMethod + separate tasks/milestones arrays. Old v1 drafts fail the version
// check below and cleanly degrade to "no draft".
const STORAGE_KEY = "ambitiousyou:create-ambition-draft:v2";
const DRAFT_VERSION = 2;

type DraftEnvelope = {
  version: number;
  draft: CreateAmbitionDraft;
};

function normalizeMoves(value: unknown): MoveDraft[] {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => {
    const record = (entry ?? {}) as Partial<MoveDraft>;
    return {
      id: typeof record.id === "string" && record.id ? record.id : crypto.randomUUID(),
      kind: record.kind === "milestone" ? "milestone" : "task",
      title: typeof record.title === "string" ? record.title : "",
      description: typeof record.description === "string" ? record.description : "",
      date: typeof record.date === "string" ? record.date : "",
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
      ambitionMotivation: typeof draft.ambitionMotivation === "string" ? draft.ambitionMotivation : "",
      priority: draft.priority === "low" || draft.priority === "high" ? draft.priority : "medium",
      startDate: typeof draft.startDate === "string" ? draft.startDate : "",
      endDate: typeof draft.endDate === "string" ? draft.endDate : "",
      moves: normalizeMoves(draft.moves),
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
      draft.ambitionMotivation ||
      draft.startDate ||
      draft.endDate ||
      draft.moves.some((move) => move.title || move.description || move.date),
  );
}
