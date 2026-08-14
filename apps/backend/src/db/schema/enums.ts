import { pgEnum } from 'drizzle-orm/pg-core';

export const ambitionStatusEnum = pgEnum('AmbitionStatus', ['active', 'completed', 'missed']);

export const ambitionPriorityEnum = pgEnum('AmbitionPriority', ['low', 'medium', 'high']);

export const userPlanEnum = pgEnum('UserPlan', ['free', 'pro']);

export const contractMoveKindEnum = pgEnum('ContractMoveKind', ['task', 'milestone']);

export const contractStatusEnum = pgEnum('ContractStatus', ['active', 'completed', 'snoozed']);
