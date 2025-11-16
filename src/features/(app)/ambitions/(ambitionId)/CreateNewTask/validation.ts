import { z } from "zod";

export const createNewTaskValidationSchema = z.object({
  ambitionId: z.string().min(1, { message: "Ambition ID is required" }),
  task: z.string().min(1, { message: "Task is required" }),
  taskDescription: z.string().optional(),
  taskDeadline: z.date({ message: "Task deadline is required" }),
});

export type CreateNewTaskValidationSchema = z.infer<typeof createNewTaskValidationSchema>;
