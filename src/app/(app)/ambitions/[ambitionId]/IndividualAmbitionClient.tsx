"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Progress } from "@/src/components/ui/progress";
import {
  ArrowLeft,
  Calendar,
  Edit,
  Flag,
  MoreHorizontal,
  Plus,
  Trash2,
  ListTodo,
} from "lucide-react";
import Link from "next/link";
import { CalendarIcon, CheckIcon, StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { format } from "date-fns";
import { toast } from "sonner";
import { AmbitionColorBadge, AmbitionPriorityBadge } from "../AmbitionsClient";
import { favouriteAmbitionAction } from "../actions";
import { AmbitionData, AmbitionMilestone, AmbitionTask } from "@/types";
import { DeleteAmbitionDialog } from "./page";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

interface IndividualAmbitionClientProps {
  ambition: AmbitionData; // Replace with proper type
  tasks: AmbitionTask[]; // Replace with proper type
  milestones: AmbitionMilestone[]; // Replace with proper type
}

export function IndividualAmbitionClient({
  ambition,
  tasks,
  milestones,
}: IndividualAmbitionClientProps) {
  const [deleteAmbitionDialogOpen, setDeleteAmbitionDialogOpen] = useState(false);

  return (
    <section className="p-6 md:p-8 pt-6">
      {/* DELETE AMBITION DIALOG */}
      <DeleteAmbitionDialog
        ambitionId={ambition.id}
        ambitionTrackingMethod={ambition.ambitionTrackingMethod}
        deleteAmbitionDialogOpen={deleteAmbitionDialogOpen}
        setDeleteAmbitionDialogOpen={setDeleteAmbitionDialogOpen}
      />

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
                <AmbitionColorBadge ambitionColor={ambition.ambitionColor} index={1} width={200} />
                <AmbitionPriorityBadge ambitionPriority={ambition.ambitionPriority} />
              </div>
              <h1 className="text-3xl font-bold mt-1 flex items-center gap-1">
                {ambition.ambitionName}{" "}
                {ambition.isFavourited && <StarFilledIcon className="size-6 text-yellow-500" />}
              </h1>
            </div>
          </div>

          <div className="flex gap-2">
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
                <DropdownMenuItem
                  onClick={async () => {
                    const { success, message, description, error } = await favouriteAmbitionAction(
                      ambition.userId,
                      ambition.id,
                      !ambition.isFavourited
                    );
                    if (success) {
                      toast.success(message, {
                        description: description,
                      });
                    } else if (error) {
                      toast.error("Error adding ambition to favorites", {
                        description: "Please try again",
                      });
                    }
                  }}
                >
                  {ambition.isFavourited ? (
                    <StarFilledIcon className="h-4 w-4 mr-2 text-yellow-500" />
                  ) : (
                    <StarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  )}{" "}
                  Add to Favorites
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => setDeleteAmbitionDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete Ambition
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="w-full flex flex-col md:flex-row gap-5"
        >
          {/* Ambition Overview Card */}
          <motion.div variants={item} className="flex-1">
            <Card>
              <CardHeader>
                <CardTitle>Ambition Overview</CardTitle>
                <CardDescription>{ambition.ambitionDefinition}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm font-medium">
                      {ambition.ambitionPercentageCompleted}%
                    </span>
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
                      <p className="text-sm text-muted-foreground">Deadline</p>
                      <p className="font-medium">
                        {format(new Date(ambition.ambitionDeadline), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckIcon className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {ambition.ambitionTrackingMethod === "task" ? "Task" : "Milestone"}{" "}
                        Completion
                      </p>
                      <p className="font-medium">
                        {ambition.ambitionTrackingMethod === "task" ? (
                          <>
                            {tasks.filter((t) => t.taskCompleted).length}/{tasks.length} tasks
                            completed
                          </>
                        ) : (
                          <>
                            {milestones.filter((m) => m.milestoneCompleted).length}/
                            {milestones.length} milestones completed
                          </>
                        )}
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
                        <span
                          className={`h-2 w-2 rounded-full ${ambition.ambitionStatus === "active" ? "bg-green-500" : "bg-amber-500"}`}
                        ></span>
                        {ambition.ambitionStatus.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {ambition.ambitionTrackingMethod === "task" ? (
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
                      <div
                        className={`h-5 w-5 rounded-full border flex items-center justify-center ${task.taskCompleted ? "bg-primary border-primary" : "border-input"}`}
                      >
                        {task.taskCompleted && (
                          <CheckIcon className="h-3 w-3 text-primary-foreground" />
                        )}
                      </div>
                      <span
                        className={task.taskCompleted ? "line-through text-muted-foreground" : ""}
                      >
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
        ) : (
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
                    <motion.div key={milestone.id} variants={item} className="relative pl-10">
                      <div
                        className={`absolute left-0 h-5 w-5 rounded-full ${milestone.milestoneCompleted ? "bg-primary" : "bg-muted-foreground/25"} flex items-center justify-center`}
                      >
                        {milestone.milestoneCompleted && (
                          <CheckIcon className="h-3 w-3 text-primary-foreground" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <h4
                          className={`text-base font-medium ${milestone.milestoneCompleted ? "text-primary" : ""}`}
                        >
                          {milestone.milestone}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Target date:{" "}
                          {format(new Date(milestone.milestoneTargetDate), "MMMM d, yyyy")}
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
        )}
      </div>
    </section>
  );
}
