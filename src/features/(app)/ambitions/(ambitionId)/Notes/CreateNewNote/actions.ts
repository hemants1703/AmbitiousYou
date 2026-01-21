"use server";

import confirmSession from "@/lib/auth/confirmSession";
import { createNewNoteValidationSchema } from "./validation";
import z from "zod";
import { db } from "@/db";
import { notes } from "@/db/schema";
import { revalidatePath } from "next/cache";

export interface CreateNewNoteFormActionState {
  errors?: Record<string, string[]>;
  success?: boolean;

  ambitionId: string;
  note: string;
}

export async function createNewNote(
  _: CreateNewNoteFormActionState,
  formData: FormData
): Promise<CreateNewNoteFormActionState> {
  const session = await confirmSession();

  const submittedFormData = {
    ambitionId: formData.get("ambitionId") as string,
    note: formData.get("note") as string,
  };

  if (!session) {
    return {
      errors: {
        general: ["Unauthorized"],
      },
      ...submittedFormData,
    };
  }

  const validatedData = createNewNoteValidationSchema.safeParse(submittedFormData);

  if (!validatedData.success) {
    return {
      errors: z.flattenError(validatedData.error).fieldErrors,
      ...submittedFormData,
    };
  }

  const insertNote = await db.insert(notes).values({
    userId: session.user.id,
    ambitionId: validatedData.data.ambitionId,
    note: validatedData.data.note,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  if (!insertNote) {
    return {
      errors: {
        general: ["Failed to create note"],
      },
      ...submittedFormData,
    };
  }

  revalidatePath(`/ambitions/${validatedData.data.ambitionId}`);
  return {
    success: true,
    ...submittedFormData,
  };
}
