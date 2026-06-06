import { pgEnum } from 'drizzle-orm/pg-core';

export const ambitionTrackingMethodEnum = pgEnum('AmbitionTrackingMethod', ['task', 'milestone']);

export const ambitionStatusEnum = pgEnum('AmbitionStatus', ['active', 'completed', 'missed']);

export const ambitionPriorityEnum = pgEnum('AmbitionPriority', ['low', 'medium', 'high']);
