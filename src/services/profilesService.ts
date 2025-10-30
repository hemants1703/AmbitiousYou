import { db } from "@/src/db";
import { profiles } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { Profile, NewProfile } from "@/src/db/schema";

export class ProfilesService {
  /**
   * Fetch profile for a user
   */
  static async fetchUserProfile(userId: string): Promise<Profile | null> {
    try {
      const result = await db
        .select()
        .from(profiles)
        .where(eq(profiles.userId, userId))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw new Error("Failed to fetch user profile");
    }
  }

  /**
   * Create a new profile
   */
  static async createProfile(profileData: NewProfile): Promise<Profile> {
    try {
      const result = await db
        .insert(profiles)
        .values(profileData)
        .returning();

      return result[0];
    } catch (error) {
      console.error("Error creating profile:", error);
      throw new Error("Failed to create profile");
    }
  }

  /**
   * Update an existing profile
   */
  static async updateProfile(userId: string, updates: Partial<NewProfile>): Promise<Profile | null> {
    try {
      const result = await db
        .update(profiles)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(profiles.userId, userId))
        .returning();

      return result[0] || null;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw new Error("Failed to update profile");
    }
  }

  /**
   * Delete a profile
   */
  static async deleteProfile(userId: string): Promise<boolean> {
    try {
      const result = await db
        .delete(profiles)
        .where(eq(profiles.userId, userId))
        .returning({ id: profiles.id });

      return result.length > 0;
    } catch (error) {
      console.error("Error deleting profile:", error);
      throw new Error("Failed to delete profile");
    }
  }
}