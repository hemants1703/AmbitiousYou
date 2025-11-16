import * as Card from "@/components/ui/card";
import { Note } from "@/db/schema";
import { IconDotsVertical, IconEdit, IconNote, IconTrash } from "@tabler/icons-react";
import CreateNewNoteDialog from "../(ambitionId)/CreateNewNote/CreateNewNoteDialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as DropdownMenu from "@/components/ui/dropdown-menu";
import * as Dialog from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

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
              <NoteCard key={note.id} note={note}>
                <div className="group flex items-start justify-between gap-2 bg-yellow-200/50 dark:bg-yellow-900/50 border border-yellow-500 dark:border-yellow-700 hover:bg-yellow-200/80 hover:border-yellow-500/80 dark:hover:bg-yellow-900/80 p-2 rounded-lg">
                  <p className="text-sm max-w-full wrap-break-word line-clamp-2">{note.note}</p>
                  {/* <DropdownMenu.DropdownMenu>
                  <DropdownMenu.DropdownMenuTrigger asChild>
                    <Button
                      size="tiny"
                      className="rounded-full p-0 bg-yellow-500 text-white text-shadow-md opacity-0 group-hover:opacity-100 transition-all duration-75"
                    >
                      <IconDotsVertical className="size-4" />
                    </Button>
                  </DropdownMenu.DropdownMenuTrigger>
                  <DropdownMenu.DropdownMenuContent align="end">
                    <DropdownMenu.DropdownMenuItem>
                      <IconEdit className="size-4 mr-2" /> Edit Note
                    </DropdownMenu.DropdownMenuItem>
                    <DropdownMenu.DropdownMenuItem>
                      <IconTrash className="size-4 mr-2" /> Delete Note
                    </DropdownMenu.DropdownMenuItem>
                  </DropdownMenu.DropdownMenuContent>
                </DropdownMenu.DropdownMenu> */}
                </div>
              </NoteCard>
            ))}
          </div>
        </ScrollArea>
      </Card.CardContent>
    </Card.Card>
  );
}

interface NoteCardContainerProps {
  note: Note;
  children: React.ReactNode;
}

function NoteCard(props: NoteCardContainerProps) {
  return (
    <Dialog.Dialog>
      <Dialog.DialogTrigger asChild>{props.children}</Dialog.DialogTrigger>
      <Dialog.DialogContent>
        <Dialog.DialogHeader>
          <Dialog.DialogTitle>Your Note</Dialog.DialogTitle>
          <Dialog.DialogDescription>View your note for this ambition.</Dialog.DialogDescription>
        </Dialog.DialogHeader>
        <div className="group flex items-start justify-between max-h-96 overflow-y-auto gap-2 bg-yellow-200/50 dark:bg-yellow-900/50 border border-yellow-500 dark:border-yellow-700 hover:bg-yellow-200/80 hover:border-yellow-500/80 dark:hover:bg-yellow-900/80 p-2 rounded-lg">
          <p className="text-sm max-w-full wrap-break-words">{props.note.note}</p>
        </div>
      </Dialog.DialogContent>
    </Dialog.Dialog>
  );
}
