import { ConflictException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/login-auth.dto';
import { SessionEntity } from './entities/session.entity';
import { VerificationEntity } from './entities/verification.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(SessionEntity) private readonly sessionRepository: Repository<SessionEntity>,
    @InjectRepository(VerificationEntity) private readonly verificationRepository: Repository<VerificationEntity>,
  ) {}

  async registerUser(createUserDto: CreateUserDto): Promise<{ sessionToken: string }> {
    const existingUser = await this.usersService.findOneByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    const user = await this.usersService.createUser(createUserDto);

    const session = this.sessionRepository.create({
      id: crypto.randomUUID(),
      userId: user.id,
      token: crypto.randomUUID(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
      ipAddress: null,
      userAgent: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.sessionRepository.save(session);

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

    const session = this.sessionRepository.create({
      id: crypto.randomUUID(),
      userId: user.id,
      token: crypto.randomUUID(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
      ipAddress: loginUserDto.ipAddress ?? null,
      userAgent: loginUserDto.userAgent ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.sessionRepository.save(session);

    return { sessionToken: session.token };
  }

  // TODO: Implement email verification methods
  async verifyEmail(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new ConflictException('User not found');
    }

    try {
      const verification = this.verificationRepository.create({
        id: crypto.randomUUID(),
        userId: user.id,
        identifier: 'email',
        value: crypto.randomUUID(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 24 hours
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await this.verificationRepository.save(verification);
    } catch (error) {
      console.error('Error in verifyEmail: ', error);
      throw new HttpException('Failed to create verification record', 500);
    }
  }

  // TODO: Implement logout and session management methods
}
