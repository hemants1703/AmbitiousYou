import z from "zod";

export const notificationSettingsSchema = z.object({
  emailAccountActivity: z.boolean().optional(),
  pushAmbitionReminders: z.boolean().optional(),
});

export type UpdateNotificationSettingsInput = z.infer<typeof notificationSettingsSchema>;
