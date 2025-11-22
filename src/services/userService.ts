import { db } from "@/db";
import { NewUser, user, type User } from "@/db/schema";
import { eq } from "drizzle-orm";

export class UserService {
  /**
   * Fetch user for userId
   */
  async fetchUserById(userId: string): Promise<User | Error> {
    return new Promise(async (resolve, reject) => {
      const result = await db.select().from(user).where(eq(user.id, userId)).limit(1);

      if (result.length === 0) {
        reject(new Error("Usernot found"));
      }

      resolve(result[0]);
    });
  }

  /**
   * Create a new profile
   */
  async createUser(userData: NewUser): Promise<User | Error> {
    return new Promise(async (resolve, reject) => {
      const result = await db.insert(user).values(userData).returning();

      if (result.length === 0) {
        reject(new Error("User not created"));
      }

      resolve(result[0]);
    });
  }

  /**
   * Update a profile
   */
  async updateProfile(userId: string, updates: Partial<NewUser>): Promise<User | Error> {
    return new Promise(async (resolve, reject) => {
      const result = await db
        .update(user)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(user.id, userId))
        .returning();

      if (result.length === 0) {
        reject(new Error("Usernot found"));
      }

      resolve(result[0]);
    });
  }

  /**
   * Delete a profile
   */
  async deleteUser(userId: string): Promise<User | Error> {
    return new Promise(async (resolve, reject) => {
      const result = await db.delete(user).where(eq(user.id, userId)).returning();

      if (result.length === 0) {
        reject(new Error("Usernot found"));
      }

      resolve(result[0]);
    });
  }
}
