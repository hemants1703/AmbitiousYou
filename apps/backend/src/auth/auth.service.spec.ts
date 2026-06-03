import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let mockUsersService: any;
  let prisma: any;

  beforeEach(async () => {
    mockUsersService = {
      findOneByEmail: jest.fn(),
      findOneByEmailWithPassword: jest.fn(),
      createUser: jest.fn(),
    };

    prisma = {
      session: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        deleteMany: jest.fn(),
      },
      verification: {
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registerUser', () => {
    const registerUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    it('should successfully register a new user', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue(null);

      const mockUser = {
        id: 'uuid-1',
        ...registerUserDto,
        emailVerified: false,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockSession = {
        id: 'session-uuid',
        userId: 'uuid-1',
        token: 'session-token',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ipAddress: null,
        userAgent: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.createUser.mockResolvedValue(mockUser);
      prisma.session.create.mockResolvedValue(mockSession);

      const result = await service.registerUser(registerUserDto);

      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(registerUserDto.email);
      expect(mockUsersService.createUser).toHaveBeenCalledWith(registerUserDto);
      expect(prisma.session.create).toHaveBeenCalled();
      expect(result).toEqual({ sessionToken: 'session-token' });
    });

    it('should throw ConflictException if email already exists', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue({ id: 'uuid-2', ...registerUserDto });

      await expect(service.registerUser(registerUserDto)).rejects.toThrow(ConflictException);
      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(registerUserDto.email);
    });

    it('should throw ConflictException with correct message if email exists', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue({ id: 'uuid-2' });

      await expect(service.registerUser(registerUserDto)).rejects.toThrow('Email is already in use');
    });
  });

  describe('loginUser', () => {
    const loginUserDto = {
      email: 'john@example.com',
      password: 'password123',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0',
    };

    it('should successfully login a user', async () => {
      const mockUser = {
        id: 'uuid-1',
        name: 'John Doe',
        email: loginUserDto.email,
        passwordHash: 'hashedPassword',
        emailVerified: true,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockSession = {
        id: 'session-uuid',
        userId: 'uuid-1',
        token: 'session-token',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ipAddress: loginUserDto.ipAddress,
        userAgent: loginUserDto.userAgent,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.findOneByEmailWithPassword.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      prisma.session.create.mockResolvedValue(mockSession);

      const result = await service.loginUser(loginUserDto);

      expect(mockUsersService.findOneByEmailWithPassword).toHaveBeenCalledWith(loginUserDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginUserDto.password, mockUser.passwordHash);
      expect(prisma.session.create).toHaveBeenCalled();
      expect(result).toEqual({ sessionToken: 'session-token' });
    });

    it('should throw ConflictException if user email not found', async () => {
      mockUsersService.findOneByEmailWithPassword.mockResolvedValue(null);

      await expect(service.loginUser(loginUserDto)).rejects.toThrow(ConflictException);
      expect(mockUsersService.findOneByEmailWithPassword).toHaveBeenCalledWith(loginUserDto.email);
    });

    it('should throw ConflictException if user email not found with correct message', async () => {
      mockUsersService.findOneByEmailWithPassword.mockResolvedValue(null);

      await expect(service.loginUser(loginUserDto)).rejects.toThrow('Invalid email or password');
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockUsersService.findOneByEmailWithPassword.mockResolvedValue({
        id: 'uuid-1',
        email: loginUserDto.email,
        passwordHash: 'hashedPassword',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.loginUser(loginUserDto)).rejects.toThrow('Invalid email or password');
    });

    it('should throw UnauthorizedException with correct message if password is invalid', async () => {
      mockUsersService.findOneByEmailWithPassword.mockResolvedValue({
        id: 'uuid-1',
        email: loginUserDto.email,
        passwordHash: 'hashedPassword',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      try {
        await service.loginUser(loginUserDto);
        fail('Should have thrown UnauthorizedException');
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Invalid email or password');
      }
    });
  });
});
