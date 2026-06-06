import { ConflictException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { desc, eq } from 'drizzle-orm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-auth.dto';
import { db, sessions, verifications, type Session } from 'src/db';

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async registerUser(createUserDto: CreateUserDto): Promise<{ sessionToken: string }> {
    const existingUser = await this.usersService.findOneByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    const user = await this.usersService.createUser(createUserDto);

    const [session] = await db
      .insert(sessions)
      .values({
        userId: user.id,
        token: crypto.randomUUID(),
        expiresAt: new Date(Date.now() + SESSION_TTL_MS),
        ipAddress: null,
        userAgent: null,
      })
      .returning();

    return { sessionToken: session.token };
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<{ sessionToken: string }> {
    const user = await this.usersService.findOneByEmailWithPassword(loginUserDto.email);
    if (!user) {
      throw new ConflictException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const [session] = await db
      .insert(sessions)
      .values({
        userId: user.id,
        token: crypto.randomUUID(),
        expiresAt: new Date(Date.now() + SESSION_TTL_MS),
        ipAddress: loginUserDto.ipAddress ?? null,
        userAgent: loginUserDto.userAgent ?? null,
      })
      .returning();

    return { sessionToken: session.token };
  }

  async logoutUser(token: string): Promise<void> {
    const [existing] = await db.select({ id: sessions.id }).from(sessions).where(eq(sessions.token, token)).limit(1);
    if (!existing) {
      throw new ConflictException('Session not found');
    }

    await db.delete(sessions).where(eq(sessions.token, token));
  }

  async getUserSessions(userId: string): Promise<Session[]> {
    return await db.select().from(sessions).where(eq(sessions.userId, userId)).orderBy(desc(sessions.createdAt));
  }

  // TODO: Implement email verification methods
  async verifyEmail(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new ConflictException('User not found');
    }

    try {
      await db.insert(verifications).values({
        userId: user.id,
        identifier: 'email',
        value: crypto.randomUUID(),
        expiresAt: new Date(Date.now() + VERIFICATION_TTL_MS),
      });
    } catch (error) {
      console.error('Error in verifyEmail: ', error);
      throw new HttpException('Failed to create verification record', 500);
    }
  }
}
