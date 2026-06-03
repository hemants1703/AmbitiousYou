import { ConflictException, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { Prisma, User } from '@prisma/client';
import type { User as SharedUser } from '@ambitiousyou/shared/types';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SettingsService } from 'src/settings/settings.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly settingsService: SettingsService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<SharedUser> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    let user: SharedUser;
    try {
      user = await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          emailVerified: false,
          passwordHash: hashedPassword,
          image: null,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Username already exists');
      }
      throw e;
    }

    await this.settingsService.createSettingsForUserId(user.id);

    return user;
  }

  async findOneByEmail(email: string): Promise<SharedUser | null> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findOneByEmailWithPassword(email: string): Promise<User | null> {
    // Override the client-wide omit so the password hash is available for login.
    return await this.prisma.user.findUnique({ where: { email }, omit: { passwordHash: false } });
  }

  async findOneById(id: string): Promise<SharedUser | null> {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async findUserBySessionToken(token: string): Promise<SharedUser | null> {
    const session = await this.prisma.session.findFirst({ where: { token }, include: { user: true } });
    return session?.user ?? null;
  }
}
