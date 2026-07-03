import type { Note } from "@ambitiousyou/shared/types";

export const NOTE_SURFACE =
  "border-yellow-400/40 bg-yellow-100/70 dark:border-yellow-400/15 dark:bg-yellow-400/10";

export function formatNoteDate(dateValue: Date | string | null) {
  if (!dateValue) return "";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(dateValue));
}

export function noteTimestamp(note: Pick<Note, "createdAt" | "updatedAt">) {
  if (note.updatedAt && note.createdAt && new Date(note.updatedAt).getTime() !== new Date(note.createdAt).getTime()) {
    return `Updated ${formatNoteDate(note.updatedAt)}`;
  }
  if (note.createdAt) return `Added ${formatNoteDate(note.createdAt)}`;
  return "";
}

/** First line becomes a headline when the note spans multiple lines. */
export function splitNoteHeadline(text: string): { headline: string | null; body: string } {
  const trimmed = text.trim();
  const newlineIndex = trimmed.indexOf("\n");

  if (newlineIndex === -1) {
    return { headline: null, body: trimmed };
  }

  const headline = trimmed.slice(0, newlineIndex).trim();
  const body = trimmed.slice(newlineIndex + 1).trim();

  if (!headline) {
    return { headline: null, body: trimmed };
  }

  return { headline, body: body.length > 0 ? body : trimmed };
}

export function noteNeedsExpandPreview(text: string): boolean {
  const { body } = splitNoteHeadline(text);
  const previewTarget = body || text;
  return previewTarget.length > 120 || previewTarget.split("\n").length > 2;
}
