import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SettingsService } from 'src/settings/settings.service';
import bcrypt from 'bcrypt';

describe('UsersService', () => {
  let userService: UsersService;
  let prisma: { user: { create: jest.Mock; findUnique: jest.Mock } };
  let settingsService: { createSettingsForUserId: jest.Mock };

  beforeEach(async () => {
    prisma = {
      user: {
        create: jest.fn(),
        findUnique: jest.fn(),
      },
    };
    settingsService = { createSettingsForUserId: jest.fn() };

    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prisma },
        { provide: SettingsService, useValue: settingsService },
      ],
    }).compile();

    userService = testingModule.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user and seed its settings', async () => {
      const createUserDto = { name: 'Hemant Sharma', email: 'hemant@hemantsharma.tech', password: 'password123' };

      const createdUser = {
        id: '1',
        name: createUserDto.name,
        email: createUserDto.email,
        emailVerified: false,
        image: null,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      };

      const hashSpy = jest.spyOn(bcrypt, 'hash') as unknown as jest.SpyInstance<Promise<string>, [string | Buffer, string | number]>;
      hashSpy.mockResolvedValue('hashed-password');
      prisma.user.create.mockResolvedValue(createdUser);
      settingsService.createSettingsForUserId.mockResolvedValue(undefined);

      const result = await userService.createUser(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          emailVerified: false,
          passwordHash: 'hashed-password',
          image: null,
        },
      });
      expect(settingsService.createSettingsForUserId).toHaveBeenCalledWith(createdUser.id);
      expect(result).toEqual(createdUser);
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user by email', async () => {
      const user = { id: '1', name: 'Hemant Sharma', email: 'hemant@hemantsharma.tech' };

      prisma.user.findUnique.mockResolvedValue(user);

      const result = await userService.findOneByEmail('hemant@hemantsharma.tech');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'hemant@hemantsharma.tech' } });
      expect(result).toEqual(user);
    });
  });

  describe('findOneByEmailWithPassword', () => {
    it('should return a user by email including passwordHash', async () => {
      const user = {
        id: '1',
        name: 'Hemant Sharma',
        email: 'hemant@hemantsharma.tech',
        passwordHash: 'hashed-password',
      };

      prisma.user.findUnique.mockResolvedValue(user);

      const result = await userService.findOneByEmailWithPassword('hemant@hemantsharma.tech');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'hemant@hemantsharma.tech' },
        omit: { passwordHash: false },
      });
      expect(result).toEqual(user);
    });
  });
});
