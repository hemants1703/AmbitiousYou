import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Database connection
const connectionString = process.env.DATABASE_URL!;

// For development - disable prefetching for better compatibility
const client = postgres(connectionString, {
  prepare: false,
});

// Create drizzle instance
export const db = drizzle(client, { schema });

// Export types
export type { User, NewUser, Profile, NewProfile, Plan, NewPlan, Ambition, NewAmbition, Task, NewTask, Milestone, NewMilestone } from "./schema";