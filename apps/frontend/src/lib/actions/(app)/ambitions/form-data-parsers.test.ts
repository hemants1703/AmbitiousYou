import {
  collectIndexedRecords,
  getErrorMessage,
  parseDate,
  parseMilestones,
  parseNotes,
  parseTasks,
  readString,
} from "@/lib/actions/(app)/ambitions/form-data-parsers";
import { describe, expect, it } from "vitest";

describe("readString", () => {
  it("trims string form values", () => {
    const formData = new FormData();
    formData.set("name", "  Hello  ");

    expect(readString(formData, "name")).toBe("Hello");
  });

  it("returns empty string for missing or non-string values", () => {
    const formData = new FormData();

    expect(readString(formData, "missing")).toBe("");
  });
});

describe("parseDate", () => {
  it("parses valid ISO dates", () => {
    const date = parseDate("2026-06-15");

    expect(date).toBeInstanceOf(Date);
    expect(date?.getFullYear()).toBe(2026);
  });

  it("returns null for invalid dates", () => {
    expect(parseDate("not-a-date")).toBeNull();
  });
});

describe("collectIndexedRecords", () => {
  it("collects indexed form fields in order", () => {
    const formData = new FormData();
    formData.set("tasks.1.task", "Second");
    formData.set("tasks.0.task", "First");
    formData.set("tasks.0.taskDescription", "Desc");

    expect(collectIndexedRecords(formData, "tasks")).toEqual([
      { task: "First", taskDescription: "Desc" },
      { task: "Second" },
    ]);
  });

  it("ignores unrelated keys", () => {
    const formData = new FormData();
    formData.set("notes.0.note", "A note");
    formData.set("tasks.0.task", "Only task");

    expect(collectIndexedRecords(formData, "tasks")).toEqual([{ task: "Only task" }]);
  });
});

describe("getErrorMessage", () => {
  it("extracts string messages", () => {
    expect(getErrorMessage({ message: "Bad request" }, "fallback")).toBe("Bad request");
  });

  it("extracts the first message from arrays", () => {
    expect(getErrorMessage({ message: ["First", "Second"] }, "fallback")).toBe("First");
  });

  it("falls back when message is missing", () => {
    expect(getErrorMessage(null, "fallback")).toBe("fallback");
  });
});

describe("parseTasks", () => {
  it("keeps only tasks with a title and valid deadline", () => {
    const formData = new FormData();
    formData.set("tasks.0.task", "Valid");
    formData.set("tasks.0.taskDeadline", "2026-06-20");
    formData.set("tasks.1.task", "Missing date");
    formData.set("tasks.2.taskDeadline", "2026-06-21");

    const tasks = parseTasks(formData);

    expect(tasks).toHaveLength(1);
    expect(tasks[0]?.task).toBe("Valid");
    expect(tasks[0]?.taskDeadline).toBe(parseDate("2026-06-20")?.toISOString());
  });
});

describe("parseMilestones", () => {
  it("keeps only milestones with a title and valid target date", () => {
    const formData = new FormData();
    formData.set("milestones.0.milestone", "Launch");
    formData.set("milestones.0.milestoneTargetDate", "2026-07-01");

    const milestones = parseMilestones(formData);

    expect(milestones).toHaveLength(1);
    expect(milestones[0]?.milestone).toBe("Launch");
  });
});

describe("parseNotes", () => {
  it("keeps only non-empty notes", () => {
    const formData = new FormData();
    formData.set("notes.0.note", "Remember this");
    formData.set("notes.1.note", "   ");

    expect(parseNotes(formData)).toEqual([{ note: "Remember this" }]);
  });
});
