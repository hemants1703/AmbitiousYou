import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type { Request } from 'express';
import { db, sessions } from 'src/db';

@Injectable()
export class SessionGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Extract token from cookies or Authorization header
    const token = this.extractTokenFromCookies(request) || this.extractTokenFromHeaders(request);

    if (!token) {
      throw new UnauthorizedException('Missing session token');
    }

    // Search for a session with the provided token
    const [session] = await db.select().from(sessions).where(eq(sessions.token, token)).limit(1);

    // If no session is found, deny access
    if (!session) {
      throw new UnauthorizedException('Invalid or expired session token');
    }

    // If session is found but expired, delete it and deny access
    if (new Date(session.expiresAt) < new Date()) {
      await db.delete(sessions).where(eq(sessions.id, session.id));
      throw new UnauthorizedException('Session token has expired');
    }

    // Attach only the userId from the session to the request.
    // This avoids an extra user lookup here; services can query user data if needed.
    request['user'] = { id: session.userId };
    request['session'] = session;

    return true;
  }

  private extractTokenFromHeaders(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractTokenFromCookies(request: Request): string | undefined {
    const cookies = request.cookies as Record<string, any> | undefined;
    return cookies?.sessionToken as string | undefined;
  }
}
