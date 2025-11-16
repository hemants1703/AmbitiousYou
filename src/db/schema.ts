import { boolean, integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

// [Better Auth] Users table: For User Management
export const user = pgTable("user", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false),
  image: varchar("image", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// [Better Auth] Session table: For Session Management
export const session = pgTable("session", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 })
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  token: varchar("token", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: varchar("ip_address", { length: 255 }),
  userAgent: varchar("user_agent", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// [Better Auth] Account table: For Account Providers like Google, GitHub, etc.
export const account = pgTable("account", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 })
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  accountId: varchar("account_id", { length: 255 }).notNull(), // The ID of the account as provided by the SSO or equal to userId for credential accounts
  providerId: varchar("provider_id", { length: 255 }).notNull(),
  accessToken: varchar("access_token", { length: 255 }),
  refreshToken: varchar("refresh_token", { length: 255 }),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: varchar("scope", { length: 255 }),
  idToken: varchar("id_token", { length: 255 }),
  password: varchar("password", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// [Better Auth] Verification table: For Email Verification
export const verification = pgTable("verification", {
  id: varchar("id", { length: 255 }).primaryKey(),
  identifier: varchar("identifier", { length: 255 })
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  value: varchar("value", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Profiles table: Extended user profile information
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id", { length: 255 })
    .references(() => user.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Ambitions table
export const ambitions = pgTable("ambitions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id", { length: 255 })
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  ambitionName: text("ambition_name").notNull(),
  ambitionDefinition: text("ambition_definition"),
  ambitionTrackingMethod: text("ambition_tracking_method").$type<"task" | "milestone">().notNull(),
  ambitionStartDate: timestamp("ambition_start_date").notNull(),
  ambitionEndDate: timestamp("ambition_end_date").notNull(),
  ambitionCompletionDate: timestamp("ambition_completion_date"),
  ambitionStatus: text("ambition_status")
    .$type<"active" | "completed" | "missed">()
    .default("active"),
  ambitionPriority: varchar("ambition_priority", { length: 255 })
    .$type<"low" | "medium" | "high">()
    .default("medium"),
  ambitionPercentageCompleted: integer("ambition_percentage_completed").default(0),
  ambitionColor: varchar("ambition_color", { length: 255 }).default("#64ccc5").notNull(),
  isFavourited: boolean("is_favourited").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tasks table
export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id", { length: 255 })
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  ambitionId: uuid("ambition_id")
    .references(() => ambitions.id, { onDelete: "cascade" })
    .notNull(),
  task: text("task").notNull(),
  taskDescription: text("task_description"),
  taskCompleted: boolean("task_completed").default(false),
  taskDeadline: timestamp("task_deadline").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Milestones table
export const milestones = pgTable("milestones", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id", { length: 255 })
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  ambitionId: uuid("ambition_id")
    .references(() => ambitions.id, { onDelete: "cascade" })
    .notNull(),
  milestone: text("milestone").notNull(),
  milestoneDescription: text("milestone_description"),
  milestoneCompleted: boolean("milestone_completed").default(false),
  milestoneTargetDate: timestamp("milestone_target_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const notes = pgTable("notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id", { length: 255 })
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  ambitionId: uuid("ambition_id")
    .references(() => ambitions.id, { onDelete: "cascade" })
    .notNull(),
  note: text("note").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Export types
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Ambition = typeof ambitions.$inferSelect;
export type NewAmbition = typeof ambitions.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type Milestone = typeof milestones.$inferSelect;
export type NewMilestone = typeof milestones.$inferInsert;
export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
