import z from "zod";

export const editAmbitionDetailsSchema = z.object({
    userId: z.string().min(1),
    ambitionId: z.string().min(1),
    ambitionName: z.string().min(1),
    ambitionDefinition: z.string().min(0)
});