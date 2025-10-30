import { db } from "@/src/db";
import { ambitions, tasks, milestones } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";
import { Ambition, NewAmbition, Task, Milestone } from "@/src/db/schema";

export class AmbitionsService {
  /**
   * Fetch all active ambitions for a user
   */
  static async fetchActiveAmbitions(userId: string): Promise<Ambition[]> {
    try {
      const result = await db
        .select()
        .from(ambitions)
        .where(and(eq(ambitions.userId, userId), eq(ambitions.ambitionStatus, "active")));

      return result;
    } catch (error) {
      console.error("Error fetching active ambitions:", error);
      throw new Error("Failed to fetch active ambitions");
    }
  }

  /**
   * Fetch a specific ambition by ID
   */
  static async fetchAmbitionById(ambitionId: string, userId: string): Promise<Ambition | null> {
    try {
      const result = await db
        .select()
        .from(ambitions)
        .where(and(eq(ambitions.id, ambitionId), eq(ambitions.userId, userId)))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      console.error("Error fetching ambition:", error);
      throw new Error("Failed to fetch ambition");
    }
  }

  /**
   * Create a new ambition
   */
  static async createAmbition(ambitionData: NewAmbition): Promise<Ambition> {
    try {
      const result = await db
        .insert(ambitions)
        .values(ambitionData)
        .returning();

      return result[0];
    } catch (error) {
      console.error("Error creating ambition:", error);
      throw new Error("Failed to create ambition");
    }
  }

  /**
   * Update an existing ambition
   */
  static async updateAmbition(ambitionId: string, userId: string, updates: Partial<NewAmbition>): Promise<Ambition | null> {
    try {
      const result = await db
        .update(ambitions)
        .set({ ...updates, updatedAt: new Date() })
        .where(and(eq(ambitions.id, ambitionId), eq(ambitions.userId, userId)))
        .returning();

      return result[0] || null;
    } catch (error) {
      console.error("Error updating ambition:", error);
      throw new Error("Failed to update ambition");
    }
  }

  /**
   * Delete an ambition
   */
  static async deleteAmbition(ambitionId: string, userId: string): Promise<boolean> {
    try {
      const result = await db
        .delete(ambitions)
        .where(and(eq(ambitions.id, ambitionId), eq(ambitions.userId, userId)))
        .returning({ id: ambitions.id });

      return result.length > 0;
    } catch (error) {
      console.error("Error deleting ambition:", error);
      throw new Error("Failed to delete ambition");
    }
  }

  /**
   * Get tasks for a specific ambition
   */
  static async getAmbitionTasks(ambitionId: string, userId: string): Promise<Task[]> {
    try {
      const result = await db
        .select()
        .from(tasks)
        .where(and(eq(tasks.ambitionId, ambitionId), eq(tasks.userId, userId)));

      return result;
    } catch (error) {
      console.error("Error fetching ambition tasks:", error);
      throw new Error("Failed to fetch ambition tasks");
    }
  }

  /**
   * Get milestones for a specific ambition
   */
  static async getAmbitionMilestones(ambitionId: string, userId: string): Promise<Milestone[]> {
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
}