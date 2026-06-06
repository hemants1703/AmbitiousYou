// Backward-compat shim. The types live with the Drizzle schema at
// `../db/schema/*`; this file re-exports them so existing frontend imports
// from `@ambitiousyou/shared/types` keep resolving. Prefer importing from
// `@ambitiousyou/shared` (or `@ambitiousyou/shared/db`) in new code.

export type { User, NewUser } from '../db/schema/users';
export type { Session, NewSession } from '../db/schema/sessions';
export type { Verification, NewVerification } from '../db/schema/verifications';
export type { Settings } from '../db/schema/settings';
export type { Ambition, NewAmbition } from '../db/schema/ambitions';
export type { Task, NewTask } from '../db/schema/tasks';
export type { Milestone, NewMilestone } from '../db/schema/milestones';
export type { Note, NewNote } from '../db/schema/notes';
