/**
 * Common types and interfaces used throughout the AmbitiousYou application.
 * These interfaces are used in multiple places and should be imported from here.
 */

export interface Ambition {
  id: string;
  userId: string;
  ambitionName: string;
  ambitionDefinition?: string;
  ambitionTrackingMethod: "task" | "milestone";
  ambitionStartDate: Date;
  ambitionEndDate: Date;
  ambitionCompletionDate: Date;
  ambitionStatus: "active" | "completed" | "archived";
  ambitionPriority: "low" | "medium" | "high";
  ambitionPercentageCompleted: number;
  ambitionColor: string;
  isFavourited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AmbitionTask {
  id: string;
  userId: string;
  ambitionId: string;
  task: string;
  taskDescription?: string;
  taskCompleted: boolean;
  taskDeadline: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AmbitionMilestone {
  id: string;
  userId: string;
  ambitionId: string;
  milestone: string;
  milestoneDescription?: string;
  milestoneCompleted: boolean;
  milestoneTargetDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Plan {
  id: string;
  userId: string;
  planName: string;
  planMonthlyPrice: number;
  planYearlyPrice: number;
  planPeriod: "monthly" | "yearly";
  planStatus: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}