import * as Card from "@/components/ui/card";
import { Note } from "@/db/schema";
import { IconNote } from "@tabler/icons-react";
import CreateNewNoteDialog from "./CreateNewNote/CreateNewNoteDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import IndividualNoteCard from "./MutateNote/IndividualNoteCard";

interface AmbitionNotesContainerProps {
  notes: Note[];
  ambitionId: string;
}

export default function AmbitionNotesContainer(props: AmbitionNotesContainerProps) {
  if (props.notes.length === 0) {
    return <EmptyNotesCard {...props} />;
  }

  return <AmbitionNoteCard notes={props.notes} />;
}

interface AmbitionNoteCardProps {
  notes?: Note[];
}

function AmbitionNoteCard(props: AmbitionNoteCardProps) {
  if (!props.notes || props.notes.length === 0) {
    return null;
  }

  const notesSortedByUpdatedAt = props.notes.sort(
    (a, b) => (b.updatedAt?.getTime() ?? 0) - (a.updatedAt?.getTime() ?? 0)
  );

  return (
    <Card.Card className="bg-linear-to-tl from-yellow-50 dark:from-yellow-950/25 to-transparent">
      <Card.CardHeader>
        <Card.CardTitle className="flex items-center justify-between gap-2">
          <div className="flex items-center justify-start gap-1">
            <IconNote className="text-yellow-500" size={18} />
            <span className="font-black tracking-wider text-sm text-primary/85">NOTES</span>
          </div>
          <CreateNewNoteDialog ambitionId={props.notes[0].ambitionId} />
        </Card.CardTitle>
      </Card.CardHeader>
      <Card.CardContent>
        <ScrollArea className="h-52">
          <div className="grid grid-cols-2 max-lg:grid-cols-3 max-sm:flex max-sm:flex-col gap-2">
            {notesSortedByUpdatedAt.map((note) => (
              <IndividualNoteCard key={note.id} note={note}>
                <div className="group flex items-start justify-between gap-2 bg-yellow-200/50 dark:bg-yellow-900/50 border border-yellow-400 dark:border-yellow-800 hover:bg-yellow-200/80 hover:border-yellow-500/80 dark:hover:bg-yellow-900/80 p-2 rounded-lg">
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


function EmptyNotesCard(props: AmbitionNotesContainerProps) {
  return (
    <Card.Card className="bg-linear-to-tl from-yellow-50 dark:from-yellow-950/25 to-transparent">
      <Card.CardHeader>
        <Card.CardTitle className="flex items-center justify-between gap-2">
          <div className="flex items-center justify-start gap-2">
            <IconNote className="text-yellow-500" />
            <span className="font-black tracking-wider text-sm text-primary/85">NOTES</span>
          </div>
          <CreateNewNoteDialog ambitionId={props.ambitionId} />
        </Card.CardTitle>
      </Card.CardHeader>
      <Card.CardContent>
        <div className="text-sm text-muted-foreground text-center">
          <p>You can take notes of whatever your brain ponders about your ambition!</p>
          <br />
          <br />
          Like{" "}
          <ul>
            <li>
              <strong className="italic">
                "What is the most important thing I need to do to achieve this ambition?"
              </strong>
            </li>
            <li>
              <strong className="italic">
                "What are the biggest obstacles I need to overcome?"
              </strong>
            </li>
            <li>
              <strong className="italic">"What this ambition means to me?"</strong>
            </li>
          </ul>
        </div>
      </Card.CardContent>
    </Card.Card>
  );
}
