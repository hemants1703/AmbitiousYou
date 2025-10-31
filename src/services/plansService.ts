import { db } from "@/db";
import { plans } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Plan, NewPlan } from "@/types/globals";

export class PlansService {
    /**
     * Fetch plan for a user
     */
    async fetchUserPlan(userId: string): Promise<Plan | Error> {
        try {
            const result = await db
                .select()
                .from(plans)
                .where(eq(plans.userId, userId))
                .limit(1);

            if (result.length === 0) {
                return new Error("Plan not found");
            }

            return result[0];
        } catch (error) {
            return new Error(`Failed to fetch plan: ${error}`);
        }
    }

    /**
     * Create a new plan
     */
    async createPlan(planData: NewPlan): Promise<Plan | Error> {
        try {
            const result = await db
                .insert(plans)
                .values(planData)
                .returning();

            return result[0];
        } catch (error) {
            return new Error(`Failed to create plan: ${error}`);
        }
    }

    /**
     * Update a plan
     */
    async updatePlan(userId: string, updates: Partial<NewPlan>): Promise<Plan | Error> {
        try {
            const result = await db
                .update(plans)
                .set({ ...updates, updatedAt: new Date() })
                .where(eq(plans.userId, userId))
                .returning();

            if (result.length === 0) {
                return new Error("Plan not found");
            }

            return result[0];
        } catch (error) {
            return new Error(`Failed to update plan: ${error}`);
        }
    }

    /**
     * Delete a plan
     */
    async deletePlan(userId: string): Promise<boolean | Error> {
        try {
            const result = await db
                .delete(plans)
                .where(eq(plans.userId, userId))
                .returning({ id: plans.id });

            if (result.length === 0) {
                return new Error("Plan not found");
            }

            return true;
        } catch (error) {
            return new Error(`Failed to delete plan: ${error}`);
        }
    }
}
