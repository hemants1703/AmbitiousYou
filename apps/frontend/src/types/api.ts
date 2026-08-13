import type { Ambition, Milestone, Note, Task } from "./domain";

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
