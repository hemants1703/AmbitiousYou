/** Hand-written API domain types — keep in sync with backend schema when shapes change. */

export type AmbitionStatus = "active" | "completed" | "missed";
export type AmbitionPriority = "low" | "medium" | "high";
export type NotificationType = "task_due_today" | "milestone_due_today";

export type UserPlan = "free" | "pro";

export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  plan: UserPlan;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ProofLog = {
  id: string;
  userId: string;
  ambitionId: string | null;
  proofTitle: string;
  proofNote: string | null;
  loggedAt: Date;
  createdAt: Date;
};

export type Session = {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Settings = {
  id: string;
  userId: string;
  userTimezone: string;
  emailAccountActivity: boolean;
  pushAmbitionReminders: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type AmbitionEndDateChange = {
  previousEndDate: string;
  newEndDate: string;
  changedAt: string;
};

export type Ambition = {
  id: string;
  userId: string;
  ambitionName: string;
  ambitionDefinition: string | null;
  ambitionMotivation: string | null;
  ambitionStartDate: Date;
  ambitionEndDate: Date;
  ambitionEndDateHistory: AmbitionEndDateChange[];
  ambitionCompletionDate: Date | null;
  ambitionStatus: AmbitionStatus;
  ambitionPriority: AmbitionPriority;
  ambitionPercentageCompleted: number;
  isFavourited: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Task = {
  id: string;
  userId: string;
  ambitionId: string;
  task: string;
  taskDescription: string | null;
  taskCompleted: boolean;
  taskCompletedAt: Date | null;
  taskDeadline: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type Milestone = {
  id: string;
  userId: string;
  ambitionId: string;
  milestone: string;
  milestoneDescription: string | null;
  milestoneCompleted: boolean;
  milestoneCompletedAt: Date | null;
  milestoneTargetDate: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type Note = {
  id: string;
  userId: string;
  ambitionId: string;
  note: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Notification = {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  href: string;
  ambitionId: string | null;
  resourceId: string | null;
  dedupeKey: string;
  readAt: Date | null;
  createdAt: Date;
};
