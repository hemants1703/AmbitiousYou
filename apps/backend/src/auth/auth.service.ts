import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { and, desc, eq } from 'drizzle-orm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { EmailService } from 'src/notifications/email.service';
import { LoginUserDto } from './dto/login-auth.dto';
import { db, sessions, users, verifications, type Session, type User } from 'src/db';

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const VERIFICATION_TTL_MS = 60 * 60 * 1000; // 1 hour
const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000; // 1 hour

const EMAIL_IDENTIFIER = 'email';
const PASSWORD_RESET_IDENTIFIER = 'password-reset';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  // Frontend origin used to build links inside transactional emails.
  private base(): string {
    return process.env.APP_BASE_URL ?? 'https://www.ambitiousyou.pro';
  }

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

    // Soft verification: the user is logged in immediately; the verification
    // email is fire-and-forget so registration never blocks on email delivery.
    void this.sendEmailVerification(user);

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

  // --- Email verification -------------------------------------------------

  /**
   * Issues a fresh email-verification token (replacing any prior one) and sends
   * the verification email. Self-contained and never throws — safe to call as
   * `void` (signup) or to `await` (resend).
   */
  private async sendEmailVerification(user: User): Promise<void> {
    try {
      const token = crypto.randomUUID();
      await db.delete(verifications).where(and(eq(verifications.userId, user.id), eq(verifications.identifier, EMAIL_IDENTIFIER)));
      await db.insert(verifications).values({
        userId: user.id,
        identifier: EMAIL_IDENTIFIER,
        value: token,
        expiresAt: new Date(Date.now() + VERIFICATION_TTL_MS),
      });

      void this.emailService.sendVerificationEmail(user.email, user.name, `${this.base()}/verify-email?token=${token}`);
    } catch (error) {
      this.logger.error(`Failed to issue verification email for user ${user.id}`, error as Error);
    }
  }

  async verifyEmailToken(token: string): Promise<{ success: true }> {
    const [row] = await db
      .select()
      .from(verifications)
      .where(and(eq(verifications.value, token), eq(verifications.identifier, EMAIL_IDENTIFIER)))
      .limit(1);

    if (!row || new Date(row.expiresAt) < new Date()) {
      throw new UnauthorizedException('Invalid or expired verification token');
    }

    await db.update(users).set({ emailVerified: true }).where(eq(users.id, row.userId));
    await db.delete(verifications).where(eq(verifications.id, row.id));

    const user = await this.usersService.findOneById(row.userId);
    if (user) {
      void this.emailService.sendWelcomeEmail(user.email, user.name, `${this.base()}/dashboard`);
    }

    return { success: true };
  }

  async resendVerification(userId: string): Promise<{ success: true }> {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user.emailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    // Rate limit: while a still-valid verification token exists, don't issue a
    // new one — prevents spamming the resend button. The token's 1h TTL doubles
    // as the cooldown window.
    const [existing] = await db
      .select()
      .from(verifications)
      .where(and(eq(verifications.userId, userId), eq(verifications.identifier, EMAIL_IDENTIFIER)))
      .orderBy(desc(verifications.expiresAt))
      .limit(1);

    if (existing && new Date(existing.expiresAt) > new Date()) {
      throw new HttpException(
        'A verification link was already sent and is still valid. Please check your inbox and try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    await this.sendEmailVerification(user);
    return { success: true };
  }

  // --- Password reset -----------------------------------------------------

  /**
   * Forgot-password request (before auth). Always resolves with a generic
   * success regardless of whether the email belongs to a real account, so the
   * endpoint can't be used to enumerate users.
   */
  async forgotPassword(email: string): Promise<{ success: true }> {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      try {
        const token = crypto.randomUUID();
        await db.delete(verifications).where(and(eq(verifications.userId, user.id), eq(verifications.identifier, PASSWORD_RESET_IDENTIFIER)));
        await db.insert(verifications).values({
          userId: user.id,
          identifier: PASSWORD_RESET_IDENTIFIER,
          value: token,
          expiresAt: new Date(Date.now() + PASSWORD_RESET_TTL_MS),
        });

        void this.emailService.sendPasswordResetEmail(user.email, user.name, `${this.base()}/reset-password?token=${token}`);
      } catch (error) {
        this.logger.error(`Failed to issue password-reset email for ${email}`, error as Error);
      }
    }

    return { success: true };
  }

  /** Forgot-password completion (before auth) — set a new password via token. */
  async forgotPasswordReset(token: string, password: string): Promise<{ success: true }> {
    const [row] = await db
      .select()
      .from(verifications)
      .where(and(eq(verifications.value, token), eq(verifications.identifier, PASSWORD_RESET_IDENTIFIER)))
      .limit(1);

    if (!row || new Date(row.expiresAt) < new Date()) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    await this.usersService.updatePassword(row.userId, password);
    await db.delete(verifications).where(eq(verifications.id, row.id));
    // Recovering an account invalidates every existing session for safety.
    await db.delete(sessions).where(eq(sessions.userId, row.userId));

    const user = await this.usersService.findOneById(row.userId);
    if (user) {
      void this.emailService.sendPasswordResetConfirmationEmail(user.email, user.name, `${this.base()}/login`);
    }

    return { success: true };
  }

  /**
   * Settings "Reset password" (after auth). Sets a new password and, when the
   * user opts in, drops every session (including the current one).
   */
  async resetPassword(userId: string, newPassword: string, signOutAllDevices: boolean): Promise<{ success: true; signedOut: boolean }> {
    await this.usersService.updatePassword(userId, newPassword);

    if (signOutAllDevices) {
      await db.delete(sessions).where(eq(sessions.userId, userId));
    }

    const user = await this.usersService.findOneById(userId);
    if (user) {
      void this.emailService.sendPasswordChangedEmail(user.email, user.name);
    }

    return { success: true, signedOut: signOutAllDevices };
  }
}
