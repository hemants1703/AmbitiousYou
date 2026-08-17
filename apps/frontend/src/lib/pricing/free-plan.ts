/** Single source of truth for the free plan — marketing pricing page and in-app billing settings. */
export const freePlan = {
  name: "Free",
  price: "$0",
  tagline: "Free for a limited time",
  lede: "An upgraded version with significant, meaningful upgrades is underway. Create your account today.",
  features: [
    "Unlimited ambitions",
    "Tasks and milestones in any mix",
    "Dashboard insights, streaks, and momentum charts",
    "Private notes and priority management",
    "No credit card required",
  ],
} as const;
