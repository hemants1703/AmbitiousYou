import { pgEnum } from 'drizzle-orm/pg-core';

export const ambitionStatusEnum = pgEnum('AmbitionStatus', ['active', 'completed', 'missed']);

export const ambitionPriorityEnum = pgEnum('AmbitionPriority', ['low', 'medium', 'high']);
