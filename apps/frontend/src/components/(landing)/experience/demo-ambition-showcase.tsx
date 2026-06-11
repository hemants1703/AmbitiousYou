"use client";

import { MoveKindBadge } from "@/components/(app)/ambitions/move-kind-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import * as Card from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { MOVE_KIND_STYLE } from "@/lib/(app)/tracked-item";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { CalendarDaysIcon, CheckIcon, CircleCheckIcon, FlagIcon, TargetIcon } from "lucide-react";
import { Persona, PersonaAmbition } from "./persona-data";

interface DemoAmbitionShowcaseProps {
  persona: Persona;
  ambition: PersonaAmbition;
  completedItems: string[];
  onToggleItem: (itemId: string) => void;
  progress: number;
}

function formatDate(dateValue: string | number | Date, includeYear: boolean) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    ...(includeYear ? { year: "numeric" } : {}),
  }).format(new Date(dateValue));
}

export default function DemoAmbitionShowcase(props: DemoAmbitionShowcaseProps) {
  // Determine if an item is completed (original state XOR toggled)
  const isItemCompleted = (itemId: string, originallyCompleted: boolean): boolean => {
    const isToggled = props.completedItems.includes(itemId);
    return isToggled ? !originallyCompleted : originallyCompleted;
  };

  const items = [...(props.ambition.tasks ?? []), ...(props.ambition.milestones ?? [])];
  const taskCount = props.ambition.tasks?.length ?? 0;
  const milestoneCount = props.ambition.milestones?.length ?? 0;

  const totalItems = items.length;
  const completedCount = items.filter((item) => {
    const originallyCompleted = "taskCompleted" in item ? (item.taskCompleted ?? false) : "milestoneCompleted" in item ? (item.milestoneCompleted ?? false) : false;
    return isItemCompleted(item.id, originallyCompleted);
  }).length;

  return (
    <section className="w-full py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="flex items-center justify-center gap-3 font-mono text-xs font-medium uppercase tracking-[0.18em]" style={{ color: props.persona.color }}>
            <span aria-hidden="true" className="h-px w-6 bg-current opacity-40" />
            <span>Your Ambition in Action</span>
            <span aria-hidden="true" className="h-px w-6 bg-current opacity-40" />
          </p>
          <h2 className="mt-4 font-brand text-3xl font-semibold tracking-[-0.02em] text-balance md:text-4xl">Experience the journey</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">This is how {props.persona.name.toLowerCase()} use AmbitiousYou. Try checking off items to see your progress update in real-time.</p>
        </div>

        {/* Main Showcase Grid */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Ambition Overview Card */}
          <Card.Card className="relative h-full overflow-hidden lg:col-span-2" style={{ "--ambition-color": props.persona.color } as React.CSSProperties}>
            {/* Decorative gradient */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-to-br from-transparent via-transparent to-(--ambition-color) opacity-10" />

            <Card.CardHeader>
              <div className="flex items-start justify-between gap-2">
                <Card.CardTitle className="text-xl">{props.ambition.ambition.ambitionName}</Card.CardTitle>
                <Badge
                  variant="outline"
                  className={cn(
                    "shrink-0 font-mono text-xs uppercase",
                    props.ambition.ambition.ambitionPriority === "high" ? "border-red-500 text-red-500" : props.ambition.ambition.ambitionPriority === "medium" ? "border-yellow-500 text-yellow-500" : "border-green-500 text-green-500",
                  )}>
                  {props.ambition.ambition.ambitionPriority}
                </Badge>
              </div>
              <Card.CardDescription className="mt-2">{props.ambition.ambition.ambitionDefinition}</Card.CardDescription>
            </Card.CardHeader>

            <Card.CardContent className="space-y-6">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Overall Progress</span>
                  <span className="text-lg font-bold tabular-nums">{props.progress}%</span>
                </div>
                <Progress value={props.progress} className="h-1 *:transition-all *:duration-500" />
                <p aria-live="polite" className="sr-only">
                  Progress: {props.progress}%. {completedCount} of {totalItems} moves complete.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                    <CalendarDaysIcon aria-hidden="true" className="size-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Deadline</p>
                    <p className="text-sm font-medium">{formatDate(props.ambition.ambition.ambitionEndDate, true)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
                    <CheckIcon aria-hidden="true" className="size-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Completed</p>
                    <p className="text-sm font-medium tabular-nums">
                      {completedCount}/{totalItems} moves
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
                    <FlagIcon aria-hidden="true" className="size-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className="flex items-center gap-1.5 text-sm font-medium capitalize">
                      <span aria-hidden="true" className="size-2 rounded-full bg-green-400" />
                      {props.ambition.ambition.ambitionStatus}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                    <TargetIcon aria-hidden="true" className="size-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Moves</p>
                    <p className="text-sm font-medium tabular-nums">
                      {taskCount} {taskCount === 1 ? "task" : "tasks"} · {milestoneCount} {milestoneCount === 1 ? "milestone" : "milestones"}
                    </p>
                  </div>
                </div>
              </div>
            </Card.CardContent>
          </Card.Card>

          {/* Interactive Items List */}
          <Card.Card className="h-full lg:col-span-3">
            <Card.CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Card.CardTitle className="flex items-center gap-2 text-lg">
                  <CircleCheckIcon aria-hidden="true" className="size-5 text-primary" />
                  Moves
                </Card.CardTitle>
                <Badge variant="secondary" className="text-xs">
                  Interactive Demo
                </Badge>
              </div>
              <Card.CardDescription>Try checking off moves — this is a live demo, nothing is saved.</Card.CardDescription>
            </Card.CardHeader>

            <Card.CardContent>
              <div className="space-y-3">
                {items.map((item) => {
                  const originallyCompleted = "taskCompleted" in item ? (item.taskCompleted ?? false) : "milestoneCompleted" in item ? (item.milestoneCompleted ?? false) : false;
                  const isCompleted = isItemCompleted(item.id, originallyCompleted);
                  const itemKind = "task" in item ? "task" : "milestone";
                  const itemName = "task" in item ? item.task : item.milestone;
                  const itemDescription = "taskDescription" in item ? item.taskDescription : item.milestoneDescription;
                  const itemDate = "taskDeadline" in item ? item.taskDeadline : item.milestoneTargetDate;

                  return (
                    /* One label = one shared hit target for the row and its checkbox (no dead zones) */
                    <label
                      key={item.id}
                      className={cn("flex cursor-pointer items-start gap-3 rounded-lg border border-l-4 p-3 transition-colors", "hover:border-primary/30 hover:bg-muted/50", isCompleted && "border-green-500/20 bg-green-500/5", MOVE_KIND_STYLE[itemKind].stripe)}>
                      <Checkbox checked={isCompleted} onCheckedChange={() => props.onToggleItem(item.id)} aria-label={`${itemKind === "task" ? "Task" : "Milestone"}: ${itemName}`} className={cn("mt-0.5", isCompleted && "data-[state=checked]:border-green-500 data-[state=checked]:bg-green-500")} />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <MoveKindBadge kind={itemKind} />
                        </span>
                        <span className={cn("mt-1 block text-sm font-medium", isCompleted && "text-muted-foreground line-through")}>{itemName}</span>
                        {itemDescription && <span className="mt-0.5 line-clamp-1 block text-xs text-muted-foreground">{itemDescription}</span>}
                      </span>
                      <span className="flex shrink-0 items-center gap-2">
                        <span className="text-xs tabular-nums text-muted-foreground">{formatDate(itemDate, false)}</span>
                        {isCompleted && <CheckIcon aria-hidden="true" className="size-4 text-green-500" />}
                      </span>
                    </label>
                  );
                })}
              </div>
            </Card.CardContent>
          </Card.Card>
        </div>

        {/* Continue CTA */}
        <div className="mt-12 text-center">
          <p className="mb-4 text-muted-foreground">Like what you see? Start your journey today.</p>
          <Button size="lg" asChild>
            <Link href="/signup">Get Started Free</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
