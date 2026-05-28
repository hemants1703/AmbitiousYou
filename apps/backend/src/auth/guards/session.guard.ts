import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionEntity } from '../entities/session.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import type { Request } from 'express';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    @InjectRepository(SessionEntity) private readonly sessionRepository: Repository<SessionEntity>,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Extract token from cookies or Authorization header
    const token = this.extractTokenFromCookies(request) || this.extractTokenFromHeaders(request);

    if (!token) {
      throw new UnauthorizedException('Missing session token');
    }

    // Search for a session with the provided token
    const session = await this.sessionRepository.findOne({ where: { token } });

    // If no session is found, deny access
    if (!session) {
      throw new UnauthorizedException('Invalid or expired session token');
    }

    // If session is found but expired, delete it and deny access
    if (new Date(session.expiresAt) < new Date()) {
      await this.sessionRepository.delete(session.id);
      throw new UnauthorizedException('Session token has expired');
    }

    // If session is valid, fetch the associated user
    const user = await this.userRepository.findOne({ where: { id: session.userId } });

    // If user associated with the session is not found, deny access
    if (!user) {
      throw new UnauthorizedException('User associated with session not found');
    }

    request['user'] = user;
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
