import z from "zod";

export const editNoteValidationSchema = z.object({
  id: z.string().min(1, "Note ID is required"),
  ambitionId: z.string().min(1, "Ambition ID is required"),
  note: z.string().min(1, "Note is required"),
});
