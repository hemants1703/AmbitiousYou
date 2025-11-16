import { MotionWrapper } from "@/components/MotionWrapper";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import * as Card from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as Popover from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { IconCalendar, IconList, IconCirclePlusFilled, IconX } from "@tabler/icons-react";
import { format, isAfter, isBefore, startOfToday } from "date-fns";
import { useState } from "react";
import { CreateNewAmbitionFormActionState } from "./actions";

interface TasksAdditionFormSectionProps {
  formState: CreateNewAmbitionFormActionState;
  setFormState: (state: CreateNewAmbitionFormActionState) => void;
}

export default function TasksAdditionFormSection(props: TasksAdditionFormSectionProps) {
  // State for the new task being added
  const [newTask, setNewTask] = useState({
    task: "",
    taskDescription: "",
    taskDeadline: new Date(),
  });

  const addTask = () => {
    if (!newTask.task.trim()) {
      return; // Don't add empty tasks
    }

    props.setFormState({
      ...props.formState,
      tasks: [...props.formState.tasks, { ...newTask }],
    });

    // Reset the form
    setNewTask({
      task: "",
      taskDescription: "",
      taskDeadline: new Date(),
    });
  };

  const removeTask = (index: number) => {
    props.setFormState({
      ...props.formState,
      tasks: props.formState.tasks.filter((_, i) => i !== index),
    });
  };

  const handleTaskKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      addTask();
    }
  };

  return (
    <>
      {/* TASKS SECTION */}
      <MotionWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card.Card>
          <Card.CardHeader>
            <Card.CardTitle>Tasks</Card.CardTitle>
            <Card.CardDescription>Create a few tasks to get started</Card.CardDescription>
          </Card.CardHeader>
          <Card.CardContent>
            <div className="space-y-4">
              <div className="space-y-4 flex flex-col">
                <div className="space-y-2">
                  <Label htmlFor="task-name">Task Name</Label>
                  <Input
                    id="task-name"
                    placeholder="Enter task name..."
                    value={newTask.task}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        task: e.target.value,
                      })
                    }
                    onKeyDown={handleTaskKeyDown}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-description">
                    Task Description{" "}
                    <span className="text-xs/tight text-muted-foreground">(optional)</span>
                  </Label>
                  <Textarea
                    id="task-description"
                    placeholder="Describe what needs to be done..."
                    value={newTask.taskDescription || ""}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        taskDescription: e.target.value,
                      })
                    }
                    onKeyDown={handleTaskKeyDown}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Task Deadline</Label>
                  <p className="text-xs text-muted-foreground">
                    Must be within the ambition&apos;s date range
                  </p>
                  <Popover.Popover>
                    <Popover.PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <IconCalendar className="mr-2 h-4 w-4" />
                        {newTask.taskDeadline ? (
                          format(newTask.taskDeadline, "PPP")
                        ) : (
                          <span>Select a deadline</span>
                        )}
                      </Button>
                    </Popover.PopoverTrigger>
                    <Popover.PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newTask.taskDeadline}
                        onSelect={(date) =>
                          date &&
                          setNewTask({
                            ...newTask,
                            taskDeadline: date,
                          })
                        }
                        disabled={(calendarDate) => {
                          // Disable dates before today
                          if (isBefore(calendarDate, startOfToday())) {
                            return true;
                          }

                          // Disable dates before ambition start date
                          if (
                            props.formState.ambitionStartDate &&
                            isBefore(calendarDate, new Date(props.formState.ambitionStartDate))
                          ) {
                            return true;
                          }

                          // Disable dates after ambition end date
                          if (
                            props.formState.ambitionEndDate &&
                            isAfter(calendarDate, new Date(props.formState.ambitionEndDate))
                          ) {
                            return true;
                          }

                          return false;
                        }}
                        initialFocus
                      />
                    </Popover.PopoverContent>
                  </Popover.Popover>
                </div>
                <Button
                  onClick={addTask}
                  type="button"
                  size="tiny"
                  className="self-end text-shadow-md dark:text-white"
                  style={{
                    backgroundColor: props.formState.ambitionColor ?? "var(--color-primary)",
                  }}
                >
                  <IconCirclePlusFilled className="h-4 w-4 mr-1" /> Create Task
                </Button>
              </div>

              {props.formState.tasks.length === 0 ? (
                <MotionWrapper
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-4 text-muted-foreground"
                >
                  <MotionWrapper
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <IconList className="h-16 w-16 mx-auto mb-2 opacity-20" />
                    <div>
                      <p>No tasks added yet</p>
                      <p className="text-sm">Add some tasks to get started</p>
                    </div>
                  </MotionWrapper>
                </MotionWrapper>
              ) : (
                <div className="space-y-2">
                  {props.formState.tasks.map((task, index) => (
                    <MotionWrapper
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      className="flex items-start justify-between p-3 border rounded-md"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <IconList className="h-4 w-4 text-primary mt-1" />
                          <div>
                            <p className="font-medium">{task.task}</p>
                            {task.taskDescription && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {task.taskDescription}
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground mt-1">
                              Deadline: {format(new Date(task.taskDeadline), "PPP")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <MotionWrapper whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          type="button"
                          variant="destructive"
                          size="tiny"
                          className="rounded-full size-5 p-0"
                          onClick={() => removeTask(index)}
                        >
                          <IconX className="text-white size-4" strokeWidth={3} />
                        </Button>
                      </MotionWrapper>
                    </MotionWrapper>
                  ))}
                </div>
              )}
            </div>
          </Card.CardContent>
        </Card.Card>
      </MotionWrapper>
    </>
  );
}
