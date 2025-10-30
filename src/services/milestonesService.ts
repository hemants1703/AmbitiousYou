import { db } from "@/src/db";
import { milestones } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";
import { Milestone, NewMilestone } from "@/src/db/schema";

export class MilestonesService {
  /**
   * Fetch all milestones for a user
   */
  static async fetchUserMilestones(userId: string): Promise<Milestone[]> {
    try {
      const result = await db
        .select()
        .from(milestones)
        .where(eq(milestones.userId, userId));

      return result;
    } catch (error) {
      console.error("Error fetching user milestones:", error);
      throw new Error("Failed to fetch user milestones");
    }
  }

  /**
   * Fetch milestones for a specific ambition
   */
  static async fetchAmbitionMilestones(ambitionId: string, userId: string): Promise<Milestone[]> {
    try {
      const result = await db
        .select()
        .from(milestones)
        .where(and(eq(milestones.ambitionId, ambitionId), eq(milestones.userId, userId)));

      return result;
    } catch (error) {
      console.error("Error fetching ambition milestones:", error);
      throw new Error("Failed to fetch ambition milestones");
    }
  }

  /**
   * Create a new milestone
   */
  static async createMilestone(milestoneData: NewMilestone): Promise<Milestone> {
    try {
      const result = await db
        .insert(milestones)
        .values(milestoneData)
        .returning();

      return result[0];
    } catch (error) {
      console.error("Error creating milestone:", error);
      throw new Error("Failed to create milestone");
    }
  }

  /**
   * Update an existing milestone
   */
  static async updateMilestone(milestoneId: string, userId: string, updates: Partial<NewMilestone>): Promise<Milestone | null> {
    try {
      const result = await db
        .update(milestones)
        .set({ ...updates, updatedAt: new Date() })
        .where(and(eq(milestones.id, milestoneId), eq(milestones.userId, userId)))
        .returning();

      return result[0] || null;
    } catch (error) {
      console.error("Error updating milestone:", error);
      throw new Error("Failed to update milestone");
    }
  }

  /**
   * Delete a milestone
   */
  static async deleteMilestone(milestoneId: string, userId: string): Promise<boolean> {
    try {
      const result = await db
        .delete(milestones)
        .where(and(eq(milestones.id, milestoneId), eq(milestones.userId, userId)))
        .returning({ id: milestones.id });

      return result.length > 0;
    } catch (error) {
      console.error("Error deleting milestone:", error);
      throw new Error("Failed to delete milestone");
    }
  }

  /**
   * Toggle milestone completion status
   */
  static async toggleMilestoneCompletion(milestoneId: string, userId: string): Promise<Milestone | null> {
    try {
      // First get the current milestone
      const currentMilestone = await db
        .select()
        .from(milestones)
        .where(and(eq(milestones.id, milestoneId), eq(milestones.userId, userId)))
        .limit(1);

      if (!currentMilestone[0]) {
        return null;
      }

      // Toggle the completion status
      const result = await db
        .update(milestones)
        .set({
          milestoneCompleted: !currentMilestone[0].milestoneCompleted,
          updatedAt: new Date()
        })
        .where(and(eq(milestones.id, milestoneId), eq(milestones.userId, userId)))
        .returning();

      return result[0] || null;
    } catch (error) {
      console.error("Error toggling milestone completion:", error);
      throw new Error("Failed to toggle milestone completion");
    }
  }
}