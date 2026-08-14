/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access -- the auto-mocked Drizzle `db` is intentionally `any`-typed in tests. */
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { ProGuard } from './pro.guard';
import { db } from 'src/db';
import { buildChain } from 'src/test-utils/db-chain';

jest.mock('src/db');

describe('ProGuard', () => {
  let guard: ProGuard;

  const buildContext = (userId?: string): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ user: userId ? { id: userId } : undefined }),
      }),
    }) as ExecutionContext;

  beforeEach(() => {
    jest.clearAllMocks();
    guard = new ProGuard();
  });

  it('should deny when no user is on the request', async () => {
    await expect(guard.canActivate(buildContext())).rejects.toThrow(ForbiddenException);
  });

  it('should deny when user plan is free', async () => {
    (db.select as jest.Mock).mockReturnValueOnce(buildChain([{ plan: 'free' }]));

    await expect(guard.canActivate(buildContext('user-1'))).rejects.toThrow(ForbiddenException);
  });

  it('should deny when user row is missing', async () => {
    (db.select as jest.Mock).mockReturnValueOnce(buildChain([]));

    await expect(guard.canActivate(buildContext('user-1'))).rejects.toThrow(ForbiddenException);
  });

  it('should allow when user plan is pro', async () => {
    (db.select as jest.Mock).mockReturnValueOnce(buildChain([{ plan: 'pro' }]));

    await expect(guard.canActivate(buildContext('user-1'))).resolves.toBe(true);
  });
});
