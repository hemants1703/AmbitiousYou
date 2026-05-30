"use client";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Note } from "@ambitiousyou/shared/types";
import { BookOpenTextIcon } from "lucide-react";

interface NotesDrawerProps {
  notes: Note[];
  ambitionName: string;
}

export default function NotesDrawer(props: NotesDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full rounded-2xl">
          <BookOpenTextIcon className="size-4" />
          Open all notes
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle>Notes for {props.ambitionName}</DrawerTitle>
          <DrawerDescription>Quick context and reflections tied to this ambition.</DrawerDescription>
        </DrawerHeader>

        <div className="space-y-3 overflow-y-auto px-4 pb-2">
          {props.notes.length === 0 ? (
            <div className="rounded-2xl border border-border/60 p-3 text-sm text-muted-foreground">No notes available yet.</div>
          ) : (
            props.notes.map((note) => (
              <article key={note.id} className="rounded-2xl border border-border/60 p-3">
                <p className="text-sm wrap-break-word">{note.note}</p>
                <p className="mt-2 text-xs text-muted-foreground">Updated {formatNoteDate(note.updatedAt ?? note.createdAt)}</p>
              </article>
            ))
          )}
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function formatNoteDate(dateValue: Date | string | null) {
  if (!dateValue) return "Unknown date";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateValue));
}
