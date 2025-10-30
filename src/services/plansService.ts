import { db } from "@/src/db";
import { plans } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { Plan, NewPlan } from "@/src/db/schema";

export class PlansService {
  /**
   * Fetch plan for a user
   */
  static async fetchUserPlan(userId: string): Promise<Plan | null> {
    try {
      const result = await db
        .select()
        .from(plans)
        .where(eq(plans.userId, userId))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      console.error("Error fetching user plan:", error);
      throw new Error("Failed to fetch user plan");
    }
  }

  /**
   * Create a new plan
   */
  static async createPlan(planData: NewPlan): Promise<Plan> {
    try {
      const result = await db
        .insert(plans)
        .values(planData)
        .returning();

      return result[0];
    } catch (error) {
      console.error("Error creating plan:", error);
      throw new Error("Failed to create plan");
    }
  }

  /**
   * Update an existing plan
   */
  static async updatePlan(userId: string, updates: Partial<NewPlan>): Promise<Plan | null> {
    try {
      const result = await db
        .update(plans)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(plans.userId, userId))
        .returning();

      return result[0] || null;
    } catch (error) {
      console.error("Error updating plan:", error);
      throw new Error("Failed to update plan");
    }
  }

  /**
   * Delete a plan
   */
  static async deletePlan(userId: string): Promise<boolean> {
    try {
      const result = await db
        .delete(plans)
        .where(eq(plans.userId, userId))
        .returning({ id: plans.id });

      return result.length > 0;
    } catch (error) {
      console.error("Error deleting plan:", error);
      throw new Error("Failed to delete plan");
    }
  }
}