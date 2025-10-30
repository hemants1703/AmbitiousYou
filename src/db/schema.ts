import { pgTable, text, timestamp, boolean, integer, uuid, date, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// Users table (managed by BetterAuth)
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  emailVerified: boolean("email_verified").default(false),
  name: text("name"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Accounts table (managed by BetterAuth)
export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  idToken: text("id_token"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Sessions table (managed by BetterAuth)
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Verifications table (managed by BetterAuth)
export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Profiles table
export const profiles = pgTable("profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Plans table
export const plans = pgTable("plans", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  planName: text("plan_name").notNull(),
  planMonthlyPrice: decimal("plan_monthly_price", { precision: 10, scale: 2 }).notNull(),
  planYearlyPrice: decimal("plan_yearly_price", { precision: 10, scale: 2 }).notNull(),
  planPeriod: text("plan_period", { enum: ["monthly", "yearly"] }).notNull(),
  planStatus: text("plan_status", { enum: ["active", "inactive"] }).default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Ambitions table
export const ambitions = pgTable("ambitions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  ambitionName: text("ambition_name").notNull(),
  ambitionDefinition: text("ambition_definition"),
  ambitionTrackingMethod: text("ambition_tracking_method", { enum: ["task", "milestone"] }).notNull(),
  ambitionStartDate: date("ambition_start_date").notNull(),
  ambitionEndDate: date("ambition_end_date").notNull(),
  ambitionCompletionDate: date("ambition_completion_date"),
  ambitionStatus: text("ambition_status", { enum: ["active", "completed", "archived"] }).default("active").notNull(),
  ambitionPriority: text("ambition_priority", { enum: ["low", "medium", "high"] }).default("medium").notNull(),
  ambitionPercentageCompleted: integer("ambition_percentage_completed").default(0).notNull(),
  ambitionColor: text("ambition_color").notNull(),
  isFavourited: boolean("is_favourited").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Tasks table
export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  ambitionId: uuid("ambition_id").references(() => ambitions.id, { onDelete: "cascade" }).notNull(),
  task: text("task").notNull(),
  taskDescription: text("task_description"),
  taskCompleted: boolean("task_completed").default(false).notNull(),
  taskDeadline: date("task_deadline").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Milestones table
export const milestones = pgTable("milestones", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  ambitionId: uuid("ambition_id").references(() => ambitions.id, { onDelete: "cascade" }).notNull(),
  milestone: text("milestone").notNull(),
  milestoneDescription: text("milestone_description"),
  milestoneCompleted: boolean("milestone_completed").default(false).notNull(),
  milestoneTargetDate: date("milestone_target_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertAccountSchema = createInsertSchema(accounts);
export const selectAccountSchema = createSelectSchema(accounts);

export const insertSessionSchema = createInsertSchema(sessions);
export const selectSessionSchema = createSelectSchema(sessions);

export const insertVerificationSchema = createInsertSchema(verifications);
export const selectVerificationSchema = createSelectSchema(verifications);

export const insertProfileSchema = createInsertSchema(profiles);
export const selectProfileSchema = createSelectSchema(profiles);

export const insertPlanSchema = createInsertSchema(plans);
export const selectPlanSchema = createSelectSchema(plans);

export const insertAmbitionSchema = createInsertSchema(ambitions);
export const selectAmbitionSchema = createSelectSchema(ambitions);

export const insertTaskSchema = createInsertSchema(tasks);
export const selectTaskSchema = createSelectSchema(tasks);

export const insertMilestoneSchema = createInsertSchema(milestones);
export const selectMilestoneSchema = createSelectSchema(milestones);

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type Verification = typeof verifications.$inferSelect;
export type NewVerification = typeof verifications.$inferInsert;

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;

export type Plan = typeof plans.$inferSelect;
export type NewPlan = typeof plans.$inferInsert;

export type Ambition = typeof ambitions.$inferSelect;
export type NewAmbition = typeof ambitions.$inferInsert;

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;

export type Milestone = typeof milestones.$inferSelect;
export type NewMilestone = typeof milestones.$inferInsert;