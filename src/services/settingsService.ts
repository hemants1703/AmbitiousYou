import { db } from "@/db";
import { settings, Settings } from "@/db/schema";
import { eq } from "drizzle-orm";

export class SettingsService {
  async getUserSettings(userId: string): Promise<Settings | Error> {
    return new Promise(async (resolve, reject) => {
      const result = await db.select().from(settings).where(eq(settings.userId, userId)).limit(1);

      if (result.length === 0) {
        reject(new Error("Settings not found"));
      }

      resolve(result[0]);
    });
  }
}
