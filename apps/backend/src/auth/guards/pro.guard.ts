import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type { Request } from 'express';
import { db, users } from '../../db';
import { isProPlan } from '../plan';

interface RequestWithUser extends Request {
  user: { id: string };
}

@Injectable()
export class ProGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const userId = request.user?.id;

    if (!userId) {
      throw new ForbiddenException('Pro access required');
    }

    const [user] = await db.select({ plan: users.plan }).from(users).where(eq(users.id, userId)).limit(1);

    if (!user || !isProPlan(user.plan)) {
      throw new ForbiddenException('Pro access required');
    }

    return true;
  }
}
