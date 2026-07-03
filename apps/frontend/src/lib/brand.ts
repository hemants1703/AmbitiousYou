/** Shared identity copy — single source for marketing voice across landing, auth, and app rituals. */
export const brandCopy = {
  name: "AmbitiousYou",
  identityLine: "AmbitiousYou is where ambitious people run their ambitions.",
  tagline: "Where ambitious goals become inevitable outcomes",
  description:
    "Priority management and progress tracking for people who think in ambitions, not errands. Structure long-term goals, track honest momentum, stay private by default.",
  footerBlurb: "Where ambitious people run their ambitions — free, private, and built for outcomes that take months, not minutes.",
  cta: {
    join: "Join the ambitious ones",
    claimFirst: "Claim your first ambition",
    claimAmbitions: "Claim your ambitions",
    createAccount: "Join the ambitious ones",
    goDashboard: "Go to Dashboard",
  },
  signup: {
    tagline: "You're joining people who finish what matters.",
    heading: "Join the ambitious ones",
    subheading: "Create your account — your first ambition takes about a minute.",
    submit: "Join the ambitious ones",
    pending: "Joining…",
  },
  initiation: {
    heading: "Declare your ambition",
    subheading:
      "What are you building toward? Name it, add your first moves, and prove you're serious. This is where ambitious people start.",
    submit: "Launch ambition",
    pending: "Launching…",
    welcomeTitle: "You're in.",
    welcomeBody: (ambitionName: string) => `${ambitionName} is live. You're one of the ambitious ones now.`,
    welcomeCta: "Open your ambition",
    welcomeShare: "Share your declaration",
  },
} as const;
