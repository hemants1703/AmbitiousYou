"use server";

import { getUser } from "@/lib/api/sidebar/get-user";
import { getSessionToken } from "@/lib/auth";
import { redirect } from "next/navigation";

export type CreateAmbitionState = {
  error: string | null;
};

type ParsedItem = Record<string, string>;

type CreateTaskPayload = {
  task: string;
  taskDescription: string;
  taskDeadline: string;
};

type CreateMilestonePayload = {
  milestone: string;
  milestoneDescription: string;
  milestoneTargetDate: string;
};

type CreateNotePayload = {
  note: string;
};

function readString(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function readBoolean(formData: FormData, name: string): boolean {
  return readString(formData, name) === "true";
}

function parseDate(value: string): Date | null {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function collectIndexedRecords(formData: FormData, prefix: string): ParsedItem[] {
  const records = new Map<number, ParsedItem>();

  for (const [key, value] of formData.entries()) {
    if (typeof value !== "string" || !key.startsWith(`${prefix}.`)) {
      continue;
    }

    const [collection, index, ...fieldParts] = key.split(".");

    if (collection !== prefix || !index || fieldParts.length === 0) {
      continue;
    }

    const parsedIndex = Number(index);

    if (Number.isNaN(parsedIndex)) {
      continue;
    }

    const currentRecord = records.get(parsedIndex) ?? {};
    currentRecord[fieldParts.join(".")] = value.trim();
    records.set(parsedIndex, currentRecord);
  }

  return [...records.entries()].sort(([leftIndex], [rightIndex]) => leftIndex - rightIndex).map(([, record]) => record);
}

function getErrorMessage(responseBody: unknown, fallbackMessage: string): string {
  if (!responseBody || typeof responseBody !== "object") {
    return fallbackMessage;
  }

  const message = (responseBody as { message?: string | string[] }).message;

  if (Array.isArray(message)) {
    return message[0] ?? fallbackMessage;
  }

  if (typeof message === "string") {
    return message;
  }

  return fallbackMessage;
}

function parseTasks(formData: FormData): CreateTaskPayload[] {
  return collectIndexedRecords(formData, "tasks")
    .map((record) => ({
      task: record.task ?? "",
      taskDescription: record.taskDescription ?? "",
      taskDeadline: record.taskDeadline ?? "",
    }))
    .filter((task) => task.task.length > 0)
    .filter((task) => Boolean(parseDate(task.taskDeadline)))
    .map((task) => ({
      ...task,
      taskDeadline: parseDate(task.taskDeadline)?.toISOString() ?? "",
    }));
}

function parseMilestones(formData: FormData): CreateMilestonePayload[] {
  return collectIndexedRecords(formData, "milestones")
    .map((record) => ({
      milestone: record.milestone ?? "",
      milestoneDescription: record.milestoneDescription ?? "",
      milestoneTargetDate: record.milestoneTargetDate ?? "",
    }))
    .filter((milestone) => milestone.milestone.length > 0)
    .filter((milestone) => Boolean(parseDate(milestone.milestoneTargetDate)))
    .map((milestone) => ({
      ...milestone,
      milestoneTargetDate: parseDate(milestone.milestoneTargetDate)?.toISOString() ?? "",
    }));
}

function parseNotes(formData: FormData): CreateNotePayload[] {
  return collectIndexedRecords(formData, "notes")
    .map((record) => ({
      note: record.note ?? "",
    }))
    .filter((note) => note.note.length > 0);
}

export async function createAmbitionAction(_: CreateAmbitionState, formData: FormData): Promise<CreateAmbitionState> {
  const sessionToken = await getSessionToken();
  const user = await getUser(sessionToken);

  if (!user) {
    return {
      error: "Unable to resolve your account. Please sign in again.",
    };
  }

  const ambitionName = readString(formData, "ambitionName");
  const ambitionDefinition = readString(formData, "ambitionDefinition");
  const ambitionTrackingMethod = readString(formData, "ambitionTrackingMethod") as "task" | "milestone" | "";
  const ambitionPriority = readString(formData, "ambitionPriority") as "low" | "medium" | "high" | "";
  const ambitionStartDate = parseDate(readString(formData, "ambitionStartDate"));
  const ambitionEndDate = parseDate(readString(formData, "ambitionEndDate"));

  if (!ambitionName || !ambitionTrackingMethod || !ambitionPriority || !ambitionStartDate || !ambitionEndDate) {
    return {
      error: "Fill in the ambition name, tracking method, priority, and dates before creating it.",
    };
  }

  if (ambitionEndDate.getTime() < ambitionStartDate.getTime()) {
    return {
      error: "The end date must be the same as or later than the start date.",
    };
  }

  const tasks = parseTasks(formData);
  const milestones = parseMilestones(formData);
  const notes = parseNotes(formData);

  if (ambitionTrackingMethod === "task" && tasks.length === 0) {
    return {
      error: "Add at least one task to track this ambition.",
    };
  }

  if (ambitionTrackingMethod === "milestone" && milestones.length === 0) {
    return {
      error: "Add at least one milestone to track this ambition.",
    };
  }

  const payload = {
    userId: user.id,
    ambitionName,
    ambitionDefinition,
    ambitionTrackingMethod,
    ambitionStartDate: ambitionStartDate.toISOString(),
    ambitionEndDate: ambitionEndDate.toISOString(),
    ambitionPriority,
    ...(ambitionTrackingMethod === "task" ? { tasks } : {}),
    ...(ambitionTrackingMethod === "milestone" ? { milestones } : {}),
    ...(notes.length > 0 ? { notes } : {}),
  };

  try {
    const response = await fetch(`${process.env.API_URL}/ambitions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMessage = "Unable to create the ambition. Please try again.";

      try {
        const responseBody = (await response.json()) as unknown;
        errorMessage = getErrorMessage(responseBody, errorMessage);
      } catch {
        // Fall back to the default error message when the backend response is not JSON.
      }

      return {
        error: errorMessage,
      };
    }
  } catch {
    return {
      error: "Unable to reach the ambitions server.",
    };
  }

  redirect("/ambitions");
}
