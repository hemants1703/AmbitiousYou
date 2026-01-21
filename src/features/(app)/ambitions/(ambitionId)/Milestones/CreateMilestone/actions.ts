"use server";

import { db } from "@/db";
import { milestones, NewMilestone } from "@/db/schema";
import confirmSession from "@/lib/auth/confirmSession";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createMilestoneValidationSchema } from "./validations";

export interface CreateNewMilestoneActionState extends Partial<NewMilestone> {
  errors?: Record<string, string[]>;
  success?: boolean;
}

export async function createNewMilestone(
  _: CreateNewMilestoneActionState,
  formData: FormData
): Promise<CreateNewMilestoneActionState> {
  const session = await confirmSession();

  const submittedFormData = {
    ambitionId: formData.get("ambitionId") as string,
    milestone: formData.get("milestone") as string,
    milestoneDescription: formData.get("milestoneDescription") as string,
    milestoneTargetDate: new Date(formData.get("milestoneTargetDate") as string),
  };

  if (!session) {
    return {
      errors: { general: ["Unauthorized"] },
      ...submittedFormData,
    };
  }

  const validatedData = createMilestoneValidationSchema.safeParse(submittedFormData);

  if (!validatedData.success) {
    return {
      errors: z.flattenError(validatedData.error).fieldErrors,
      ...submittedFormData,
    };
  }

  const insertMilestone = await db.insert(milestones).values({
    userId: session.user.id,
    ambitionId: validatedData.data.ambitionId,
    milestone: validatedData.data.milestone,
    milestoneDescription: validatedData.data.milestoneDescription,
    milestoneTargetDate: new Date(validatedData.data.milestoneTargetDate),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  if (!insertMilestone) {
    return {
      errors: { general: ["Failed to create milestone"] },
      ...submittedFormData,
    };
  }

  revalidatePath(`/ambitions/${validatedData.data.ambitionId}`);
  return {
    success: true,
    ...submittedFormData,
  };
}
