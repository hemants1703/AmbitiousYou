import type { Ambition, DailyContract, Milestone, Note, Task, WeeklyReview } from '../db';

/** Batch tasks + milestones for dashboard feeds (replaces N×2 per-ambition fetches). */
export type AmbitionMovesBatch = {
  tasks: Task[];
  milestones: Milestone[];
};

/** Full ambition detail payload (replaces 4 parallel fetches). */
export type AmbitionFull = {
  ambition: Ambition;
  tasks: Task[];
  milestones: Milestone[];
  notes: Note[];
};

/** Response from PATCH /ambitions/:id/favourite */
export type ToggleFavouriteResult = {
  isFavourited: boolean;
};

export type SuggestedMove = {
  kind: 'task' | 'milestone';
  id: string;
  title: string;
  description: string | null;
  date: Date | string;
};

export type ContractPayload = {
  contract: DailyContract | null;
  localDate: string;
  primaryAmbition: Ambition | null;
  suggestedMove: SuggestedMove | null;
  move: SuggestedMove | null;
};

export type PrimaryAmbitionPayload = {
  primaryAmbition: Ambition | null;
  suggestedMove: SuggestedMove | null;
};

export type AttentionCoachPayload = {
  primaryAmbition: Ambition | null;
  daysSinceLastCompletedMove: number | null;
  daysUntilEndDate: number | null;
  nextMilestoneTitle: string | null;
  proposedAction: string | null;
  summary: string;
};

export type MissedDayPayload = {
  missedYesterday: boolean;
  yesterdayContract: DailyContract | null;
};

export type WeeklyReviewPayload = {
  review: WeeklyReview | null;
  weekStartDate: string;
  title: string;
};
