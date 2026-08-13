import type { ProfileToneId } from "@/lib/profile-icons";

/** Soft tinted surfaces for catalog profile avatars — readable in light and dark. */
export const PROFILE_ICON_TONE_CLASS: Record<ProfileToneId, string> = {
  rose: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  orange: "bg-orange-500/15 text-orange-700 dark:text-orange-300",
  amber: "bg-amber-500/15 text-amber-800 dark:text-amber-200",
  yellow: "bg-yellow-500/15 text-yellow-800 dark:text-yellow-200",
  lime: "bg-lime-500/15 text-lime-800 dark:text-lime-200",
  green: "bg-green-500/15 text-green-700 dark:text-green-300",
  teal: "bg-teal-500/15 text-teal-700 dark:text-teal-300",
  cyan: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300",
  sky: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  blue: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  indigo: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
  violet: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  purple: "bg-purple-500/15 text-purple-700 dark:text-purple-300",
  fuchsia: "bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300",
  pink: "bg-pink-500/15 text-pink-700 dark:text-pink-300",
  slate: "bg-slate-500/15 text-slate-700 dark:text-slate-300",
};

/** Solid swatches for the Color tab picker. */
export const PROFILE_TONE_SWATCH_CLASS: Record<ProfileToneId, string> = {
  rose: "bg-rose-500",
  orange: "bg-orange-500",
  amber: "bg-amber-500",
  yellow: "bg-yellow-400",
  lime: "bg-lime-500",
  green: "bg-green-500",
  teal: "bg-teal-500",
  cyan: "bg-cyan-500",
  sky: "bg-sky-500",
  blue: "bg-blue-500",
  indigo: "bg-indigo-500",
  violet: "bg-violet-500",
  purple: "bg-purple-500",
  fuchsia: "bg-fuchsia-500",
  pink: "bg-pink-500",
  slate: "bg-slate-500",
};
