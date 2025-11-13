"use server";

import { db } from "@/db";
import { ambitions, milestones, tasks, user } from "@/db/schema";
import confirmSession from "@/lib/auth/confirmSession";
import { revalidatePath } from "next/cache";
import { and, eq, not } from "drizzle-orm";

export async function favouriteAmbitionAction(
  ambitionId: string,
  favouriteValue: boolean
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Get current authenticated user
    const session = await confirmSession();

    if (!session) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Update ambition's favourite status
    const [updatedAmbition] = await db
      .update(ambitions)
      .set({ isFavourited: favouriteValue })
      .where(and(eq(ambitions.id, ambitionId), eq(ambitions.userId, session.user.id)))
      .returning();

    if (!updatedAmbition) {
      throw new Error("Ambition not found or you don't have permission to update it");
    }

    revalidatePath("/ambitions");

    return { success: true };
  } catch (error) {
    console.error("Error updating ambition:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update ambition",
    };
  }
}

export async function markMilestoneAsCompletedAction(milestoneId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await confirmSession();

  if (!session) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const updateMilestoneResponse = await db
    .update(milestones)
    .set({ milestoneCompleted: true })
    .where(and(eq(milestones.id, milestoneId), eq(milestones.userId, session.user.id)))
    .returning();

  if (!updateMilestoneResponse) {
    return {
      success: false,
      error: "Milestone not found or you don't have permission to update it",
    };
  }

  const milestoresForAmbition = await db
    .select()
    .from(milestones)
    .where(
      and(
        eq(milestones.userId, session.user.id),
        eq(milestones.ambitionId, updateMilestoneResponse[0].ambitionId)
      )
    );

  const incompleteMilestonesForAmbition = milestoresForAmbition.filter(
    (milestone) => !milestone.milestoneCompleted
  );

  if (incompleteMilestonesForAmbition.length === 0) {
    await db
      .update(ambitions)
      .set({
        ambitionStatus: "completed",
      })
      .where(
        and(
          eq(ambitions.userId, session.user.id),
          eq(ambitions.id, updateMilestoneResponse[0].ambitionId)
        )
      );
  } else {
    await db
      .update(ambitions)
      .set({
        ambitionStatus: "active",
      })
      .where(
        and(
          eq(ambitions.userId, session.user.id),
          eq(ambitions.id, updateMilestoneResponse[0].ambitionId)
        )
      );
  }

  revalidatePath(`/ambitions/${updateMilestoneResponse[0].ambitionId}`);
  return {
    success: true,
  };
}

export async function toggleTask(taskId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await confirmSession();

  if (!session) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const updateTaskResponse = await db
    .update(tasks)
    .set({ taskCompleted: not(tasks.taskCompleted) })
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, session.user.id)))
    .returning();

  if (!updateTaskResponse) {
    return {
      success: false,
      error: "Task not found or you don't have permission to update it",
    };
  }

  const tasksForAmbition = await db
    .select()
    .from(tasks)
    .where(
      and(eq(tasks.userId, session.user.id), eq(tasks.ambitionId, updateTaskResponse[0].ambitionId))
    );

  const incompleteTasksForAmbition = tasksForAmbition.filter((task) => !task.taskCompleted);

  if (incompleteTasksForAmbition.length === 0) {
    await db
      .update(ambitions)
      .set({
        ambitionStatus: "completed",
      })
      .where(
        and(
          eq(ambitions.userId, session.user.id),
          eq(ambitions.id, updateTaskResponse[0].ambitionId)
        )
      );
  } else {
    await db
      .update(ambitions)
      .set({
        ambitionStatus: "active",
      })
      .where(
        and(
          eq(ambitions.userId, session.user.id),
          eq(ambitions.id, updateTaskResponse[0].ambitionId)
        )
      );
  }

  // if (updateTaskResponse[0].task)

  revalidatePath(`/ambitions/${updateTaskResponse[0].ambitionId}`);
  return {
    success: true,
  };
}
