"use client";

import { MotionWrapper } from "@/components/MotionWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import * as Card from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  IconCalendar,
  IconCheck,
  IconCircleCheck,
  IconFlag,
  IconRocket,
  IconSparkles,
  IconTargetArrow,
} from "@tabler/icons-react";
import { format } from "date-fns";
import Link from "next/link";
import { useRef } from "react";
import { Persona, PersonaAmbition } from "./personaData";

interface DemoAmbitionShowcaseProps {
  persona: Persona;
  ambition: PersonaAmbition;
  completedItems: string[];
  onToggleItem: (itemId: string) => void;
  progress: number;
}

export default function DemoAmbitionShowcase({
  persona,
  ambition,
  completedItems,
  onToggleItem,
  progress,
}: DemoAmbitionShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine if an item is completed (original state XOR toggled)
  const isItemCompleted = (itemId: string, originallyCompleted: boolean): boolean => {
    const isToggled = completedItems.includes(itemId);
    return isToggled ? !originallyCompleted : originallyCompleted;
  };

  const items =
    ambition.ambition.ambitionTrackingMethod === "task"
      ? ambition.tasks || []
      : ambition.milestones || [];

  const totalItems = items.length;
  const completedCount = items.filter((item) => {
    const originallyCompleted =
      "taskCompleted" in item
        ? (item.taskCompleted ?? false)
        : "milestoneCompleted" in item
          ? (item.milestoneCompleted ?? false)
          : false;
    return isItemCompleted(item.id, originallyCompleted);
  }).length;

  return (
    <section
      ref={containerRef}
      className="w-full py-16 md:py-24 bg-linear-to-b from-transparent via-muted/30 to-transparent"
    >
      <div className="container px-4 md:px-6 max-w-5xl mx-auto">
        {/* Section Header */}
        <MotionWrapper
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 text-sm font-medium bg-(--persona-color)/10 rounded-full"
            style={{ "--persona-color": persona.color } as React.CSSProperties}
          >
            <IconSparkles className="h-4 w-4" style={{ color: persona.color }} />
            <span>Your Ambition in Action</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Experience the journey
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            This is how {persona.name.toLowerCase()} use AmbitiousYou. Try checking off items to see
            your progress update in real-time.
          </p>
        </MotionWrapper>

        {/* Main Showcase Grid */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Ambition Overview Card */}
          <MotionWrapper
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <Card.Card
              className="h-full relative overflow-hidden"
              style={{ "--ambition-color": ambition.ambition.ambitionColor } as React.CSSProperties}
            >
              {/* Decorative gradient */}
              <div className="absolute inset-0 bg-linear-to-br from-transparent via-transparent to-(--ambition-color) opacity-10 pointer-events-none" />

              <Card.CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <Card.CardTitle className="text-xl">
                    {ambition.ambition.ambitionName}
                  </Card.CardTitle>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-mono uppercase shrink-0",
                      ambition.ambition.ambitionPriority === "high"
                        ? "border-red-500 text-red-500"
                        : ambition.ambition.ambitionPriority === "medium"
                          ? "border-yellow-500 text-yellow-500"
                          : "border-green-500 text-green-500"
                    )}
                  >
                    {ambition.ambition.ambitionPriority}
                  </Badge>
                </div>
                <Card.CardDescription className="mt-2">
                  {ambition.ambition.ambitionDefinition}
                </Card.CardDescription>
              </Card.CardHeader>

              <Card.CardContent className="space-y-6">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">Overall Progress</span>
                    <span className="font-bold text-lg">{progress}%</span>
                  </div>
                  <Progress
                    value={progress}
                    className="h-2 *:bg-(--ambition-color) *:transition-all *:duration-500"
                  />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                      <IconCalendar className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Deadline</p>
                      <p className="text-sm font-medium">
                        {format(new Date(ambition.ambition.ambitionEndDate), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                      <IconCheck className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Completed</p>
                      <p className="text-sm font-medium">
                        {completedCount}/{totalItems} {ambition.ambition.ambitionTrackingMethod}s
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                      <IconFlag className="h-4 w-4 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className="text-sm font-medium capitalize flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                        {ambition.ambition.ambitionStatus}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                      <IconTargetArrow className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Method</p>
                      <p className="text-sm font-medium capitalize">
                        {ambition.ambition.ambitionTrackingMethod}-based
                      </p>
                    </div>
                  </div>
                </div>
              </Card.CardContent>
            </Card.Card>
          </MotionWrapper>

          {/* Interactive Items List */}
          <MotionWrapper
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <Card.Card className="h-full">
              <Card.CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Card.CardTitle className="text-lg flex items-center gap-2">
                    <IconCircleCheck className="h-5 w-5 text-primary" />
                    {ambition.ambition.ambitionTrackingMethod === "task" ? "Tasks" : "Milestones"}
                  </Card.CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    Interactive Demo
                  </Badge>
                </div>
                <Card.CardDescription>
                  Try clicking the checkboxes to see progress update
                </Card.CardDescription>
              </Card.CardHeader>

              <Card.CardContent>
                <div className="space-y-3">
                  {items.map((item, index) => {
                    const originallyCompleted =
                      "taskCompleted" in item
                        ? (item.taskCompleted ?? false)
                        : "milestoneCompleted" in item
                          ? (item.milestoneCompleted ?? false)
                          : false;
                    const isCompleted = isItemCompleted(item.id, originallyCompleted);
                    const itemName = "task" in item ? item.task : item.milestone;
                    const itemDescription =
                      "taskDescription" in item ? item.taskDescription : item.milestoneDescription;
                    const itemDate =
                      "taskDeadline" in item ? item.taskDeadline : item.milestoneTargetDate;

                    return (
                      <MotionWrapper
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div
                          className={cn(
                            "group flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer",
                            "hover:bg-muted/50 hover:border-primary/30",
                            isCompleted && "bg-green-500/5 border-green-500/20"
                          )}
                          onClick={() => onToggleItem(item.id)}
                        >
                          <Checkbox
                            checked={isCompleted}
                            onCheckedChange={() => onToggleItem(item.id)}
                            className={cn(
                              "mt-0.5 transition-all",
                              isCompleted &&
                                "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                            )}
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className={cn(
                                "text-sm font-medium transition-all",
                                isCompleted && "line-through text-muted-foreground"
                              )}
                            >
                              {itemName}
                            </p>
                            {itemDescription && (
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                {itemDescription}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(itemDate), "MMM d")}
                            </span>
                            {isCompleted && <IconCheck className="h-4 w-4 text-green-500" />}
                          </div>
                        </div>
                      </MotionWrapper>
                    );
                  })}
                </div>
              </Card.CardContent>
            </Card.Card>
          </MotionWrapper>
        </div>

        {/* Continue CTA */}
        <MotionWrapper
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">Like what you see? Start your journey today.</p>
          <Button variant="ay" size="lg" asChild className="group">
            <Link href="/signup">
              <IconRocket className="mr-2 h-4 w-4" />
              Get Started Free
            </Link>
          </Button>
        </MotionWrapper>
      </div>
    </section>
  );
}
