"use server";

import { db } from "@/db";
import { ambitions, NewTask, tasks } from "@/db/schema";
import confirmSession from "@/lib/auth/confirmSession";
import { and, eq, not } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { editTaskValidationSchema } from "./validation";

export interface EditTaskFormActionState extends Partial<NewTask> {
  errors?: Record<string, string[]>;
  success?: boolean;
  error?: string
}

export async function editTask(_: EditTaskFormActionState, formData: FormData): Promise<EditTaskFormActionState> {
  const session = await confirmSession();

  const submittedFormData = {
    id: formData.get("id") as string,
    ambitionId: formData.get("ambitionId") as string,
    task: formData.get("task") as string,
    taskDescription: formData.get("taskDescription") as string | null,
    taskDeadline: formData.get("taskDeadline")
      ? new Date(formData.get("taskDeadline") as string)
      : undefined,
  };

  if (!session) {
    return {
      errors: { general: ["Unauthorized"] },
      ...submittedFormData,
    };
  }

  const validatedData = editTaskValidationSchema.safeParse(submittedFormData);

  if (!validatedData.success) {
    return {
      errors: z.flattenError(validatedData.error).fieldErrors,
      ...submittedFormData,
    };
  }

  const updatedTask = await db
    .update(tasks)
    .set({
      task: validatedData.data.task,
      taskDescription: validatedData.data.taskDescription,
      taskDeadline: validatedData.data.taskDeadline,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(tasks.userId, session.user.id),
        eq(tasks.id, validatedData.data.id),
        eq(tasks.ambitionId, validatedData.data.ambitionId)
      )
    );

  if (!updatedTask) {
    return {
      errors: { general: ["Failed to update task"] },
      ...submittedFormData,
    };
  }

  revalidatePath(`/ambitions/${validatedData.data.ambitionId}`);
  return {
    success: true,
    ...submittedFormData,
  };
}

export async function toggleTask(taskId: string): Promise<Partial<EditTaskFormActionState>> {
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