"use server";

import { db } from "@/db";
import { Note, notes } from "@/db/schema";
import confirmSession from "@/lib/auth/confirmSession";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";
import { editNoteValidationSchema } from "./validation";

export async function deleteNoteAction(
  noteId: string,
  ambitionId: string
): Promise<{
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

  if (!noteId) {
    return {
      success: false,
      error: "Note ID is required",
    };
  }

  const deletedNote = await db
    .delete(notes)
    .where(
      and(eq(notes.userId, session.user.id), eq(notes.id, noteId), eq(notes.ambitionId, ambitionId))
    );

  if (!deletedNote) {
    return {
      success: false,
      error: "Note not found or you don't have permission to delete it",
    };
  }

  revalidatePath(`/ambitions/${ambitionId}`);
  redirect(`/ambitions/${ambitionId}`);
}

export interface EditNoteFormActionState extends Partial<Note> {
  success?: boolean;
  errors?: Record<string, string[]>;
}

export async function editNoteAction(_: EditNoteFormActionState, formData: FormData): Promise<EditNoteFormActionState> {
  const session = await confirmSession();

  const submittedFormData = {
    id: formData.get("id") as string,
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

  const validatedData = editNoteValidationSchema.safeParse(submittedFormData);

  if (!validatedData.success) {
    return {
      errors: z.flattenError(validatedData.error).fieldErrors,
      ...submittedFormData,
    };
  }

  const updatedNote = await db
    .update(notes)
    .set({
      note: validatedData.data.note,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(notes.userId, session.user.id),
        eq(notes.id, validatedData.data.id),
        eq(notes.ambitionId, validatedData.data.ambitionId)
      )
    );

  if (!updatedNote) {
    return {
      errors: {
        general: ["Failed to update note"],
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
