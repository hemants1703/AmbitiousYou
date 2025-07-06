import z from "zod";

// Schema for milestone validation
const milestoneSchema = z.object({
  milestone: z.string().min(1, "Milestone name is required"),
  milestoneDescription: z.string().optional(),
  milestoneCompleted: z.boolean().default(false),
  milestoneTargetDate: z.string().min(1, "Milestone target date is required"),
});

export default milestoneSchema;