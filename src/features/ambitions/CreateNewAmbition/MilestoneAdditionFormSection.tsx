import { MotionWrapper } from "@/components/MotionWrapper";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import * as Card from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as Popover from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  IconAward,
  IconCalendar,
  IconCircle,
  IconCircleCheck,
  IconPlus,
  IconX,
} from "@tabler/icons-react";
import { format, isAfter, isBefore, startOfToday } from "date-fns";
import { useState } from "react";
import { CreateNewAmbitionFormActionState } from "./actions";

interface MilestoneAdditionFormSectionProps {
  formState: CreateNewAmbitionFormActionState;
  setFormState: (state: CreateNewAmbitionFormActionState) => void;
}

export default function MilestoneAdditionFormSection(props: MilestoneAdditionFormSectionProps) {
  // State for the new milestone being added
  const [newMilestone, setNewMilestone] = useState({
    milestone: "",
    milestoneDescription: "",
    milestoneTargetDate: new Date(),
    milestoneCompleted: false,
  });

  const addMilestone = () => {
    if (!newMilestone.milestone.trim()) {
      return; // Don't add empty milestones
    }

    props.setFormState({
      ...props.formState,
      milestones: [...props.formState.milestones, { ...newMilestone }],
    });

    // Reset the form
    setNewMilestone({
      milestone: "",
      milestoneDescription: "",
      milestoneTargetDate: new Date(),
      milestoneCompleted: false,
    });
  };

  const removeMilestone = (index: number) => {
    props.setFormState({
      ...props.formState,
      milestones: props.formState.milestones.filter((_, i) => i !== index),
    });
  };

  const toggleMilestoneCompletion = (index: number) => {
    const updatedMilestones = [...props.formState.milestones];
    updatedMilestones[index] = {
      ...updatedMilestones[index],
      milestoneCompleted: !updatedMilestones[index].milestoneCompleted,
    };
    props.setFormState({
      ...props.formState,
      milestones: updatedMilestones,
    });
  };
  return (
    <>
      {/* MILESTONES SECTION */}
      <MotionWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card.Card>
          <Card.CardHeader>
            <Card.CardTitle>Milestones</Card.CardTitle>
            <Card.CardDescription>Define key checkpoints for your ambition</Card.CardDescription>
          </Card.CardHeader>
          <Card.CardContent>
            <div className="space-y-4">
              <div className="space-y-4 flex flex-col">
                <div className="space-y-2">
                  <Label htmlFor="milestone-name">Milestone Name</Label>
                  <Input
                    id="milestone-name"
                    placeholder="Enter milestone name..."
                    value={newMilestone.milestone}
                    onChange={(e) =>
                      setNewMilestone({
                        ...newMilestone,
                        milestone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="milestone-description">
                    Milestone Description{" "}
                    <span className="text-xs/tight text-muted-foreground">(optional)</span>
                  </Label>
                  <Textarea
                    id="milestone-description"
                    placeholder="Describe what this milestone represents..."
                    value={newMilestone.milestoneDescription || ""}
                    onChange={(e) =>
                      setNewMilestone({
                        ...newMilestone,
                        milestoneDescription: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Target Date</Label>
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
                        {newMilestone.milestoneTargetDate ? (
                          format(newMilestone.milestoneTargetDate, "PPP")
                        ) : (
                          <span>Select a target date</span>
                        )}
                      </Button>
                    </Popover.PopoverTrigger>
                    <Popover.PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newMilestone.milestoneTargetDate}
                        onSelect={(date) =>
                          date &&
                          setNewMilestone({
                            ...newMilestone,
                            milestoneTargetDate: date,
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
                <div className="flex items-center justify-start space-x-2">
                  <Checkbox
                    id="add-milestone-completed"
                    checked={newMilestone.milestoneCompleted || false}
                    onCheckedChange={(checked) =>
                      setNewMilestone({
                        ...newMilestone,
                        milestoneCompleted: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="add-milestone-completed" className="font-medium">
                    Mark as completed
                  </Label>
                </div>
                <Button onClick={addMilestone} type="button" className="self-end">
                  <IconPlus className="h-4 w-4 mr-1" /> Add Milestone
                </Button>
              </div>

              <div className="relative mt-6">
                {/* Timeline line */}
                <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-border"></div>

                {/* Milestones */}
                <div className="space-y-8">
                  {props.formState.milestones.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      <IconAward className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <div>
                        <p>No milestones added yet</p>
                        <p className="text-sm">Add some milestones to get started</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {props.formState.milestones.map((milestone, index) => (
                        <div key={index} className="relative pl-10 hover:bg-muted p-4 rounded-md">
                          <div
                            className={`absolute left-px h-5 w-5 rounded-full bg-background flex items-center justify-center`}
                          >
                            {milestone.milestoneCompleted ? (
                              <IconCircleCheck className="text-lime-500 rounded-full" />
                            ) : (
                              <IconCircle className="text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-start justify-between">
                              <h4 className="text-base font-medium">{milestone.milestone}</h4>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="rounded-full h-6 w-6 p-0"
                                onClick={() => removeMilestone(index)}
                              >
                                <IconX className="h-4 w-4" />
                                <span className="sr-only">Remove milestone</span>
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {milestone.milestoneDescription}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Target Date: {format(milestone.milestoneTargetDate, "PPP")}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`milestone-${index}`}
                                  checked={milestone.milestoneCompleted ?? false}
                                  onCheckedChange={() => toggleMilestoneCompletion(index)}
                                />
                                <Label
                                  htmlFor={`milestone-${index}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {milestone.milestoneCompleted ? "Completed" : "Not completed"}
                                </Label>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card.CardContent>
        </Card.Card>
      </MotionWrapper>

      <MotionWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card.Card className="opacity-50 pointer-events-none">
          <Card.CardHeader>
            <Card.CardTitle>Initial Tasks</Card.CardTitle>
            <Card.CardDescription>
              Switch to Task Based tracking from the first tab of this page to add tasks
            </Card.CardDescription>
          </Card.CardHeader>
        </Card.Card>
      </MotionWrapper>
    </>
  );
}
