"use server";

import { z } from "zod";
import { db } from "@/db";
import { ambitions, tasks as tasksTable, milestones as milestonesTable } from "@/db/schema";
import { ambitionValidationSchema } from "@/features/(app)/ambitions/CreateNewAmbition/validation";
import taskSchema from "@/utils/validators/taskSchema";
import milestoneSchema from "@/utils/validators/milestoneSchema";
import confirmSession from "@/lib/auth/confirmSession";
import { revalidatePath } from "next/cache";

// Form-specific types without database fields
export interface FormTask {
  task: string;
  taskDescription?: string;
  taskDeadline: Date | string;
}

export interface FormMilestone {
  milestone: string;
  milestoneDescription?: string;
  milestoneTargetDate: Date | string;
  milestoneCompleted?: boolean;
}

export interface CreateNewAmbitionFormActionState {
  errors?: Record<string, string[]>;
  success?: boolean;

  ambitionName: string;
  ambitionDefinition: string;
  ambitionPriority: "high" | "medium" | "low";
  ambitionStartDate: string | Date;
  ambitionEndDate: string | Date;
  ambitionColor: string;
  ambitionTrackingMethod: "task" | "milestone";
  tasks: FormTask[];
  milestones: FormMilestone[];
}

export async function createNewAmbition(
  _: CreateNewAmbitionFormActionState,
  formData: FormData
): Promise<CreateNewAmbitionFormActionState> {
  const session = await confirmSession();

  const submittedFormData = {
    ambitionName: formData.get("ambitionName") as string,
    ambitionDefinition: (formData.get("ambitionDefinition") as string) || "",
    ambitionPriority: formData.get("ambitionPriority") as "high" | "medium" | "low",
    ambitionStartDate: new Date(formData.get("ambitionStartDate") as string),
    ambitionEndDate: new Date(formData.get("ambitionEndDate") as string),
    ambitionColor: formData.get("ambitionColor") as string,
    ambitionTrackingMethod: formData.get("ambitionTrackingMethod") as "task" | "milestone",
    tasks: [],
    milestones: [],
  };

  if (!session) {
    return {
      errors: { general: ["Unauthorized"] },
      ...submittedFormData,
    };
  }

  if (submittedFormData.ambitionTrackingMethod === "task") {
    submittedFormData.tasks = JSON.parse(formData.get("tasks") as string);
  } else {
    submittedFormData.milestones = JSON.parse(formData.get("milestones") as string);
  }

  const validatedData = ambitionValidationSchema.safeParse(submittedFormData);

  if (!validatedData.success) {
    return {
      errors: z.flattenError(validatedData.error).fieldErrors,
      ...submittedFormData,
    };
  }

  try {
    // Use transaction to ensure atomicity
    const createdAmbition = await db.transaction(async (tx) => {
      // Insert ambition and get its ID
      const [insertedAmbition] = await tx
        .insert(ambitions)
        .values({
          userId: session.user.id,
          ...validatedData.data,
        })
        .returning();

      if (!insertedAmbition) {
        throw new Error("Failed to create ambition");
      }

      // Handle tasks or milestones based on tracking method
      if (validatedData.data.ambitionTrackingMethod === "task") {
        const tasks = JSON.parse(formData.get("tasks") as string);
        if (!Array.isArray(tasks)) {
          throw new Error("Invalid tasks format");
        }

        // Validate each task
        const validatedTasks = tasks.map((task) => taskSchema.parse(task));

        if (validatedTasks.length > 0) {
          // Prepare tasks for insertion
          const tasksToInsert = validatedTasks.map((task) => ({
            userId: session.user.id,
            ambitionId: insertedAmbition.id,
            task: task.task,
            taskDescription: task.taskDescription || null,
            taskCompleted: false,
            taskDeadline: new Date(task.taskDeadline),
          }));

          // Insert tasks
          await tx.insert(tasksTable).values(tasksToInsert);
        }
      } else if (validatedData.data.ambitionTrackingMethod === "milestone") {
        const milestones = JSON.parse(formData.get("milestones") as string);
        if (!Array.isArray(milestones)) {
          throw new Error("Invalid milestones format");
        }

        // Validate each milestone
        const validatedMilestones = milestones.map((milestone) => milestoneSchema.parse(milestone));

        if (validatedMilestones.length > 0) {
          // Prepare milestones for insertion
          const milestonesToInsert = validatedMilestones.map((milestone) => ({
            userId: session.user.id,
            ambitionId: insertedAmbition.id,
            milestone: milestone.milestone,
            milestoneDescription: milestone.milestoneDescription || null,
            milestoneCompleted: milestone.milestoneCompleted || false,
            milestoneTargetDate: new Date(milestone.milestoneTargetDate),
          }));

          // Insert milestones
          await tx.insert(milestonesTable).values(milestonesToInsert);
        }
      }

      return insertedAmbition;
    });

    revalidatePath("/ambitions");
    return {
      success: true,
      ambitionName: "",
      ambitionDefinition: "",
      ambitionPriority: "medium",
      ambitionStartDate: "",
      ambitionEndDate: "",
      ambitionColor: "",
      ambitionTrackingMethod: "task",
      tasks: [],
      milestones: [],
    };
  } catch (error) {
    console.error("Failed to create ambition:", error);
    if (error instanceof z.ZodError) {
      return { errors: z.flattenError(error).fieldErrors, ...submittedFormData };
    }
    return {
      errors: { general: [(error as Error).message || "Failed to create ambition"] },
      ...submittedFormData,
    };
  }
}
