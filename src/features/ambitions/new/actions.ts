"use server";

import { z } from "zod";
import { db } from "@/db";
import { ambitions, tasks as tasksTable, milestones as milestonesTable } from "@/db/schema";
import ambitionSchema from "@/utils/validators/ambitionSchema";
import taskSchema from "@/utils/validators/taskSchema";
import milestoneSchema from "@/utils/validators/milestoneSchema";
import confirmSession from "@/lib/auth/confirmSession";
import { revalidatePath } from "next/cache";

export async function createNewAmbition(formData: FormData) {
  try {
    // Get current authenticated user
    const { user } = await confirmSession();

    if (!user) {
      throw new Error("Unauthorized");
    }

    // Parse and validate form data
    const rawData = {
      ambitionName: formData.get("ambitionName") as string,
      ambitionDefinition: formData.get("ambitionDefinition") as string,
      ambitionPriority: formData.get("ambitionPriority") as "high" | "medium" | "low",
      ambitionStartDate: formData.get("ambitionStartDate") as string,
      ambitionEndDate: formData.get("ambitionEndDate") as string,
      ambitionCompletionDate: formData.get("ambitionCompletionDate") || ("" as string),
      ambitionColor: formData.get("ambitionColor") as string,
      ambitionTrackingMethod: formData.get("ambitionTrackingMethod") as "task" | "milestone",
      isFavourited: formData.get("isFavourited") === "true",
    };

    const validatedData = ambitionSchema.parse(rawData);

    // Prepare data for database insertion
    const ambitionData = {
      userId: user.id,
      ambitionName: validatedData.ambitionName,
      ambitionDefinition: validatedData.ambitionDefinition || null,
      ambitionTrackingMethod: validatedData.ambitionTrackingMethod,
      ambitionStartDate: new Date(validatedData.ambitionStartDate),
      ambitionEndDate: new Date(validatedData.ambitionEndDate),
      ambitionCompletionDate: null,
      ambitionStatus: "active" as const,
      ambitionPriority: validatedData.ambitionPriority,
      ambitionPercentageCompleted: 0,
      ambitionColor: validatedData.ambitionColor,
      isFavourited: validatedData.isFavourited,
    };

    // Use transaction to ensure atomicity
    await db.transaction(async (tx) => {
      // Insert ambition and get its ID
      const [insertedAmbition] = await tx.insert(ambitions).values(ambitionData).returning();

      if (!insertedAmbition) {
        throw new Error("Failed to create ambition");
      }

      // Handle tasks or milestones based on tracking method
      if (validatedData.ambitionTrackingMethod === "task") {
        const tasks = JSON.parse(formData.get("tasks") as string);
        if (!Array.isArray(tasks)) {
          throw new Error("Invalid tasks format");
        }

        // Validate each task
        const validatedTasks = tasks.map((task) => taskSchema.parse(task));

        if (validatedTasks.length > 0) {
          // Prepare tasks for insertion
          const tasksToInsert = validatedTasks.map((task) => ({
            userId: user.id,
            ambitionId: insertedAmbition.id,
            task: task.task,
            taskDescription: task.taskDescription || null,
            taskCompleted: false,
            taskDeadline: new Date(task.taskDeadline),
          }));

          // Insert tasks
          await tx.insert(tasksTable).values(tasksToInsert);
        }
      } else if (validatedData.ambitionTrackingMethod === "milestone") {
        const milestones = JSON.parse(formData.get("milestones") as string);
        if (!Array.isArray(milestones)) {
          throw new Error("Invalid milestones format");
        }

        // Validate each milestone
        const validatedMilestones = milestones.map((milestone) => milestoneSchema.parse(milestone));

        if (validatedMilestones.length > 0) {
          // Prepare milestones for insertion
          const milestonesToInsert = validatedMilestones.map((milestone) => ({
            userId: user.id,
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
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: error instanceof Error ? error.message : "Failed to create ambition" };
  }
}
