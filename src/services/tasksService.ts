import { db } from "@/src/db";
import { tasks } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";
import { Task, NewTask } from "@/src/db/schema";

export class TasksService {
  /**
   * Fetch all tasks for a user
   */
  static async fetchUserTasks(userId: string): Promise<Task[]> {
    try {
      const result = await db
        .select()
        .from(tasks)
        .where(eq(tasks.userId, userId));

      return result;
    } catch (error) {
      console.error("Error fetching user tasks:", error);
      throw new Error("Failed to fetch user tasks");
    }
  }

  /**
   * Fetch tasks for a specific ambition
   */
  static async fetchAmbitionTasks(ambitionId: string, userId: string): Promise<Task[]> {
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
   * Create a new task
   */
  static async createTask(taskData: NewTask): Promise<Task> {
    try {
      const result = await db
        .insert(tasks)
        .values(taskData)
        .returning();

      return result[0];
    } catch (error) {
      console.error("Error creating task:", error);
      throw new Error("Failed to create task");
    }
  }

  /**
   * Update an existing task
   */
  static async updateTask(taskId: string, userId: string, updates: Partial<NewTask>): Promise<Task | null> {
    try {
      const result = await db
        .update(tasks)
        .set({ ...updates, updatedAt: new Date() })
        .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
        .returning();

      return result[0] || null;
    } catch (error) {
      console.error("Error updating task:", error);
      throw new Error("Failed to update task");
    }
  }

  /**
   * Delete a task
   */
  static async deleteTask(taskId: string, userId: string): Promise<boolean> {
    try {
      const result = await db
        .delete(tasks)
        .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
        .returning({ id: tasks.id });

      return result.length > 0;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw new Error("Failed to delete task");
    }
  }

  /**
   * Toggle task completion status
   */
  static async toggleTaskCompletion(taskId: string, userId: string): Promise<Task | null> {
    try {
      // First get the current task
      const currentTask = await db
        .select()
        .from(tasks)
        .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
        .limit(1);

      if (!currentTask[0]) {
        return null;
      }

      // Toggle the completion status
      const result = await db
        .update(tasks)
        .set({
          taskCompleted: !currentTask[0].taskCompleted,
          updatedAt: new Date()
        })
        .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
        .returning();

      return result[0] || null;
    } catch (error) {
      console.error("Error toggling task completion:", error);
      throw new Error("Failed to toggle task completion");
    }
  }
}