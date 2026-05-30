"use client";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import type { Milestone, Task } from "@ambitiousyou/shared/types";
import { CheckCircle2Icon } from "lucide-react";

interface CompletedDrawerProps {
  items: (Task | Milestone)[];
  ambitionName: string;
}

export default function CompletedDrawer(props: CompletedDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" className="w-full text-sm">
          See all completed
        </Button>
      </DrawerTrigger>

      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle>Completed items — {props.ambitionName}</DrawerTitle>
          <DrawerDescription>Review what you have finished for this ambition.</DrawerDescription>
        </DrawerHeader>

        <div className="space-y-3 overflow-y-auto px-4 pb-2">
          {props.items.length === 0 ? (
            <div className="rounded-2xl border border-border/60 p-3 text-sm text-muted-foreground">No completed items.</div>
          ) : (
            props.items.map((item) => (
              <article key={item.id} className="rounded-2xl border border-border/60 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{"task" in item ? item.task : item.milestone}</p>
                    <p className="text-sm text-muted-foreground">{"taskDescription" in item ? item.taskDescription : item.milestoneDescription}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2Icon className="size-4 text-green-500" />
                    <p className="text-sm text-muted-foreground">Done</p>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
