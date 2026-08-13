// Backward-compat shim. The types live with the Drizzle schema at
// `../db/schema/*`; this file re-exports them so existing frontend imports
// from `@ambitiousyou/shared/types` keep resolving. Prefer importing from
// `@ambitiousyou/shared` (or `@ambitiousyou/shared/db`) in new code.

export type { User, NewUser } from '../db/schema/users';
export type { Session, NewSession } from '../db/schema/sessions';
export type { Verification, NewVerification } from '../db/schema/verifications';
export type { Settings } from '../db/schema/settings';
export type { Ambition, NewAmbition, AmbitionEndDateChange } from '../db/schema/ambitions';
export type { Task, NewTask } from '../db/schema/tasks';
export type { Milestone, NewMilestone } from '../db/schema/milestones';
export type { Note, NewNote } from '../db/schema/notes';
export type { AmbitionMovesBatch, AmbitionFull, ToggleFavouriteResult } from './api';
export type {
  ProfileIconId,
  ProfileIconTone,
  ProfileIcon,
  ProfileIconKind,
  ProfileGlyphKey,
  ProfileMarkId,
  ProfileMarkKind,
  ProfileMark,
  ProfileToneId,
  ProfileAvatarSelection,
} from '../db/profile-icons';
export {
  PROFILE_ICON_PREFIX,
  PROFILE_MARK_NONE,
  DEFAULT_PROFILE_TONE_ID,
  PROFILE_TONES,
  PROFILE_MARKS,
  PROFILE_ICONS,
  PROFILE_MARK_IDS,
  PROFILE_TONE_IDS,
  PROFILE_ICON_IDS,
  PROFILE_ICON_VALUES,
  listProfileMarksByKind,
  listProfileIconsByKind,
  getProfileMark,
  getProfileIcon,
  isProfileToneId,
  isProfileMarkId,
  serializeProfileAvatar,
  toProfileIconValue,
  parseProfileAvatar,
  isProfileAvatarValue,
  parseProfileIconId,
  resolveProfileIcon,
} from '../db/profile-icons';
