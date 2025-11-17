import z from "zod";

export const editTaskValidationSchema = z.object({
  id: z.string().min(1, "Task ID is required"),
  ambitionId: z.string().min(1, "Ambition ID is required"),
  task: z.string().min(1, "Task is required"),
  taskDescription: z.string().optional(),
  taskDeadline: z.date({ message: "Task deadline is required" }),
});
