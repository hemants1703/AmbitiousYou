"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { indexAiCorpus } from "@/lib/actions/(app)/ai/ai-actions";
import { toastMutation } from "@/lib/(app)/toast-mutation";
import { Loader2Icon, RefreshCwIcon, SparklesIcon } from "lucide-react";
import { useState, useTransition } from "react";

export function AiSettingsTab() {
  const [lastIndexed, setLastIndexed] = useState<string | null>(null);
  const [indexedCount, setIndexedCount] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleIndex() {
    startTransition(async () => {
      await toastMutation(() => indexAiCorpus(), {
        loading: "Indexing your data…",
        success: (result) => {
          setIndexedCount(result?.data?.indexed ?? 0);
          setLastIndexed(new Date().toLocaleString());
          return `Indexed ${result?.data?.indexed ?? 0} items.`;
        },
        error: (msg) => msg,
      }, { getError: (r) => r.error });
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">AI search index</h2>
        <p className="text-sm text-muted-foreground mt=1">
          The AI chat uses a vector index of your ambitions, tasks, milestones, and notes.
          Refresh after adding significant new content.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SparklesIcon className="size-5 text-accent-brand" />
            Search index
          </CardTitle>
          <CardDescription>Grounded answers require an up-to-date index of your data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <p className="font-medium">Last indexed</p>
                <p className="text-sm text-muted-foreground">{lastIndexed ?? "Never"}</p>
              </div>
              <div className="flex flex-col">
                <p className="font-medium">Items indexed</p>
                <p className="text-sm text-muted-foreground">{indexedCount ?? "—"}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleIndex} disabled={isPending}>
              {isPending ? <Loader2Icon className="size-4 animate-spin" /> : <RefreshCwIcon className="size-4 mr-2" />}
              Refresh index
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How it works</CardTitle>
          <CardDescription>Private, local-first AI.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Embeddings generated via OpenAI <code className="bg-muted px-1.5 rounded">text-embedding-3-small</code></p>
          <p>• Stored in PostgreSQL with pgvector (your database)</p>
          <p>• Chat uses Anthropic Claude with your data as context</p>
          <p>• No data leaves your infrastructure except to AI providers</p>
        </CardContent>
      </Card>
    </div>
  );
}