export type UserPlan = 'free' | 'pro';

export function isProPlan(plan: string): plan is 'pro' {
  return plan === 'pro';
}
