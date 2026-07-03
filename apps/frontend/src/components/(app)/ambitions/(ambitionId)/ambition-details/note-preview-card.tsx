"use client";

import type { Note } from "@ambitiousyou/shared/types";
import { cn } from "@/lib/utils";
import { ExpandIcon } from "lucide-react";
import { formatNoteDate, NOTE_SURFACE, noteNeedsExpandPreview, splitNoteHeadline } from "./note-display";

interface NotePreviewCardProps {
  note: Note;
  onOpen: () => void;
}

export function NotePreviewCard(props: NotePreviewCardProps) {
  const { headline, body } = splitNoteHeadline(props.note.note);
  const showExpandHint = noteNeedsExpandPreview(props.note.note);
  const previewText = headline ? body : props.note.note;

  return (
    <button
      type="button"
      onClick={props.onOpen}
      className={cn(
        "group/note w-full rounded-2xl border p-3 text-left transition-colors",
        "hover:border-yellow-500/50 hover:bg-yellow-100 dark:hover:bg-yellow-400/15",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        NOTE_SURFACE,
      )}
      aria-label={showExpandHint ? `Read full note${headline ? `: ${headline}` : ""}` : `Read note${headline ? `: ${headline}` : ""}`}>
      <div className="space-y-1">
        {headline ? <p className="line-clamp-1 text-sm font-medium wrap-anywhere">{headline}</p> : null}
        <p className={cn("text-sm whitespace-pre-wrap wrap-anywhere", headline ? "line-clamp-2 text-muted-foreground" : "line-clamp-3")}>{previewText}</p>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        {props.note.createdAt ? <p className="text-xs text-muted-foreground">Added {formatNoteDate(props.note.createdAt)}</p> : <span />}
        <span
          className={cn(
            "inline-flex items-center gap-1 text-xs font-medium text-yellow-800/80 dark:text-yellow-200/80",
            "opacity-0 transition-opacity group-hover/note:opacity-100 group-focus-visible/note:opacity-100 pointer-coarse:opacity-100",
          )}>
          {showExpandHint ? "Read full note" : "Open"}
          <ExpandIcon className="size-3.5" aria-hidden="true" />
        </span>
      </div>
    </button>
  );
}
