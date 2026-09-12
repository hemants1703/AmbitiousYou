"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { downloadAmbitionsExport } from "@/lib/actions/(app)/ai/ai-actions";
import { DownloadIcon, Loader2Icon } from "lucide-react";
import { useTransition } from "react";

export function DataSettingsTab() {
  const [isPending, startTransition] = useTransition();

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Export your data</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Download a CSV of all your ambitions, tasks, milestones, and notes.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DownloadIcon className="size-5" />
            Export ambitions (CSV)
          </CardTitle>
          <CardDescription>Includes all ambitions with their tasks, milestones, notes, and metadata.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleExport} disabled={isPending}>
            {isPending ? <Loader2Icon className="size-4 animate-spin" /> : <DownloadIcon className="size-4 mr-2" />}
            Download CSV
          </Button>
          <p className="text-sm text-muted-foreground">
            The file will be named <code className="bg-muted px-1.5 rounded">ambitions-export.csv</code>.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data privacy</CardTitle>
          <CardDescription>Your data, your control.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Your data is never sold or shared with third parties</p>
          <p>• Export anytime — no lock-in</p>
          <p>• Request full deletion at <a href="mailto:support@ambitiousyou.pro" className="underline">support@ambitiousyou.pro</a></p>
        </CardContent>
      </Card>
    </div>
  );
}