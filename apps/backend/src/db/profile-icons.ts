/**
 * Mix-and-match profile avatars.
 *
 * Stored on `users.image` as:
 *   `icon:<markId>:<toneId>`  e.g. `icon:panda:rose`, `icon:g-target:teal`
 *   `icon:none:<toneId>`      colored initials (no emoji/glyph)
 *   `null`                    plain initials
 *
 * Legacy `icon:<markId>` (no tone) is still parsed with a default tone.
 */

export const PROFILE_ICON_PREFIX = 'icon:' as const;
export const PROFILE_MARK_NONE = 'none' as const;
export const DEFAULT_PROFILE_TONE_ID = 'teal' as const;

export const PROFILE_TONES = [
  { id: 'rose', label: 'Rose' },
  { id: 'orange', label: 'Orange' },
  { id: 'amber', label: 'Amber' },
  { id: 'yellow', label: 'Yellow' },
  { id: 'lime', label: 'Lime' },
  { id: 'green', label: 'Green' },
  { id: 'teal', label: 'Teal' },
  { id: 'cyan', label: 'Cyan' },
  { id: 'sky', label: 'Sky' },
  { id: 'blue', label: 'Blue' },
  { id: 'indigo', label: 'Indigo' },
  { id: 'violet', label: 'Violet' },
  { id: 'purple', label: 'Purple' },
  { id: 'fuchsia', label: 'Fuchsia' },
  { id: 'pink', label: 'Pink' },
  { id: 'slate', label: 'Slate' },
] as const;

export type ProfileToneId = (typeof PROFILE_TONES)[number]['id'];

const PROFILE_EMOJI_MARKS = [
  { id: 'panda', kind: 'emoji', emoji: '🐼', label: 'Panda' },
  { id: 'fox', kind: 'emoji', emoji: '🦊', label: 'Fox' },
  { id: 'owl', kind: 'emoji', emoji: '🦉', label: 'Owl' },
  { id: 'fire', kind: 'emoji', emoji: '🔥', label: 'Fire' },
  { id: 'rocket', kind: 'emoji', emoji: '🚀', label: 'Rocket' },
  { id: 'target', kind: 'emoji', emoji: '🎯', label: 'Target' },
  { id: 'spark', kind: 'emoji', emoji: '✨', label: 'Spark' },
  { id: 'bolt', kind: 'emoji', emoji: '⚡', label: 'Bolt' },
  { id: 'mountain', kind: 'emoji', emoji: '⛰️', label: 'Mountain' },
  { id: 'compass', kind: 'emoji', emoji: '🧭', label: 'Compass' },
  { id: 'crown', kind: 'emoji', emoji: '👑', label: 'Crown' },
  { id: 'trophy', kind: 'emoji', emoji: '🏆', label: 'Trophy' },
  { id: 'star', kind: 'emoji', emoji: '⭐', label: 'Star' },
  { id: 'gem', kind: 'emoji', emoji: '💎', label: 'Gem' },
  { id: 'brain', kind: 'emoji', emoji: '🧠', label: 'Brain' },
  { id: 'sunrise', kind: 'emoji', emoji: '🌅', label: 'Sunrise' },
] as const;

const PROFILE_GLYPH_MARKS = [
  { id: 'g-target', kind: 'glyph', glyph: 'target', label: 'Target' },
  { id: 'g-rocket', kind: 'glyph', glyph: 'rocket', label: 'Rocket' },
  { id: 'g-flame', kind: 'glyph', glyph: 'flame', label: 'Flame' },
  { id: 'g-sparkles', kind: 'glyph', glyph: 'sparkles', label: 'Sparkles' },
  { id: 'g-trophy', kind: 'glyph', glyph: 'trophy', label: 'Trophy' },
  { id: 'g-mountain', kind: 'glyph', glyph: 'mountain', label: 'Mountain' },
  { id: 'g-compass', kind: 'glyph', glyph: 'compass', label: 'Compass' },
  { id: 'g-zap', kind: 'glyph', glyph: 'zap', label: 'Zap' },
  { id: 'g-crown', kind: 'glyph', glyph: 'crown', label: 'Crown' },
  { id: 'g-star', kind: 'glyph', glyph: 'star', label: 'Star' },
  { id: 'g-gem', kind: 'glyph', glyph: 'gem', label: 'Gem' },
  { id: 'g-flag', kind: 'glyph', glyph: 'flag', label: 'Flag' },
  { id: 'g-trending', kind: 'glyph', glyph: 'trending-up', label: 'Trending' },
  { id: 'g-focus', kind: 'glyph', glyph: 'focus', label: 'Focus' },
  { id: 'g-award', kind: 'glyph', glyph: 'award', label: 'Award' },
  { id: 'g-milestone', kind: 'glyph', glyph: 'milestone', label: 'Milestone' },
] as const;

