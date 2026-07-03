type ParsedItem = Record<string, string>;

export type CreateTaskPayload = {
  task: string;
  taskDescription: string;
  taskDeadline: string;
};

export type CreateMilestonePayload = {
  milestone: string;
  milestoneDescription: string;
  milestoneTargetDate: string;
};

export type CreateNotePayload = {
  note: string;
};

export function readString(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export function parseDate(value: string): Date | null {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function collectIndexedRecords(formData: FormData, prefix: string): ParsedItem[] {
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

export function getErrorMessage(responseBody: unknown, fallbackMessage: string): string {
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

export function parseTasks(formData: FormData): CreateTaskPayload[] {
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

export function parseMilestones(formData: FormData): CreateMilestonePayload[] {
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

export function parseNotes(formData: FormData): CreateNotePayload[] {
  return collectIndexedRecords(formData, "notes")
    .map((record) => ({
      note: record.note ?? "",
    }))
    .filter((note) => note.note.length > 0);
}
