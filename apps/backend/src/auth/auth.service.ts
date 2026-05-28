import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { SessionEntity } from './entities/session.entity';
import { VerificationEntity } from './entities/verification.entity';
import { LoginUserDto } from './dto/login-auth.dto';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(SessionEntity) private readonly sessionRepository: Repository<SessionEntity>,
    @InjectRepository(VerificationEntity) private readonly verificationRepository: Repository<VerificationEntity>,
  ) {}

  async registerUser(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      id: crypto.randomUUID(),
      name: createUserDto.name,
      email: createUserDto.email,
      emailVerified: false,
      passwordHash: hashedPassword,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.userRepository.save(user);

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

    return { userId: user.id, message: 'Check email for verification link' };
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({ where: { email: loginUserDto.email } });
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
      ipAddress: loginUserDto.ipAddress,
      userAgent: loginUserDto.userAgent,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.sessionRepository.save(session);

    return {
      token: session.token,
      user,
    };
  }
}
