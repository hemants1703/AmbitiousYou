"use server";

import confirmSession from "@/lib/auth/confirmSession";
import { createNewTaskValidationSchema } from "./validation";
import { z } from "zod";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { revalidatePath } from "next/cache";

export interface CreateNewTaskFormActionState {
  errors?: Record<string, string[]>;
  success?: boolean;

  ambitionId: string;
  task: string;
  taskDescription: string;
  taskDeadline: Date;
}

export async function createNewTask(
  _: CreateNewTaskFormActionState,
  formData: FormData
): Promise<CreateNewTaskFormActionState> {
  const session = await confirmSession();

  const submittedFormData = {
    ambitionId: formData.get("ambitionId") as string,
    task: formData.get("task") as string,
    taskDescription: formData.get("taskDescription") as string,
    taskDeadline: new Date(formData.get("taskDeadline") as string),
  };

  if (!session) {
    return {
      errors: { general: ["Unauthorized"] },
      ...submittedFormData,
    };
  }

  const validatedData = createNewTaskValidationSchema.safeParse(submittedFormData);

  if (!validatedData.success) {
    return {
      errors: z.flattenError(validatedData.error).fieldErrors,
      ...submittedFormData,
    };
  }

  const insertTask = await db.insert(tasks).values({
    userId: session.user.id,
    ambitionId: validatedData.data.ambitionId,
    task: validatedData.data.task,
    taskDescription: validatedData.data.taskDescription,
    taskDeadline: validatedData.data.taskDeadline,
  });

  if (!insertTask) {
    return {
      errors: { general: ["Failed to create task"] },
      ...submittedFormData,
    };
  }

  revalidatePath(`/ambitions/${validatedData.data.ambitionId}`);
  return {
    success: true,
    ...submittedFormData,
  };
}