export const PROFILE_MARKS = [...PROFILE_EMOJI_MARKS, ...PROFILE_GLYPH_MARKS] as const;

/** @deprecated Prefer PROFILE_MARKS — kept as an alias for older imports. */
export const PROFILE_ICONS = PROFILE_MARKS;

export type ProfileMark = (typeof PROFILE_MARKS)[number];
export type ProfileMarkId = ProfileMark['id'];
export type ProfileMarkKind = ProfileMark['kind'];
export type ProfileGlyphKey = Extract<ProfileMark, { kind: 'glyph' }>['glyph'];

/** @deprecated Use ProfileMarkId. */
export type ProfileIconId = ProfileMarkId;
/** @deprecated Use ProfileToneId. */
export type ProfileIconTone = ProfileToneId;
/** @deprecated Use ProfileMark. */
export type ProfileIcon = ProfileMark;
/** @deprecated Use ProfileMarkKind. */
export type ProfileIconKind = ProfileMarkKind;

export interface ProfileAvatarSelection {
  markId: ProfileMarkId | null;
  toneId: ProfileToneId;
}

export const PROFILE_MARK_IDS: readonly ProfileMarkId[] = PROFILE_MARKS.map((mark) => mark.id);
export const PROFILE_TONE_IDS: readonly ProfileToneId[] = PROFILE_TONES.map((tone) => tone.id);

export const PROFILE_ICON_IDS = PROFILE_MARK_IDS;

export function listProfileMarksByKind(kind: ProfileMarkKind): readonly ProfileMark[] {
  return PROFILE_MARKS.filter((mark) => mark.kind === kind);
}

/** @deprecated Use listProfileMarksByKind. */
export function listProfileIconsByKind(kind: ProfileMarkKind): readonly ProfileMark[] {
  return listProfileMarksByKind(kind);
}

export function getProfileMark(id: ProfileMarkId): ProfileMark {
  return PROFILE_MARKS.find((mark) => mark.id === id)!;
}

/** @deprecated Use getProfileMark. */
export function getProfileIcon(id: ProfileMarkId): ProfileMark {
  return getProfileMark(id);
}

export function isProfileToneId(value: string): value is ProfileToneId {
  return (PROFILE_TONE_IDS as readonly string[]).includes(value);
}

export function isProfileMarkId(value: string): value is ProfileMarkId {
  return (PROFILE_MARK_IDS as readonly string[]).includes(value);
}

export function serializeProfileAvatar(selection: ProfileAvatarSelection): string {
  const mark = selection.markId ?? PROFILE_MARK_NONE;
  return `${PROFILE_ICON_PREFIX}${mark}:${selection.toneId}`;
}

export function toProfileIconValue(id: ProfileMarkId, toneId: ProfileToneId = DEFAULT_PROFILE_TONE_ID): string {
  return serializeProfileAvatar({ markId: id, toneId });
}

export function parseProfileAvatar(image: string | null | undefined): ProfileAvatarSelection | null {
  if (!image?.startsWith(PROFILE_ICON_PREFIX)) return null;

  const payload = image.slice(PROFILE_ICON_PREFIX.length);
  const [markRaw, toneRaw] = payload.split(':');

  // Legacy: `icon:panda`
  if (!toneRaw) {
    if (!isProfileMarkId(markRaw)) return null;
    return { markId: markRaw, toneId: DEFAULT_PROFILE_TONE_ID };
  }

  if (!isProfileToneId(toneRaw)) return null;

  if (markRaw === PROFILE_MARK_NONE) {
    return { markId: null, toneId: toneRaw };
  }

  if (!isProfileMarkId(markRaw)) return null;
  return { markId: markRaw, toneId: toneRaw };
}

export function isProfileAvatarValue(value: string): boolean {
  return parseProfileAvatar(value) !== null;
}

/** All valid stored values (marks × tones + color-only initials). Used by API allowlists. */
export const PROFILE_ICON_VALUES: readonly string[] = [
  ...PROFILE_MARK_IDS.flatMap((markId) => PROFILE_TONE_IDS.map((toneId) => serializeProfileAvatar({ markId, toneId }))),
  ...PROFILE_TONE_IDS.map((toneId) => serializeProfileAvatar({ markId: null, toneId })),
];

export function parseProfileIconId(image: string | null | undefined): ProfileMarkId | null {
  return parseProfileAvatar(image)?.markId ?? null;
}

export function resolveProfileIcon(image: string | null | undefined): ProfileMark | null {
  const selection = parseProfileAvatar(image);
  return selection?.markId ? getProfileMark(selection.markId) : null;
}
