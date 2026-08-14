"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { sendAiChat, indexAiCorpus } from "@/lib/actions/(app)/ai/ai-actions";
import { toastMutation } from "@/lib/(app)/toast-mutation";
import { Loader2Icon, RefreshCwIcon, SparklesIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { AiSidebarGroup, AiSidebarGroupLabel, AiSidebarGroupContent } from "@/components/ui/ai-sidebar";

export function AiChatPanel() {
  const [chatMessage, setChatMessage] = useState("");
  const [chatAnswer, setChatAnswer] = useState<string | null>(null);
  const [lastIndexed, setLastIndexed] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleAsk() {
    if (!chatMessage.trim()) return;

    startTransition(async () => {
      const result = await toastMutation(() => sendAiChat(chatMessage.trim()), {
        loading: "Thinking…",
        success: "Answer ready.",
        error: (msg) => msg,
      }, { getError: (r) => r.error });

      if (result.data) {
        setChatAnswer(result.data.answer);
      }
    });
  }

  function handleIndex() {
    startTransition(async () => {
      const result = await toastMutation(() => indexAiCorpus(), {
        loading: "Indexing your data…",
        success: (data) => `Indexed ${data?.indexed ?? 0} items.`,
        error: (msg) => msg,
      }, { getError: (r) => r.error });

      if (result.data) {
        setLastIndexed(new Date().toLocaleString());
      }
    });
  }

  return (
    <AiSidebarGroup>
      <AiSidebarGroupLabel>Ask AI</AiSidebarGroupLabel>
      <AiSidebarGroupContent className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SparklesIcon className="size-5 text-accent-brand" />
              Ask a question
            </CardTitle>
            <CardDescription>Your data stays private — only relevant context is sent to the model.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={chatMessage}
              onChange={(event) => setChatMessage(event.target.value)}
              rows={4}
              placeholder="What stalled this week on my primary ambition? What's my next move on the founder launch template?"
            />
            <Button onClick={handleAsk} disabled={isPending || !chatMessage.trim()}>
              {isPending ? <Loader2Icon className="size-4 animate-spin" /> : <SparklesIcon className="size-4 mr-2" />}
              Ask
            </Button>
            {chatAnswer ? (
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                <p className="text-sm text-foreground whitespace-pre-wrap">{chatAnswer}</p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Search index</CardTitle>
            <CardDescription>Keep the AI&apos;s knowledge of your ambitions up to date.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Last indexed</p>
                <p className="text-sm text-muted-foreground">{lastIndexed ?? "Never"}</p>
              </div>
              <Button variant="outline" onClick={handleIndex} disabled={isPending}>
                <RefreshCwIcon className="size-4 mr-2" />
                Refresh index
              </Button>
            </div>
          </CardContent>
        </Card>
      </AiSidebarGroupContent>
    </AiSidebarGroup>
  );
}