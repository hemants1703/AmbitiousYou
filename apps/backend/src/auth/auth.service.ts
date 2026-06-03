import { ConflictException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { Session } from '@prisma/client';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
  ) {}

  async registerUser(createUserDto: CreateUserDto): Promise<{ sessionToken: string }> {
    const existingUser = await this.usersService.findOneByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    const user = await this.usersService.createUser(createUserDto);

    const session = await this.prisma.session.create({
      data: {
        userId: user.id,
        token: crypto.randomUUID(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
        ipAddress: null,
        userAgent: null,
      },
    });

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

    const session = await this.prisma.session.create({
      data: {
        userId: user.id,
        token: crypto.randomUUID(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
        ipAddress: loginUserDto.ipAddress ?? null,
        userAgent: loginUserDto.userAgent ?? null,
      },
    });

    return { sessionToken: session.token };
  }

  async logoutUser(token: string): Promise<void> {
    const session = await this.prisma.session.findFirst({ where: { token } });

    if (!session) {
      throw new ConflictException('Session not found');
    }

    await this.prisma.session.deleteMany({ where: { token } });
  }

  async getUserSessions(userId: string): Promise<Session[]> {
    return await this.prisma.session.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // TODO: Implement email verification methods
  async verifyEmail(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new ConflictException('User not found');
    }

    try {
      await this.prisma.verification.create({
        data: {
          userId: user.id,
          identifier: 'email',
          value: crypto.randomUUID(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 24 hours
        },
      });
    } catch (error) {
      console.error('Error in verifyEmail: ', error);
      throw new HttpException('Failed to create verification record', 500);
    }
  }

  // TODO: Implement logout and session management methods
}
