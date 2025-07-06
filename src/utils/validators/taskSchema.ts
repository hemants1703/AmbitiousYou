import z from "zod";

// Schema for task validation
const taskSchema = z.object({
  task: z.string().min(1, "Task name is required"),
  taskDescription: z.string().optional(),
  taskDeadline: z.string().min(1, "Task deadline is required"),
});

export default taskSchema;