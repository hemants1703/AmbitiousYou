import * as Card from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Note } from "@/db/schema";
import { IconNote } from "@tabler/icons-react";
import CreateNewNoteDialog from "./CreateNewNote/CreateNewNoteDialog";
import IndividualNoteCard from "./MutateNote/IndividualNoteCard";

interface AmbitionNoteCardProps {
  notes?: Note[];
}

export default function AmbitionNoteCard(props: AmbitionNoteCardProps) {
  if (!props.notes || props.notes.length === 0) {
    return null;
  }

  return (
    <Card.Card>
      <Card.CardHeader>
        <Card.CardTitle className="flex items-center justify-between gap-2">
          <div className="flex items-center justify-start gap-2">
            <IconNote className="text-yellow-500" />
            Notes
          </div>
          <CreateNewNoteDialog ambitionId={props.notes[0].ambitionId} />
        </Card.CardTitle>
      </Card.CardHeader>
      <Card.CardContent>
        <ScrollArea className="h-52">
          <div className="flex flex-col gap-2">
            {props.notes.map((note) => (
              <IndividualNoteCard key={note.id} note={note}>
                <div className="group flex items-start justify-between gap-2 bg-yellow-200/50 dark:bg-yellow-900/50 border border-yellow-500 dark:border-yellow-700 hover:bg-yellow-200/80 hover:border-yellow-500/80 dark:hover:bg-yellow-900/80 p-2 rounded-lg">
                  <p className="text-sm max-w-full wrap-break-word line-clamp-2">{note.note}</p>
                </div>
              </IndividualNoteCard>
            ))}
          </div>
        </ScrollArea>
      </Card.CardContent>
    </Card.Card>
  );
}
