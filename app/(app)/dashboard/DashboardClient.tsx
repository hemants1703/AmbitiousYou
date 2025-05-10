"use client";

import * as Tabs from "@/components/ui/tabs";
import * as Card from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  BarChartIcon,
  CheckCircledIcon,
  ClockIcon,
  InfoCircledIcon,
  PlusCircledIcon,
  TargetIcon,
  LightningBoltIcon,
  TimerIcon,
  DoubleArrowUpIcon,
  StarFilledIcon,
  PlusIcon,
  RocketIcon,
} from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { SupabaseProfileData, Ambition, Task, Milestone } from "@/types";
import { getRandomGreeting, getGreetingByEnergy } from "@/lib/greetings";
import { useEffect, useState } from "react";
import { motivationalQuotes } from "@/lib/motivationalQuotes";
import ProBadge from "@/components/ProBadge";

export function DashboardClient({ profileData, ambitions, tasks, milestones, isProUser }: { profileData: SupabaseProfileData[], ambitions: Ambition[], tasks: Task[], milestones: Milestone[], isProUser: boolean }) {
  const { firstName, lastName } = profileData[0];
  const [greeting, setGreeting] = useState(getRandomGreeting());

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.taskCompleted === true);
  const incompleteTasks = totalTasks - completedTasks.length;

  const nearCompletionAmbitions = ambitions.filter((ambition) => ambition.ambitionPercentageCompleted >= 80);

  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
  const randomMotivationalQuote = motivationalQuotes[randomIndex];

  // Update greeting based on time of day
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      let energy: "high" | "medium" | "calm";

      // Morning (5-11): High energy
      if (hour >= 5 && hour < 12) {
        energy = "high";
      }
      // Afternoon (12-17): Medium energy
      else if (hour >= 12 && hour < 18) {
        energy = "medium";
      }
      // Evening (18-4): Calm energy
      else {
        energy = "calm";
      }

      setGreeting(getGreetingByEnergy(energy));
    };

    // Update immediately
    updateGreeting();

    // Update every 5 minutes
    const interval = setInterval(updateGreeting, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-8 pb-10 overflow-auto">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-lg border bg-card p-6 shadow-sm relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <motion.h1
                key={greeting.prefix}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-3xl font-bold tracking-tight mb-1"
              >
                {greeting.prefix} {firstName},
              </motion.h1>
              <motion.p
                key={greeting.suffix}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-muted-foreground"
              >
                {greeting.suffix}
              </motion.p>
            </div>
            <Button asChild variant="outline">
              <Link href="/ambitions/new" className="gap-2 flex justify-center items-center">
                <PlusCircledIcon className="h-4 w-4" />
                New Ambition
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Key Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card.Card className="relative overflow-hidden">
          <Card.CardHeader className="pb-2">
            <Card.CardDescription className="flex items-center">
              <TargetIcon className="h-4 w-4 mr-1 text-primary" />
              Active Ambitions
            </Card.CardDescription>
            <Card.CardTitle className="text-2xl font-bold">{ambitions.length}</Card.CardTitle>
          </Card.CardHeader>
          <Card.CardContent className="pb-2">
            <div className="flex items-center text-sm">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {nearCompletionAmbitions.length} near completion
              </Badge>
            </div>
          </Card.CardContent>
          <div className="absolute inset-0 pointer-events-none border-2 border-primary/10 rounded-xl" />
        </Card.Card>

        <Card.Card>
          <Card.CardHeader className="pb-2">
            <Card.CardDescription className="flex items-center">
              <CheckCircledIcon className="h-4 w-4 mr-1 text-green-500" />
              Tasks Completed
            </Card.CardDescription>
            <Card.CardTitle className="text-2xl font-bold">{`${completedTasks.length}/${totalTasks}`}</Card.CardTitle>
          </Card.CardHeader>
          <Card.CardContent className="pb-2">
            <Progress value={74} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">74% completion rate</p>
          </Card.CardContent>
        </Card.Card>

        <Card.Card>
          <Card.CardHeader className="pb-2">
            <Card.CardDescription className="flex items-center">
              <LightningBoltIcon className="h-4 w-4 mr-1 text-amber-500" />
              Active Streak
            </Card.CardDescription>
            <Card.CardTitle className="text-2xl font-bold">16 days</Card.CardTitle>
          </Card.CardHeader>
          <Card.CardContent className="pb-2">
            <div className="flex items-center">
              <div className="flex space-x-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-2 rounded-full ${i < 6 ? "bg-amber-400" : "bg-muted"}`}
                  />
                ))}
              </div>
              <span className="text-xs ml-2 text-muted-foreground">Best: 24 days</span>
            </div>
          </Card.CardContent>
        </Card.Card>

        <Card.Card>
          <Card.CardHeader className="pb-2">
            <Card.CardDescription className="flex items-center">
              <DoubleArrowUpIcon className="h-4 w-4 mr-1 text-blue-500" />
              Productivity Score
            </Card.CardDescription>
            <Card.CardTitle className="text-2xl font-bold">92%</Card.CardTitle>
          </Card.CardHeader>
          <Card.CardContent className="pb-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <StarFilledIcon key={i} className="h-4 w-4 text-amber-400" />
              ))}
              <span className="text-xs ml-2 text-green-500">+5% this week</span>
            </div>
          </Card.CardContent>
        </Card.Card>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2">
          <Card.Card className="h-full">
            <Card.CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <Card.CardTitle>Your Progress</Card.CardTitle>
                <Card.CardDescription>Weekly ambition progress overview</Card.CardDescription>
              </div>
              <Tabs.Tabs defaultValue="week" className="w-auto">
                <Tabs.TabsList className="grid w-[240px] grid-cols-3">
                  <Tabs.TabsTrigger value="week">Week</Tabs.TabsTrigger>
                  <Tabs.TabsTrigger value="month">Month</Tabs.TabsTrigger>
                  <Tabs.TabsTrigger value="year">Year</Tabs.TabsTrigger>
                </Tabs.TabsList>
              </Tabs.Tabs>
            </Card.CardHeader>
            <Card.CardContent>
              {/* Simple Progress Chart */}
              <div className="h-[250px] flex items-end gap-2 mt-4">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
                  const heights = [60, 85, 70, 40, 95, 80, 65];
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className={cn(
                          "w-full rounded-t-md bg-gradient-to-t from-primary/80 to-primary/60 transition-all",
                          i === 4 && "from-primary to-primary/90"
                        )}
                        style={{ height: `${heights[i]}%` }}
                      />
                      <span className="text-xs text-muted-foreground">{day}</span>
                    </div>
                  );
                })}
              </div>
            </Card.CardContent>
          </Card.Card>
        </div>

        <Card.Card className="h-full flex flex-col">
          <Card.CardHeader className="pb-2">
            <Card.CardTitle className="flex items-center gap-2">
              Today&apos;s Focus
              <Badge variant="secondary" className="ml-2">
                5 tasks
              </Badge>
            </Card.CardTitle>
            <Card.CardDescription>High priority tasks for today</Card.CardDescription>
          </Card.CardHeader>
          <Card.CardContent className="flex-1">
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {[
                  {
                    title: "Complete project presentation",
                    ambition: "Work Promotion",
                    dueTime: "2:00 PM",
                    completed: false,
                    priority: "high",
                  },
                  {
                    title: "30 min language practice",
                    ambition: "Learn Spanish",
                    dueTime: "4:30 PM",
                    completed: false,
                    priority: "medium",
                  },
                  {
                    title: "5K training run",
                    ambition: "Marathon Preparation",
                    dueTime: "6:00 PM",
                    completed: false,
                    priority: "high",
                  },
                  {
                    title: "Read chapter 7",
                    ambition: "Finance Knowledge",
                    dueTime: "9:30 PM",
                    completed: false,
                    priority: "low",
                  },
                  {
                    title: "Journal entry",
                    ambition: "Daily Reflection",
                    dueTime: "10:00 PM",
                    completed: false,
                    priority: "medium",
                  },
                ].map((task, i) => (
                  <div
                    key={i}
                    className={cn(
                      "p-3 rounded-md border",
                      task.priority === "high"
                        ? "border-red-200 bg-red-50/50 dark:bg-red-950/20 dark:border-red-800/30"
                        : task.priority === "medium"
                          ? "border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800/30"
                          : "border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800/30"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-sm text-muted-foreground">{task.ambition}</p>
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{task.dueTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card.CardContent>
          <Card.CardFooter className="border-t pt-4">
            <Button className="w-full">
              <PlusIcon className="mr-2 h-4 w-4" /> Add New Task
            </Button>
          </Card.CardFooter>
        </Card.Card>
      </motion.div>

      {/* Recent Activity & Motivational Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <Card.Card className="col-span-1">
          <Card.CardHeader>
            <Card.CardTitle>Daily Motivation</Card.CardTitle>
            <Card.CardDescription>Your quote for today</Card.CardDescription>
          </Card.CardHeader>
          <Card.CardContent>
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
              <blockquote className="border-l-4 border-primary pl-4 italic">
                &quot;{randomMotivationalQuote.quote}&quot;
              </blockquote>
              <p className="text-right text-sm text-muted-foreground mt-2">— {randomMotivationalQuote.author}</p>
            </div>
          </Card.CardContent>
        </Card.Card>

        <Card.Card className="lg:col-span-2">
          <Card.CardHeader>
            <Card.CardTitle>Recent Activity</Card.CardTitle>
            <Card.CardDescription>Latest updates from your ambitions</Card.CardDescription>
          </Card.CardHeader>
          <Card.CardContent>
            <ScrollArea className="h-[220px] pr-4">
              {[
                {
                  title: "Completed task",
                  description: "Morning meditation routine",
                  ambition: "Mental Wellness",
                  time: "2 hours ago",
                  icon: CheckCircledIcon,
                  iconColor: "text-green-500",
                },
                {
                  title: "Reached milestone",
                  description: "50% progress on Spanish course",
                  ambition: "Learn Spanish",
                  time: "Yesterday",
                  icon: TargetIcon,
                  iconColor: "text-blue-500",
                },
                {
                  title: "Updated ambition",
                  description: "Added new milestone to Marathon Training",
                  ambition: "Marathon Preparation",
                  time: "Yesterday",
                  icon: BarChartIcon,
                  iconColor: "text-amber-500",
                },
                {
                  title: "Achievement unlocked",
                  description: "7-day streak maintained",
                  ambition: "Daily Learning",
                  time: "2 days ago",
                  icon: LightningBoltIcon,
                  iconColor: "text-purple-500",
                },
                {
                  title: "New ambition created",
                  description: "Started 'Master Photography'",
                  ambition: "Master Photography",
                  time: "3 days ago",
                  icon: PlusCircledIcon,
                  iconColor: "text-primary",
                },
              ].map((activity, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * i }}
                  className="flex items-start gap-4 mb-4"
                >
                  <div
                    className={`h-10 w-10 rounded-full ${activity.iconColor === "text-primary" ? "bg-primary/20" : "bg-card"
                      } border border-border flex items-center justify-center flex-shrink-0`}
                  >
                    <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium">{activity.title}</p>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                    <p className="text-sm">{activity.description}</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {activity.ambition}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </ScrollArea>
          </Card.CardContent>
        </Card.Card>
      </motion.div>

      {/* Learning & Insights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card.Card>
          <Card.CardHeader>
            <Card.CardTitle>Learning Recommendations {isProUser ? <ProBadge /> : null}</Card.CardTitle>
            <Card.CardDescription>Based on your ambitions and interests</Card.CardDescription>
          </Card.CardHeader>
          <Card.CardContent className="pb-0">
            <div className="space-y-4">
              {[
                {
                  title: "Advanced Goal Setting Techniques",
                  description: "Master the art of setting and achieving ambitious goals",
                  duration: "45 min",
                  label: "Premium",
                  bgClass: "bg-gradient-to-r from-blue-500/10 to-indigo-500/10",
                  buttonText: "Start Learning",
                  icon: RocketIcon,
                },
                {
                  title: "Time Management for High Achievers",
                  description: "Optimize your schedule for maximum productivity",
                  duration: "30 min",
                  label: "Featured",
                  bgClass: "bg-gradient-to-r from-amber-500/10 to-orange-500/10",
                  buttonText: "Continue",
                  icon: TimerIcon,
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                  className={`rounded-lg border border-border p-4 ${item.bgClass}`}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {item.label}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {item.duration}
                    </div>
                    <Button size="sm" variant="outline" className="gap-1">
                      {item.buttonText}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card.CardContent>
          <Card.CardFooter className="pt-4">
            <Button variant="ghost" className="w-full text-primary">
              View All Recommendations
            </Button>
          </Card.CardFooter>
        </Card.Card>

        <Card.Card>
          <Card.CardHeader>
            <Card.CardTitle>Weekly Insights</Card.CardTitle>
            <Card.CardDescription>
              Data-driven insights to improve your progress
            </Card.CardDescription>
          </Card.CardHeader>
          <Card.CardContent>
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="p-4 rounded-lg bg-green-500/10 border border-green-500/20"
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircledIcon className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-green-600 dark:text-green-400">
                      Productivity Increase
                    </h4>
                    <p className="text-sm mt-1">
                      You&apos;ve completed 30% more tasks than last week. Keep up the momentum!
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20"
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <InfoCircledIcon className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-amber-600 dark:text-amber-400">
                      Focus Opportunity
                    </h4>
                    <p className="text-sm mt-1">
                      You&apos;ve spent 20% less time on your top priority ambition this week.
                      Consider reallocating your focus.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20"
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <BarChartIcon className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-600 dark:text-blue-400">
                      Progress Pattern
                    </h4>
                    <p className="text-sm mt-1">
                      You&apos;re most productive on Wednesdays and Fridays. Consider scheduling
                      important tasks on these days.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </Card.CardContent>
        </Card.Card>
      </motion.div>
    </div>
  );
} 