import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { Session } from '@ambitiousyou/shared/types';

type RequestWithSession = Request & { session?: Session };

export const CurrentUserId = createParamDecorator((_: unknown, ctx: ExecutionContext): string | undefined => {
  const req = ctx.switchToHttp().getRequest<RequestWithSession>();
  return req.session?.userId;
});
