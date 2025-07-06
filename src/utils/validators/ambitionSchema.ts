import z from "zod";

// Validation schema for ambition creation
const ambitionSchema = z.object({
  ambitionName: z.string().min(1, "Ambition name is required"),
  ambitionDefinition: z.string().default(""),
  ambitionPriority: z.enum(["high", "medium", "low"]),
  ambitionStartDate: z.string().min(1, "Start date is required"),
  ambitionEndDate: z.string().min(1, "End date is required"),
  ambitionCompletionDate: z.string().default(""),
  ambitionColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex code"),
  ambitionTrackingMethod: z.enum(["task", "milestone"]),
  isFavourited: z.boolean().default(false),
});

export default ambitionSchema;