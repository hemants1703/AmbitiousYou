"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  ExternalLink,
  Flag,
  ListTodo,
  MoreHorizontal,
  Plus,
  Share2,
  Star,
  Target,
  Timer,
  Trash2
} from "lucide-react";
import Link from "next/link";
import {
  CalendarIcon,
  CheckIcon,
  InfoCircledIcon,
  LightningBoltIcon,
  ReloadIcon,
  StarFilledIcon,
  StarIcon
} from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { format } from "date-fns";
import { deleteAmbitionAction } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AmbitionCategoryBadge, AmbitionColorBadge, AmbitionPriorityBadge } from "../AmbitionsClient";
import { favouriteAmbitionAction } from "../actions";
import { AmbitionData, AmbitionMilestone, AmbitionTask } from "@/types";
// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

interface IndividualAmbitionClientProps {
  ambition: AmbitionData; // Replace with proper type
  tasks: AmbitionTask[]; // Replace with proper type
  milestones: AmbitionMilestone[]; // Replace with proper type
  timeEntries: any[]; // Replace with proper type
}

export function IndividualAmbitionClient({
  ambition,
  tasks,
  milestones,
  timeEntries
}: IndividualAmbitionClientProps) {
  const [newTask, setNewTask] = useState("");
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [deleteAmbitionDialogOpen, setDeleteAmbitionDialogOpen] = useState(false);

  // Mock data for insights - in a real app, this would come from an API
  const insights = [
    { type: "trend", title: "Consistent Progress", description: "You've maintained steady progress for 3 weeks." },
    { type: "suggestion", title: "Focus on Conversations", description: "Spending more time in conversation practice will accelerate your learning." },
    { type: "warning", title: "Vocabulary Gap", description: "Your vocabulary retention has decreased recently." }
  ];

  return (
    <section>
      {/* DELETE AMBITION DIALOG */}
      <DeleteAmbitionDialog ambitionId={ambition.id} ambitionTrackingMethod={ambition.ambitionTrackingMethod} deleteAmbitionDialogOpen={deleteAmbitionDialogOpen} setDeleteAmbitionDialogOpen={setDeleteAmbitionDialogOpen} />

      {/* MAIN CONTENT */}
      <div className="space-y-6">
        {/* HEADER AND ACTIONS */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link prefetch={true} href="/ambitions">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <AmbitionCategoryBadge ambitionCategory={ambition.ambitionCategory} />
                <AmbitionColorBadge ambitionColor={ambition.ambitionColor} index={1} width={200} />
                <AmbitionPriorityBadge ambitionPriority={ambition.ambitionPriority} />
              </div>
              <h1 className="text-3xl font-bold mt-1 flex items-center gap-1">{ambition.ambitionName} {ambition.isFavourited && <StarFilledIcon className="size-6 text-yellow-500" />}</h1>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Timer className="h-4 w-4" />
              Track Time
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" /> Edit Ambition
                </DropdownMenuItem>
                <DropdownMenuItem onClick={async () => {
                  const { success, message, description, error } = await favouriteAmbitionAction(ambition.userId, ambition.id, !ambition.isFavourited)
                  if (success) {
                    toast.success(message, {
                      description: description
                    });
                  } else if (error) {
                    toast.error("Error adding ambition to favorites", {
                      description: "Please try again"
                    });
                  }
                }}>
                  {ambition.isFavourited ? <StarFilledIcon className="h-4 w-4 mr-2 text-yellow-500" /> : <StarIcon className="h-4 w-4 mr-2 text-muted-foreground" />} Add to Favorites
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <ExternalLink className="h-4 w-4 mr-2" /> Export Data
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={() => setDeleteAmbitionDialogOpen(true)}>
                  <Trash2 className="h-4 w-4 mr-2" /> Delete Ambition
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        {/* TABS */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full md:w-[500px] grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {ambition.ambitionTrackingMethod === "task" ?
              (
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
              ) : (
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
              )
            }
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="lg:col-span-2 space-y-6"
              >
                {/* Ambition Overview Card */}
                <motion.div variants={item}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Ambition Overview</CardTitle>
                      <CardDescription>{ambition.ambitionDefinition}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Overall Progress</span>
                          <span className="text-sm font-medium">{ambition.ambitionPercentageCompleted}%</span>
                        </div>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          <Progress value={ambition.ambitionPercentageCompleted} className="h-2" />
                        </motion.div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                            <Calendar className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Date Range</p>
                            <p className="font-medium">
                              {format(new Date(ambition.ambitionStartDate ?? ""), "MMM d, yyyy")} - {format(new Date(ambition.ambitionDeadline), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Tasks Completion</p>
                            <p className="font-medium">
                              {tasks.filter(t => t.taskCompleted).length}/{tasks.length} tasks completed
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                            <Clock className="h-4 w-4 text-amber-600" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Time Investment</p>
                            <p className="font-medium">
                              {timeEntries.reduce((acc, entry) => acc + parseInt(entry.duration), 0)} hours
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                            <Flag className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <p className="font-medium capitalize flex items-center gap-1">
                              <span className={`h-2 w-2 rounded-full ${ambition.ambitionStatus === "active" ? "bg-green-500" : "bg-amber-500"}`}></span>
                              {ambition.ambitionStatus.replace("_", " ")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {ambition.ambitionTrackingMethod === "task" ? (
                  <>
                    {/* Recent Tasks Card */}
                    <motion.div variants={item}>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <div>
                            <CardTitle>Recent Tasks</CardTitle>
                            <CardDescription>Your most recent tasks for this ambition</CardDescription>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link prefetch={true} href={`/ambitions/${ambition.id}/tasks`}>
                              View All
                            </Link>
                          </Button>
                        </CardHeader>
                        <CardContent>
                          <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="space-y-4 mt-1"
                          >
                            {tasks.slice(0, 3).map((task, index) => (
                              <motion.div
                                key={task.id}
                                variants={item}
                                transition={{ duration: 0.3, delay: 0.1 * index }}
                                className="flex items-center justify-between p-3 border rounded-md"
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${task.taskCompleted ? "bg-primary border-primary" : "border-input"}`}>
                                    {task.taskCompleted && <CheckIcon className="h-3 w-3 text-primary-foreground" />}
                                  </div>
                                  <span className={task.taskCompleted ? "line-through text-muted-foreground" : ""}>
                                    {task.task}
                                  </span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                                  <span>Due {format(new Date(task.taskDeadline), "MMM d")}</span>
                                </div>
                              </motion.div>
                            ))}

                            {/* Add new task input */}
                            <div className="flex gap-2 mt-4">
                              <Input
                                placeholder="Add a new task..."
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                                className="flex-1"
                              />
                              <Button size="sm">
                                <Plus className="h-4 w-4 mr-1" /> Add
                              </Button>
                            </div>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </>
                ) : (
                  <>
                    {/* Milestone Progress Card */}
                    <motion.div variants={item}>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <div>
                            <CardTitle>Milestone Progress</CardTitle>
                            <CardDescription>Key milestones for your ambition</CardDescription>
                          </div>
                          <Button variant="outline" size="sm">View Timeline</Button>
                        </CardHeader>
                        <CardContent>
                          <div className="relative mt-6">
                            {/* Timeline line */}
                            <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-border"></div>

                            {/* Milestones */}
                            <motion.div
                              variants={container}
                              initial="hidden"
                              animate="show"
                              className="space-y-8"
                            >
                              {milestones.map((milestone) => (
                                <motion.div
                                  key={milestone.id}
                                  variants={item}
                                  className="relative pl-10"
                                >
                                  <div className={`absolute left-0 h-5 w-5 rounded-full ${milestone.milestoneCompleted ? "bg-primary" : "bg-muted-foreground/25"} flex items-center justify-center`}>
                                    {milestone.milestoneCompleted && <CheckIcon className="h-3 w-3 text-primary-foreground" />}
                                  </div>
                                  <div className="flex flex-col">
                                    <h4 className={`text-base font-medium ${milestone.milestoneCompleted ? "text-primary" : ""}`}>
                                      {milestone.milestone}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      Target date: {format(new Date(milestone.milestoneTargetDate), "MMMM d, yyyy")}
                                    </p>
                                  </div>
                                </motion.div>
                              ))}
                            </motion.div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </>
                )
                }
              </motion.div>

              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-6"
              >
                {/* Time Tracking Card */}
                <motion.div variants={item}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Time Tracking</CardTitle>
                      <CardDescription>Monitor time spent on this ambition</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 border border-dashed rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-muted-foreground">Timer</p>
                            <p className="text-2xl font-bold tabular-nums">
                              {isTimerActive ? "00:23:45" : "00:00:00"}
                            </p>
                          </div>
                          <Button
                            variant={isTimerActive ? "destructive" : "default"}
                            onClick={() => setIsTimerActive(!isTimerActive)}
                          >
                            {isTimerActive ? "Stop" : "Start"} Timer
                          </Button>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-3">Recent Time Entries</h4>
                        <div className="space-y-3">
                          {timeEntries.map((entry, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.1 * index }}
                              className="flex justify-between items-center text-sm p-2 border-b last:border-0"
                            >
                              <div>
                                <p className="font-medium">{entry.activity}</p>
                                <p className="text-xs text-muted-foreground">
                                  {format(new Date(entry.date), "MMMM d, yyyy")}
                                </p>
                              </div>
                              <div className="font-mono">{entry.duration}</div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="text-center">
                        <Button variant="ghost" size="sm" className="w-full" asChild>
                          <Link prefetch={true} href={`/time?ambition=${ambition.id}`}>
                            View Complete History
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Quick Stats Card */}
                <motion.div variants={item}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Stats</CardTitle>
                      <CardDescription>Key metrics for this ambition</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">Consistency Score</div>
                        <div className="font-medium">85/100</div>
                      </div>
                      <Progress value={85} className="h-1" />

                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">Efficiency Rate</div>
                        <div className="font-medium">78%</div>
                      </div>
                      <Progress value={78} className="h-1" />

                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">On-track Probability</div>
                        <div className="font-medium">92%</div>
                      </div>
                      <Progress value={92} className="h-1" />

                      <div className="mt-4">
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <Link prefetch={true} href={`/analytics?ambition=${ambition.id}`}>
                            View Complete Analytics
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Insights Card */}
                <motion.div variants={item}>
                  <Card>
                    <CardHeader>
                      <CardTitle>AI Insights</CardTitle>
                      <CardDescription>Personalized recommendations</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {insights.map((insight, index) => {
                        const iconMap = {
                          trend: <LightningBoltIcon className="h-4 w-4 text-blue-500" />,
                          suggestion: <InfoCircledIcon className="h-4 w-4 text-amber-500" />,
                          warning: <ReloadIcon className="h-4 w-4 text-red-500" />
                        };

                        const icon = iconMap[insight.type as keyof typeof iconMap];

                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 + (0.1 * index) }}
                            className="p-3 bg-muted/50 rounded-lg"
                          >
                            <div className="flex items-start gap-2">
                              <div className="mt-0.5">{icon}</div>
                              <div>
                                <h4 className="text-sm font-medium">{insight.title}</h4>
                                <p className="text-xs text-muted-foreground mt-0.5">{insight.description}</p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </div>
          </TabsContent>


          {ambition.ambitionTrackingMethod === "task" ? (
            <TabsContent value="tasks" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle>All Tasks</CardTitle>
                      <CardDescription>Manage tasks for this ambition</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <ListTodo className="h-4 w-4 mr-2" /> Filter
                      </Button>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" /> New Task
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-3"
                  >
                    {tasks.map((task) => (
                      <motion.div
                        key={task.id}
                        variants={item}
                        className="flex items-center justify-between p-3 border rounded-md"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${task.taskCompleted ? "bg-primary border-primary" : "border-input"}`}>
                            {task.taskCompleted && <CheckIcon className="h-3 w-3 text-primary-foreground" />}
                          </div>
                          <span className={task.taskCompleted ? "line-through text-muted-foreground" : ""}>
                            {task.task}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-muted-foreground">
                            <CalendarIcon className="h-3.5 w-3.5 inline mr-1" />
                            <span>Due {format(new Date(task.taskDeadline), "MMM d")}</span>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </CardContent>
              </Card>
            </TabsContent>
          ) : (
            <TabsContent value="milestones" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Milestones Journey</CardTitle>
                      <CardDescription>Progress through key checkpoints</CardDescription>
                    </div>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" /> Add Milestone
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative mt-6">
                    {/* Timeline line */}
                    <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-border"></div>

                    {/* Milestones */}
                    <motion.div
                      variants={container}
                      initial="hidden"
                      animate="show"
                      className="space-y-10"
                    >
                      {milestones.map((milestone) => (
                        <motion.div
                          key={milestone.id}
                          variants={item}
                          className="relative pl-10"
                        >
                          <div className={`absolute left-0 h-5 w-5 rounded-full ${milestone.milestoneCompleted ? "bg-primary" : "bg-muted-foreground/25"} flex items-center justify-center`}>
                            {milestone.milestoneCompleted && <CheckIcon className="h-3 w-3 text-primary-foreground" />}
                          </div>
                          <div className="flex flex-col">
                            <h4 className={`text-base font-medium ${milestone.milestoneCompleted ? "text-primary" : ""}`}>
                              {milestone.milestone}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Target date: {format(new Date(milestone.milestoneTargetDate), "MMMM d, yyyy")}
                            </p>
                            {milestone.milestoneCompleted ? (
                              <Badge className="w-fit mt-2 bg-green-500/10 text-green-600 border-green-500/20">
                                Completed
                              </Badge>
                            ) : (
                              <Button variant="outline" size="sm" className="w-fit mt-2">
                                Mark as Complete
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="insights" className="space-y-6 mt-6">
            {/* First row - Charts */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Performance Analysis Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Analysis</CardTitle>
                  <CardDescription>Your progress trends and patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-end gap-2">
                    {['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'].map((week, i) => {
                      const heights = [45, 52, 48, 70, 66, 78];
                      return (
                        <motion.div
                          key={week}
                          className="flex-1 flex flex-col items-center gap-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 * i }}
                        >
                          <div
                            className="bg-primary/80 rounded-t-md w-full"
                            style={{ height: `${heights[i]}%` }}
                          ></div>
                          <span className="text-xs mt-1 text-muted-foreground">
                            {week}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Task Completion Rate Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Task Completion Rate</CardTitle>
                  <CardDescription>Task completion over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center relative">
                      <div className="absolute inset-2 rounded-full border-8 border-primary/70"></div>
                      <div className="text-center">
                        <span className="text-3xl font-bold">65%</span>
                        <p className="text-xs text-muted-foreground">Completion</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Second row - Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Smart Recommendations</CardTitle>
                <CardDescription>AI-powered suggestions to improve your progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 border rounded-md"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <Target className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Focus on conversation practice</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Based on your progress data, increasing conversation practice by 30 minutes per week
                        could improve your proficiency by 15% before your next milestone.
                      </p>
                      <Button variant="outline" size="sm" className="mt-3">
                        Schedule practice
                      </Button>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="p-4 border rounded-md"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Optimize your study schedule</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your data shows higher retention when studying in the morning. Consider
                        rescheduling vocabulary practice to before 11 AM.
                      </p>
                      <Button variant="outline" size="sm" className="mt-3">
                        View optimal times
                      </Button>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="p-4 border rounded-md"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Set smaller milestone intervals</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Creating more frequent checkpoints between your major milestones
                        has been shown to increase motivation and consistency.
                      </p>
                      <Button variant="outline" size="sm" className="mt-3">
                        Adjust milestones
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section >
  );
}

function DeleteAmbitionDialog({ ambitionId, ambitionTrackingMethod, deleteAmbitionDialogOpen, setDeleteAmbitionDialogOpen }: { ambitionId: string, ambitionTrackingMethod: string, deleteAmbitionDialogOpen: boolean, setDeleteAmbitionDialogOpen: (open: boolean) => void }) {
  const router = useRouter();
  return (
    <AlertDialog open={deleteAmbitionDialogOpen} onOpenChange={setDeleteAmbitionDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this ambition
            and remove all associated data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant={"destructive"} onClick={async () => {
              const { success, error } = await deleteAmbitionAction(ambitionId, ambitionTrackingMethod);
              if (success) {
                toast.success("Ambition deleted successfully");
                router.push("/ambitions");
              } else if (error) {
                toast.error("Error deleting ambition");
              }
            }}>
              Yes, Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}