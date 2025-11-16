import z from "zod";

export const createMilestoneValidationSchema = z.object({
  ambitionId: z.string().min(1, "Ambition ID is required"),
  milestone: z.string().min(1, "Milestone name is required"),
  milestoneDescription: z.string().optional(),
  milestoneTargetDate: z.date(),
});

export type CreateMilestoneValidationSchema = z.infer<typeof createMilestoneValidationSchema>;
