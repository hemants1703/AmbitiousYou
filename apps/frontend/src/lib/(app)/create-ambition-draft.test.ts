import {
  clearDraft,
  draftHasContent,
  loadDraft,
  saveDraft,
  type CreateAmbitionDraft,
} from "@/lib/(app)/create-ambition-draft";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const STORAGE_KEY = "ambitiousyou:create-ambition-draft:v2";

function buildDraft(overrides: Partial<CreateAmbitionDraft> = {}): CreateAmbitionDraft {
  return {
    ambitionName: "",
    ambitionDefinition: "",
    ambitionMotivation: "",
    priority: "medium",
    startDate: "",
    endDate: "",
    moves: [],
    ...overrides,
  };
}

describe("create-ambition-draft", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", {
      store: {} as Record<string, string>,
      getItem(key: string) {
        return this.store[key] ?? null;
      },
      setItem(key: string, value: string) {
        this.store[key] = value;
      },
      removeItem(key: string) {
        delete this.store[key];
      },
      clear() {
        this.store = {};
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns null when no draft is stored", () => {
    expect(loadDraft()).toBeNull();
  });

  it("rejects drafts with the wrong schema version", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, draft: buildDraft({ ambitionName: "Old" }) }));

    expect(loadDraft()).toBeNull();
  });

  it("round-trips a valid draft through localStorage", () => {
    const draft = buildDraft({
      ambitionName: "Run a marathon",
      priority: "high",
      startDate: "2026-07-01",
      endDate: "2026-12-31",
      moves: [{ id: "move-1", kind: "task", title: "Long run", description: "", date: "2026-07-15" }],
    });

    saveDraft(draft);

    expect(loadDraft()).toEqual(draft);
  });

  it("normalizes malformed move entries on load", () => {
    saveDraft(buildDraft());
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 2,
        draft: {
          ambitionName: "",
          ambitionDefinition: "",
          ambitionMotivation: "",
          priority: "medium",
          startDate: "",
          endDate: "",
          moves: [{ title: "Untitled move", kind: "milestone" }],
        },
      }),
    );

    const loaded = loadDraft();

    expect(loaded?.moves).toHaveLength(1);
    expect(loaded?.moves[0]?.title).toBe("Untitled move");
    expect(loaded?.moves[0]?.kind).toBe("milestone");
    expect(typeof loaded?.moves[0]?.id).toBe("string");
  });

  it("detects when a draft has meaningful content", () => {
    expect(draftHasContent(buildDraft())).toBe(false);
    expect(draftHasContent(buildDraft({ ambitionName: "Ship v1" }))).toBe(true);
    expect(
      draftHasContent(
        buildDraft({
          moves: [{ id: "m1", kind: "task", title: "", description: "", date: "2026-08-01" }],
        }),
      ),
    ).toBe(true);
  });

  it("clears persisted drafts", () => {
    saveDraft(buildDraft({ ambitionName: "Temporary" }));
    clearDraft();

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(loadDraft()).toBeNull();
  });
});
