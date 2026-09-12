"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createProofLog, deleteProofLog } from "@/lib/actions/(app)/proof/proof-actions";
import { toastMutation } from "@/lib/(app)/toast-mutation";
import type { ProofLog } from "@/types";
import { Loader2Icon, PlusIcon, Trash2Icon, TrophyIcon } from "lucide-react";
import { useState, useTransition } from "react";

interface WinsListProps {
  initialProofLogs: ProofLog[];
}

export function WinsList(props: WinsListProps) {
  const [proofLogs, setProofLogs] = useState(props.initialProofLogs);
  const [proofTitle, setProofTitle] = useState("");
  const [proofNote, setProofNote] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleAddProof() {
    if (!proofTitle.trim()) return;

    startTransition(async () => {
      const result = await toastMutation(
        () => createProofLog({ proofTitle: proofTitle.trim(), proofNote: proofNote.trim() || undefined }),
        {
          loading: "Saving win…",
          success: "Logged.",
          error: (msg) => msg,
        },
        { getError: (r) => r.error },
      );

      if (result.data) {
        setProofLogs((current) => [result.data!, ...current]);
        setProofTitle("");
        setProofNote("");
      }
    });
  }

  function handleDeleteProof(proofLogId: string) {
    startTransition(async () => {
      const result = await toastMutation(() => deleteProofLog(proofLogId), {
        loading: "Removing…",
        success: "Removed.",
        error: (msg) => msg,
      }, { getError: (r) => r.error });

      if (!result.error) {
        setProofLogs((current) => current.filter((entry) => entry.id !== proofLogId));
      }
    });
  }

  return (
    <div className="space-y-6" id="wins-new">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrophyIcon className="size-5 text-accent-brand" />
            Log a win
          </CardTitle>
          <CardDescription>Capture meaningful progress. Private to you.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="proof-title">What moved?</Label>
            <Input id="proof-title" value={proofTitle} onChange={(event) => setProofTitle(event.target.value)} placeholder="Shipped the auth refactor" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="proof-note">Note (optional)</Label>
            <Textarea id="proof-note" value={proofNote} onChange={(event) => setProofNote(event.target.value)} rows={3} placeholder="Why it mattered…" />
          </div>
          <Button onClick={handleAddProof} disabled={isPending || !proofTitle.trim()}>
            {isPending ? <Loader2Icon className="size-4 animate-spin" /> : <PlusIcon className="size-4 mr-2" />}
            Save win
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your wins</CardTitle>
        </CardHeader>
        <CardContent>
          {proofLogs.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <TrophyIcon className="size-12 mx-auto mb-3 opacity-30" />
              <p className="text-lg">No wins logged yet</p>
              <p className="text-sm mt-1">Add your first win above to start building your private highlight reel.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {proofLogs.map((entry) => (
                <li key={entry.id} className="flex items-start justify-between gap-3 rounded-xl border border-border/60 p-4 hover:bg-muted/30 transition-colors">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">{entry.proofTitle}</p>
                    {entry.proofNote ? <p className="mt-1 text-sm text-muted-foreground">{entry.proofNote}</p> : null}
                    <time className="block mt-2 text-xs text-muted-foreground">{new Date(entry.createdAt).toLocaleDateString()}</time>
                  </div>
                  <Button variant="ghost" size="icon-sm" onClick={() => handleDeleteProof(entry.id)} disabled={isPending} aria-label="Delete win">
                    <Trash2Icon className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}