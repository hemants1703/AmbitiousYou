import z from "zod";

// Validation schema for ambition creation
export const ambitionValidationSchema = z.object({
  ambitionName: z.string().min(1, { message: "Ambition name is required" }),
  ambitionDefinition: z.string().optional(),
  ambitionPriority: z.enum(["high", "medium", "low"], { message: "Ambition priority is required" }),
  ambitionStartDate: z.date({ message: "Ambition start date is required" }),
  ambitionEndDate: z.date({ message: "Ambition end date is required" }),
  ambitionColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, { message: "Ambition color must be a valid hex code" }),
  ambitionTrackingMethod: z.enum(["task", "milestone"], {
    message: "Ambition tracking method is required",
  }),
});

export type AmbitionValidationSchema = z.infer<typeof ambitionValidationSchema>;
