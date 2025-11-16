import z from "zod";

export const createNewNoteValidationSchema = z.object({
  ambitionId: z.string().min(1, { message: "Ambition ID is required" }),
  note: z.string().min(1, { message: "Note is required" }),
});

export type CreateNewNoteValidationSchema = z.infer<typeof createNewNoteValidationSchema>;
