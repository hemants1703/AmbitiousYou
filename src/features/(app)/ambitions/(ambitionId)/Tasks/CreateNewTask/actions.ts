"use server";

import { db } from "@/db";
import { NewTask, tasks } from "@/db/schema";
import confirmSession from "@/lib/auth/confirmSession";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createNewTaskValidationSchema } from "./validation";

export interface CreateNewTaskFormActionState extends Partial<NewTask> {
  errors?: Record<string, string[]>;
  success?: boolean;
}

export async function createNewTask(_: CreateNewTaskFormActionState, formData: FormData): Promise<CreateNewTaskFormActionState> {
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
