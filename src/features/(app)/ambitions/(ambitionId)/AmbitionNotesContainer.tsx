import * as Card from "@/components/ui/card";
import { Note } from "@/db/schema";
import { IconNote } from "@tabler/icons-react";
import AmbitionNoteCard from "../components/AmbitionNoteCard";
import CreateNewNoteDialog from "./CreateNewNote/CreateNewNoteDialog";

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

function EmptyNotesCard(props: AmbitionNotesContainerProps) {
  return (
    <Card.Card>
      <Card.CardHeader>
        <Card.CardTitle className="flex items-center justify-between gap-2">
          <div className="flex items-center justify-start gap-2">
            <IconNote className="text-yellow-500" />
            Notes
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
