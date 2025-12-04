"use server";

import { db } from "@/db";
import { settings } from "@/db/schema";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getTimezone } from "countries-and-timezones";

// Validate using the same library we use on the client
const timezoneSchema = z
  .string()
  .refine((tz) => getTimezone(tz) !== undefined, { message: "Invalid timezone" });

export async function updateTimezoneAction(timezone: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = timezoneSchema.safeParse(timezone);
  if (!parsed.success) {
    return { success: false, error: "Invalid timezone" };
  }

  try {
    await db
      .update(settings)
      .set({ userTimezone: parsed.data, updatedAt: new Date() })
      .where(eq(settings.userId, session.user.id));

    return { success: true };
  } catch {
    return { success: false, error: "Failed to update timezone" };
  }
}
