import { db } from "@/db";
import { ambitions, tasks, milestones, Note, notes, NewNote } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { Ambition, NewAmbition, Task, NewTask, Milestone, NewMilestone } from "@/db/schema";
import { AmbitionFiltersState } from "@/features/(app)/ambitions/components/AmbitionFilters";

export class AmbitionsService {
  // Fetch all ambitions for a user
  async fetchUserAmbitions(userId: string): Promise<Ambition[] | Error> {
    return new Promise(async (resolve, reject) => {
      const result = await db.select().from(ambitions).where(eq(ambitions.userId, userId));

      if (!result) {
        reject(new Error("Ambitions not found"));
      }

      resolve(result);
    });
  }

  // Fetch a single ambition by ID
  async fetchAmbitionById(ambitionId: string, userId: string): Promise<Ambition | Error> {
    return new Promise(async (resolve, reject) => {
      const result = await db
        .select()
        .from(ambitions)
        .where(and(eq(ambitions.id, ambitionId), eq(ambitions.userId, userId)))
        .limit(1);

      if (!result) {
        reject(new Error("Ambition not found"));
      }

      resolve(result[0]);
    });
  }

  // Fetch ambitions by filters
  async fetchAmbitionsByFilters(
    filters: AmbitionFiltersState,
    userId: string
  ): Promise<Ambition[] | Error> {
    return new Promise(async (resolve, reject) => {
      let allAmbitionsForUser = await db
        .select()
        .from(ambitions)
        .where(eq(ambitions.userId, userId))
        .orderBy(desc(ambitions.createdAt));

      if (!allAmbitionsForUser) {
        reject(new Error("Ambitions not found"));
      }

      if (filters.status) {
        allAmbitionsForUser = allAmbitionsForUser.filter(
          (ambition) => ambition.ambitionStatus === filters.status
        );
      }

      if (filters.priority) {
        allAmbitionsForUser = allAmbitionsForUser.filter(
          (ambition) => ambition.ambitionPriority === filters.priority
        );
      }

      resolve(allAmbitionsForUser);
    });
  }

  // Create a new ambition
  async createAmbition(ambitionData: NewAmbition): Promise<Ambition | Error> {
    return new Promise(async (resolve, reject) => {
      const result = await db.insert(ambitions).values(ambitionData).returning();

      if (!result) {
        reject(new Error("Ambition not created"));
      }

      resolve(result[0]);
    });
  }

  // Update an ambition
  async updateAmbition(
    ambitionId: string,
    userId: string,
    updates: Partial<NewAmbition>
  ): Promise<Ambition | Error> {
    return new Promise(async (resolve, reject) => {
      const result = await db
        .update(ambitions)
        .set({ ...updates, updatedAt: new Date() })
        .where(and(eq(ambitions.id, ambitionId), eq(ambitions.userId, userId)))
        .returning();

      if (!result) {
        reject(new Error("Ambition not found"));
      }

      resolve(result[0]);
    });
  }

  // Delete an ambition
  async deleteAmbition(ambitionId: string, userId: string): Promise<boolean | Error> {
    return new Promise(async (resolve, reject) => {
      const result = await db
        .delete(ambitions)
        .where(and(eq(ambitions.id, ambitionId), eq(ambitions.userId, userId)))
        .returning({ id: ambitions.id });

      if (!result) {
        reject(new Error("Ambition not found"));
      }

      resolve(true);
    });
  }

  // Fetch tasks for an ambition
  async fetchAmbitionTasks(ambitionId: string, userId: string): Promise<Task[] | Error> {
    return new Promise(async (resolve, reject) => {
      const result = await db
        .select()
        .from(tasks)
        .where(and(eq(tasks.ambitionId, ambitionId), eq(tasks.userId, userId)));

      if (!result) {
        reject(new Error("Tasks not found"));
      }

      resolve(result);
    });
  }

  // Create a new task
  async createTask(taskData: NewTask): Promise<Task | Error> {
    return new Promise(async (resolve, reject) => {
      const result = await db.insert(tasks).values(taskData).returning();

      if (!result) {
        reject(new Error("Task not created"));
      }

      resolve(result[0]);
    });
  }

  // Update a task
  async updateTask(
    taskId: string,
    userId: string,
    updates: Partial<NewTask>
  ): Promise<Task | Error> {
    return new Promise(async (resolve, reject) => {
      const result = await db
        .update(tasks)
        .set({ ...updates, updatedAt: new Date() })
        .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
        .returning();

      if (!result) {
        reject(new Error("Task not found"));
      }

      resolve(result[0]);
    });
  }

