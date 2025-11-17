"use server";

import { db } from "@/db";
import { NewTask, tasks } from "@/db/schema";
import confirmSession from "@/lib/auth/confirmSession";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { editTaskValidationSchema } from "./validation";

export interface EditTaskFormActionState extends Partial<NewTask> {
  errors?: Record<string, string[]>;
  success?: boolean;
}

export async function editTask(
  _: EditTaskFormActionState,
  formData: FormData
): Promise<EditTaskFormActionState> {
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
