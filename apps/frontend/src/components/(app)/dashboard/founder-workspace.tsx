"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { blockTodayContractOnCalendar, downloadAmbitionsExport, getCalendarConnectUrl, indexAiCorpus, sendAiChat } from "@/lib/actions/(app)/ai/ai-actions";
import { createProofLog, deleteProofLog } from "@/lib/actions/(app)/proof/proof-actions";
import { toastMutation } from "@/lib/(app)/toast-mutation";
import type { ProofLog } from "@/types";
import { CalendarIcon, DownloadIcon, Loader2Icon, SparklesIcon, TrophyIcon, Trash2Icon } from "lucide-react";
import { useState, useTransition } from "react";

interface FounderWorkspaceProps {
  initialProofLogs: ProofLog[];
}

export function FounderWorkspace(props: FounderWorkspaceProps) {
  const [proofLogs, setProofLogs] = useState(props.initialProofLogs);
  const [proofTitle, setProofTitle] = useState("");
  const [proofNote, setProofNote] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [chatAnswer, setChatAnswer] = useState<string | null>(null);
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

  function handleExport() {
    startTransition(async () => {
      const result = await downloadAmbitionsExport();
      if (result.error || !result.csv) {
        return;
      }

      const blob = new Blob([result.csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "ambitions-export.csv";
      anchor.click();
      URL.revokeObjectURL(url);
    });
  }

  function handleConnectCalendar() {
    startTransition(async () => {
      const result = await getCalendarConnectUrl();
      if (result.url) {
        window.location.href = result.url;
      }
    });
  }

  function handleBlockCalendar() {
    startTransition(async () => {
      await toastMutation(() => blockTodayContractOnCalendar(), {
        loading: "Blocking 45 minutes…",
        success: "Calendar block created.",
        error: (msg) => msg,
      }, { getError: (r) => r.error });
    });
  }

  function handleIndexCorpus() {
    startTransition(async () => {
      await toastMutation(() => indexAiCorpus(), {
        loading: "Indexing your data…",
        success: (result) => `Indexed ${result?.data?.indexed ?? 0} items.`,
        error: (msg) => msg,
      }, { getError: (r) => r.error });
    });
  }

  function handleAsk() {
    if (!chatMessage.trim()) return;

    startTransition(async () => {
      const result = await toastMutation(() => sendAiChat(chatMessage.trim()), {
        loading: "Thinking…",
        success: "Answer ready.",
        error: (msg) => msg,
      }, { getError: (r) => r.error });

      if (result?.data?.answer) {
        setChatAnswer(result.data.answer);
      }
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrophyIcon className="size-4 text-accent-brand" />
            Proof log
          </CardTitle>
          <CardDescription>Private wins you can revisit when momentum dips.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="proof-title">What moved?</Label>
            <Input id="proof-title" value={proofTitle} onChange={(event) => setProofTitle(event.target.value)} placeholder="Shipped the auth refactor" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="proof-note">Note (optional)</Label>
            <Textarea id="proof-note" value={proofNote} onChange={(event) => setProofNote(event.target.value)} rows={2} placeholder="Why it mattered…" />
          </div>
          <Button onClick={handleAddProof} disabled={isPending || !proofTitle.trim()}>
            {isPending ? <Loader2Icon className="size-4 animate-spin" /> : null}
            Log win
          </Button>

          <ul className="space-y-2">
            {proofLogs.map((entry) => (
              <li key={entry.id} className="flex items-start justify-between gap-3 rounded-xl border border-border/60 p-3">
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{entry.proofTitle}</p>
                  {entry.proofNote ? <p className="mt-1 text-sm text-muted-foreground">{entry.proofNote}</p> : null}
                </div>
                <Button variant="ghost" size="icon-sm" onClick={() => handleDeleteProof(entry.id)} disabled={isPending} aria-label="Delete proof entry">
                  <Trash2Icon className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SparklesIcon className="size-4 text-accent-brand" />
            Workspace tools
          </CardTitle>
          <CardDescription>Export, calendar blocks, and grounded Q&amp;A over your ambitions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleExport} disabled={isPending}>
              <DownloadIcon className="size-4" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={handleConnectCalendar} disabled={isPending}>
              <CalendarIcon className="size-4" />
              Connect Google Calendar
            </Button>
            <Button variant="outline" onClick={handleBlockCalendar} disabled={isPending}>
              Block 45m for today&apos;s move
            </Button>
            <Button variant="outline" onClick={handleIndexCorpus} disabled={isPending}>
              Refresh search index
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ai-question">Ask about your ambitions</Label>
            <Textarea id="ai-question" value={chatMessage} onChange={(event) => setChatMessage(event.target.value)} rows={3} placeholder="What stalled this week on my primary ambition?" />
            <Button onClick={handleAsk} disabled={isPending || !chatMessage.trim()}>
              Ask
            </Button>
            {chatAnswer ? <p className="rounded-xl border border-border/60 bg-muted/20 p-3 text-sm text-foreground">{chatAnswer}</p> : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