  // Delete a task
  async deleteTask(taskId: string, userId: string): Promise<boolean | Error> {
    return new Promise(async (resolve, reject) => {
      const result = await db
        .delete(tasks)
        .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
        .returning({ id: tasks.id });

      if (!result) {
        reject(new Error("Task not found"));
      }

      resolve(true);
    });
  }

  // Fetch all tasks for a user
  async fetchUserTasks(userId: string): Promise<Task[] | Error> {
    return new Promise(async (resolve, reject) => {
      const result = await db.select().from(tasks).where(eq(tasks.userId, userId));

      if (!result) {
        reject(new Error("Tasks not found"));
      }

      resolve(result);
    });
  }

  // Fetch all milestones for a user
  async fetchUserMilestones(userId: string): Promise<Milestone[] | Error> {
    return new Promise(async (resolve, reject) => {
      const result = await db.select().from(milestones).where(eq(milestones.userId, userId));

      if (!result) {
        reject(new Error("Milestones not found"));
      }

      resolve(result);
    });
  }

  // Fetch milestones for an ambition
  async fetchAmbitionMilestones(ambitionId: string, userId: string): Promise<Milestone[] | Error> {
    return new Promise(async (resolve, reject) => {
      const result = await db
        .select()
        .from(milestones)
        .where(and(eq(milestones.ambitionId, ambitionId), eq(milestones.userId, userId)));

      if (!result) {
        reject(new Error("Milestones not found"));
      }

      resolve(result);
    });
  }

  // Create a new milestone
  async createMilestone(milestoneData: NewMilestone): Promise<Milestone | Error> {
    return new Promise(async (resolve, reject) => {
      const result = await db.insert(milestones).values(milestoneData).returning();

      if (!result) {
        reject(new Error("Milestone not created"));
      }

      resolve(result[0]);
    });
  }

  // Update a milestone
  async updateMilestone(
    milestoneId: string,
    userId: string,
    updates: Partial<NewMilestone>
  ): Promise<Milestone | Error> {
    return new Promise(async (resolve, reject) => {
      const result = await db
        .update(milestones)
        .set({ ...updates, updatedAt: new Date() })
        .where(and(eq(milestones.id, milestoneId), eq(milestones.userId, userId)))
        .returning();

      if (!result) {
        reject(new Error("Milestone not found"));
      }

      resolve(result[0]);
    });
  }

  // Delete a milestone
  async deleteMilestone(milestoneId: string, userId: string): Promise<boolean | Error> {
    return new Promise(async (resolve, reject) => {
      const result = await db
        .delete(milestones)
        .where(and(eq(milestones.id, milestoneId), eq(milestones.userId, userId)))
        .returning({ id: milestones.id });

      if (!result) {
        reject(new Error("Milestone not found"));
      }

      resolve(true);
    });
  }

  // Fetch notes
  async fetchAmbitionNotes(ambitionId: string, userId: string): Promise<Note[] | Error> {
    return new Promise(async (resolve, reject) => {
      const result = await db
        .select()
        .from(notes)
        .where(and(eq(notes.ambitionId, ambitionId), eq(notes.userId, userId)));

      if (!result) {
        reject(new Error("No notes found for this ambition"));
      }

      resolve(result);
    });
  }

  // Create a new note
  async createNote(noteData: Note): Promise<Note | Error> {
    return new Promise(async (resolve, reject) => {
      const result = await db.insert(notes).values(noteData).returning();

      if (!result) {
        reject(new Error("Note not created"));
      }

      resolve(result[0]);
    });
  }

  // Update a note
  async updateNote(
    noteId: string,
    userId: string,
    updates: Partial<NewNote>
  ): Promise<Note | Error> {
    return new Promise(async (resolve, reject) => {
      const result = await db
        .update(notes)
        .set({ ...updates, updatedAt: new Date() })
        .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
        .returning();

      if (!result) {
        reject(new Error("Note not found"));
      }

      resolve(result[0]);
    });
  }

  // Delete a note
  async deleteNote(noteId: string, userId: string): Promise<boolean | Error> {
    return new Promise(async (resolve, reject) => {
      const result = await db
        .delete(notes)
        .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
        .returning({ id: notes.id });

      if (!result) {
        reject(new Error("Note not found"));
      }

      resolve(true);
    });
  }
}
