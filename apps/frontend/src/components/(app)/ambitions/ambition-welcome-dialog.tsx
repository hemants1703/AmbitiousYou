"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { brandCopy } from "@/lib/brand";
import { Share2Icon, SparklesIcon } from "lucide-react";
import Link from "next/link";

interface AmbitionWelcomeDialogProps {
  open: boolean;
  ambitionId: string;
  ambitionName: string;
  onOpenChange: (open: boolean) => void;
  onShare?: () => void;
}

/** Shown once after a user's first ambition is created — the initiation welcome artifact. */
export function AmbitionWelcomeDialog(props: AmbitionWelcomeDialogProps) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <span className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-chart-1/10 dark:text-chart-1" aria-hidden="true">
            <SparklesIcon className="size-6" />
          </span>
          <DialogTitle className="font-brand text-2xl tracking-[-0.02em]">{brandCopy.initiation.welcomeTitle}</DialogTitle>
          <DialogDescription className="text-base leading-relaxed">{brandCopy.initiation.welcomeBody(props.ambitionName)}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button asChild className="w-full">
            <Link href={`/ambitions/${props.ambitionId}`}>{brandCopy.initiation.welcomeCta}</Link>
          </Button>
          {props.onShare ? (
            <Button type="button" variant="outline" className="w-full" onClick={props.onShare}>
              <Share2Icon className="size-4" aria-hidden="true" />
              {brandCopy.initiation.welcomeShare}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
